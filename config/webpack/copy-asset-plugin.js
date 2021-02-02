var fs = require('fs');
const path = require('path');
function CopyAssetsPlugin() {
}
CopyAssetsPlugin.prototype.apply = function(compiler) {
  compiler.plugin('done', function() {
    init();
  });
};
function init() {
  createIfDoesntExist('./build');
  createIfDoesntExist('./build/m');
  copySync('./src/favicon.ico', './build/m/favicon.ico', true);
  copySync('./src/manifest.json', './build/m/manifest.json', true);
  copyFolderRecursiveSync('./src/app/assets/', './build/m/');
}
function copySync(src, dest, overwrite) {
  if (overwrite && fs.existsSync(dest)) {
    fs.unlinkSync(dest);
  }
  const data = fs.readFileSync(src);
  fs.writeFileSync(dest, data);
}
function createIfDoesntExist(dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }
}

function copyFolderRecursiveSync(source, target) {
  var files = [];

  //check if folder needs to be created or integrated
  var targetFolder = path.join(target, path.basename(source));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }

  //copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach(function (file) {
      var curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        copyFileSync(curSource, targetFolder);
      }
    });
  }
}
function copyFileSync(source, target) {
  var targetFile = target;

  //if target is a directory a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

module.exports = CopyAssetsPlugin;
