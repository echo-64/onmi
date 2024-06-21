<center><h1>onmi</h1></center>

Offline Node Module installer - cli tool for installing Node modules and their<br>
dependencies from any project or pre-installed local modules, without an internet connection

## Install

```
npm install --location=global onmi
```

## Options
```
-i, --install    Add the module to the 'dependencies' field in the package.json.
-D, --save-dev   Add the module to the 'devDependencies' field in the package.json.
-f, --from       The directory where the required module is installed (copying the module from).
-t, --to         The directory where the module will be installed (copying the module to).
-v, --version    Bump a package version.
-h, --help       More involved overview.
```

## Usage

Install `sass` as a dependency and `gulp`, `gulp-postcss`, `cssnano` as dev dependencies from `~/prevProject` to `~/currProject`

```
onmi -i sass -D gulp,gulp-postcss,cssnano -f ~/prevProject -t ~/currProject
```

if `~/currProject` doesn't exist, `node_modules` or `package.json` doesn't exist<br>
onmi will notify you, do i create them automatically or cancel?<br>

pressing `y` will 

1. Create `~/currProject`, `node_modules` or `package.json`.
2. Copy the required modules and their dependencies to the `node_modules` folder.
3. Write `{ dependencies: {...}, devDependencies: {...} }` to `package.json`<br>
   or add sass to dependencies field and gulp, gulp-postcss, cssnano to devDependencies field.

##  What's next
You tell me!<br>
Hit the ⭐ button if you found this useful.

## License
This project is licensed under the MIT license - see the [LICENSE](LICENSE) file for details
