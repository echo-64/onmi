const { existsSync, readFileSync, writeFileSync, cpSync } = require("node:fs");
const { join, dirname } = require("node:path");
const { style, yn, warning, canceled } = require("./helpers");
const prompt = require("./prompt");

function modules(o) {
  const node_modules = [];
  const dependencies = {};
  const devDependencies = {};

  presentModules(o)
    .then(() => {
      for (const module of o.install) {
        const pj = getModule(module);

        dependencies[module] = pj.version;

        if (!node_modules.includes(module)) {
          node_modules.push(module);
          pj.dependencies.forEach(handleDependency);
        }
      }

      for (const module of o["save-dev"]) {
        const pj = getModule(module);

        devDependencies[module] = pj.version;

        if (!node_modules.includes(module)) {
          node_modules.push(module);
          pj.dependencies.forEach(handleDependency);
        }
      }
    })
    .then(() => {
      console.log(style("bold", "\nnode_modules: ["));

      node_modules.forEach((package) => {
        const source = join(o.from, package);
        const dest = join(o.to, package);
        cpSync(source, dest, { recursive: true });
        console.log("  " + package);
      });

      console.log(style("bold", "];"));

      const packageFile = join(dirname(o.to), "package.json");
      const packageJson = JSON.parse(readFileSync(packageFile));
      const depLen = Object.keys(dependencies).length;
      const devLen = Object.keys(devDependencies).length;

      if (depLen) {
        if (!packageJson.dependencies) packageJson.dependencies = {};
        Object.assign(packageJson.dependencies, dependencies);
        console.log(style("bold", "\ndependencies:"), dependencies);
      }

      if (devLen) {
        if (!packageJson.devDependencies) packageJson.devDependencies = {};
        Object.assign(packageJson.devDependencies, devDependencies);
        console.log(style("bold", "\ndevDependencies:"), devDependencies);
      }

      writeFileSync(packageFile, JSON.stringify(packageJson, null, 2), "utf8");
      
      console.log(style("bold", "\nDone."));
    })
    .catch(console.log);

  function presentModules(o) {
    return new Promise(function (res, rej) {
      const doesnt = o.install.concat(o["save-dev"]).filter((module) => {
        return existsSync(join(o.from, module)) ? null : module;
      });

      if (doesnt.length) {
        prompt(
          warning(`missing modules [${doesnt.toString().split(",").join(", ")}], continue? ${yn}`),
          function (ans) {
            if (ans == "y") {
              const [i, d] = [o.install, o["save-dev"]];

              doesnt.forEach((module) => {
                if (i.includes(module)) o.install.splice(i.indexOf(module), 1);
                if (d.includes(module))
                  o["save-dev"].splice(d.indexOf(module), 1);
              });

              res();
            } else rej(canceled("please make sure all modules are present"));
          });
      } else res();
    });
  }

  function getModule(name) {
    const file = join(o.from, name, "package.json");
    const json = JSON.parse(readFileSync(file, "utf8"));

    return {
      version: json.version,
      dependencies: Object.keys(json.dependencies || {}),
    };
  }

  function handleDependency(dep) {
    if (!node_modules.includes(dep)) {
      node_modules.push(dep);
      getModule(dep).dependencies.forEach(handleDependency);
    }
  }
}

module.exports = modules;
