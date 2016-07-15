const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

module.exports = function(_projectName, options) {

  const projectName = _projectName || helpers.defaultProjectName();
  const projectDirectory = path.join(process.cwd(), projectName);

  //let's make sure the directory doesn't already exist
  if (helpers.directoryExists(projectDirectory)) {
    console.log(`directory "${projectName}" already exists.`);
    process.exit();
  }
    
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
  helpers.copyFile(path.join(moduleLibsDir, 'p5.js'), path.join(projectDirectory, 'libraries', 'p5.js'));

  // adding the libraries
  libraries.forEach(function(lib) {
      helpers.copyFile(path.join(moduleLibsDir, 'lib',  lib), path.join(projectDirectory, 'libraries', lib));
  });

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
}
