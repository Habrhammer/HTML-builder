const fs = require('fs/promises');
const path = require('path');
const folderPath = `${__dirname}/secret-folder/`;

fs.readdir(folderPath).then((files) => {
  files.forEach((file) => {
    fs.stat(`${folderPath}${file}`).then((stats) => {
      if (stats.isFile()) {
        const { name, ext } = path.parse(`${folderPath}${file}`);
        console.log(`${name} - ${ext.slice(1)} - ${stats.size / 1024}kb`);
      }
    });
  });
});
