var fs = require('fs');

function CopyAssetsPlugin() {
}
CopyAssetsPlugin.prototype.apply = function(compiler) {
  compiler.plugin('done', function() {
    init();
  });
};
function init() {
  createIfDoesntExist('./build');
  createIfDoesntExist('./build/public');
  createIfDoesntExist('./build/public/images');
  copySync('./src/favicon.ico', './build/public/favicon.ico', true);
  copySync('./src/manifest.json', './build/public/manifest.json', true);
  copySync('./src/app/assets/images/nested-24.png', './build/public/images/nested-24.png', true);
  copySync('./src/app/assets/images/nested-48.png', './build/public/images/nested-48.png', true);
  copySync('./src/app/assets/images/nested-72.png', './build/public/images/nested-72.png', true);
  copySync('./src/app/assets/images/nested-96.png', './build/public/images/nested-96.png', true);
  copySync('./src/app/assets/images/nested-144.png', './build/public/images/nested-144.png', true);
  copySync('./src/app/assets/images/nested-168.png', './build/public/images/nested-168.png', true);
  copySync('./src/app/assets/images/nested-192.png', './build/public/images/nested-192.png', true);
  copySync('./src/app/assets/images/nested-512.png', './build/public/images/nested-512.png', true);
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

module.exports = CopyAssetsPlugin;
