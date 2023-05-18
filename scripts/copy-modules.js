// copy-modules.js
var fs = require('fs');
var path = require('path');

var srcDir = path.resolve(
  __dirname,
  './../../pkgs/react-native-audio-record/ios',
);
var destDir = path.resolve(
  __dirname,
  './../node_modules/react-native-audio-record/ios',
);

fs.readdir(srcDir, function (err, files) {
  if (err) {
    return console.error('Could not list the directory.', err);
  }

  files.forEach(function (file, index) {
    var srcFile = path.join(srcDir, file);
    var destFile = path.join(destDir, file);

    if (fs.statSync(srcFile).isFile()) {
      fs.copyFileSync(srcFile, destFile);
    }
  });
});
