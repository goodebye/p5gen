#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const program = require('commander');

program
  .version('0.0.1')
  .option('-n, --name [project-name]', 'Project name')
  .parse(process.argv);

const projectName = program.name || defaultProjectName();
const projectDirectory = path.join(process.cwd(), projectName);
const moduleLibsDir = path.join(__dirname, 'p5');
const libsByName = {
  sound: 'p5.sound.js',
  dom: 'p5.dom.js',
}

const defaultLibs = ["sound", "dom"];
const libraries = defaultLibs.map((libName) => {
  return libsByName[libName];
});

// setting up folders
fs.mkdirSync(projectDirectory);
fs.mkdirSync(path.join(projectDirectory, 'libraries'));

// first we'll copy over the p5 library since that's needed for everything
copyFile(path.join(moduleLibsDir, 'p5.js'), path.join(projectDirectory, 'libraries', 'p5.js'));

// adding the libraries

libraries.forEach(function(lib) {
  fs
    .createReadStream(path.join(moduleLibsDir, 'lib',  lib))
    .pipe(fs.createWriteStream(path.join(projectDirectory, 'libraries', lib)));
})

// now let's set up the html file
const libraryHeader = libraries.map((lib) => {
  return`<script src="libraries/${lib}" type="text/javascript"></script>`;
}).join("\n    ");

const sketchHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>${projectName}</title>
    <script src="libraries/p5.js" type="text/javascript"></script>
    ${libraryHeader}
    <script src="sketch.js" type="text/javascript"></script>

    <style> body {padding: 0; margin: 0;} canvas {vertical-align: top;} </style>
  </head>
  <body>
  </body>
</html>`

fs.writeFileSync(path.join(projectDirectory, 'index.html'), sketchHtml);

// now let's create the sketch file

const sketchBoilerplate = `function setup() {
  
}

function draw() {
  
}`;

fs.writeFileSync(path.join(projectDirectory, 'sketch.js'), sketchBoilerplate);

function defaultProjectName() {
  return "sketch_0";  
}

function copyFile(src, dest) {
  fs
    .createReadStream(src)
    .pipe(fs.createWriteStream(dest));
}
