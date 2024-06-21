const { existsSync, mkdirSync, writeFileSync, readFileSync } = require("node:fs");
const { join } = require("node:path");
const { style, yn, warning, canceled, error } = require("./helpers");
const parseArgv = require("./parseArgv");
const prompt = require("./prompt");
const modules = require("./modules");

function options() {
  const o = parseArgv();
  const cwd = process.cwd();
  const [i, d] = [o.install, o["save-dev"]];

  if (o.help) help();
  if (o.version) version();

  if (i || d) {
    if (i) o.install = i.includes(",") ? i.split(",") : [i];
    else o.install = [];

    if (d) o["save-dev"] = d.includes(",") ? d.split(",") : [d];
    else o["save-dev"] = [];
  } else error("No installation argument:", "please provide at least one module for installation.");

  if (o.from) {
    const node_modules = join(o.from, "node_modules");
    if (existsSync(node_modules)) o.from = node_modules;
    else error("--from:", `couldn't found node_modules folder in ${o.from}.`);
  } else error("--from:", `must be of type string, Received: ${typeof o.from}.`);

  new Promise((resolve, reject) => {
    const node_modules = join(o.to ? o.to : cwd, "node_modules");
    const packageJson = join(o.to ? o.to : cwd, "package.json");

    if (!existsSync(node_modules) || !existsSync(packageJson)) {
      prompt(
        warning(`--to path, node_modules or package.json doesnt exist, create missing and continue? ${yn}`),
        function (ans) {
          if (ans == "y") {
            if (!existsSync(node_modules)) mkdirSync(node_modules, { recursive: true });
            if (!existsSync(packageJson)) writeFileSync(packageJson, "{}", "utf8");
            o.to = node_modules;
            resolve(o);
          } else reject(canceled(`please initialize --to path first.`));
      });
    } else {
      o.to = node_modules;
      resolve(o);
    }
  })
    .then(modules)
    .catch(console.log);

  function help() {
    console.log(`
  ${style("bold", "onmi")} is a cli tool for installing Node modules and their
  dependencies from any project or pre-installed local modules, without an internet connection

  ${style("blueBright", "Options:")}
  -i, --install    Add the module to the 'dependencies' field in the target package.json.
  -D, --save-dev   Add the module to the 'devDependencies' field in the target package.json.
  -f, --from       The directory where the required module is installed (copying the module from).
  -t, --to         The directory where the module will be installed  (copying the module to).
  -v, --version    Bump a package version.
  -h, --help       More involved overview.
  
  ${style("blueBright", "Usage:")}
    onmi -i sass -D gulp,gulp-postcss,cssnano -f ~/prevProject -t ~/currProject
  `);
    process.exit();
  }

  function version() {
    const v = JSON.parse(readFileSync(join(__dirname, "../package.json"), "utf8")).version;
    console.log(`onmi@${v} ${__dirname}`);
    process.exit();
  }
}

module.exports = options;
