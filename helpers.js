const path = require('path');
const fs = require('fs');

module.exports.directoryExists = function(dir) {
  try {
    return fs.statSync(dir).isDirectory();
  }
  catch(e) {
    return false;
  }
}

module.exports.defaultProjectName = function() {
  console.log(this)
  let sketchNumber = 0;
  while (this.directoryExists(path.join(process.cwd(), `sketch_${sketchNumber.toString()}`))) {
    sketchNumber++;
  }
  return `sketch_${sketchNumber}`;
}

module.exports.copyFile = function(src, dest) {
  fs
    .createReadStream(src)
    .pipe(fs.createWriteStream(dest));
}
