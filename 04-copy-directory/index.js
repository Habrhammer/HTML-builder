const fs = require('fs').promises;
const path = require('path');

async function copyDir() {
  const srcPath = `${__dirname}/files`;
  const destPath = `${__dirname}/files-copy`;

  await fs.mkdir(destPath, { recursive: true });

  const srcEntries = await fs.readdir(srcPath, { withFileTypes: true });

  const entryNames = srcEntries.map((entry) => entry.name);

  srcEntries.forEach(async (entry) => {
    const srcFilePath = path.join(srcPath, entry.name);
    const destFilePath = path.join(destPath, entry.name);
    await fs.copyFile(srcFilePath, destFilePath);
  });

  const destEntries = await fs.readdir(destPath, { withFileTypes: true });

  destEntries.forEach(async (entry) => {
    if (!entryNames.includes(entry.name)) {
      const destFilePath = path.join(destPath, entry.name);
      await fs.unlink(destFilePath);
    }
  });
}

copyDir()
  .then(() => console.log('Success!'))
  .catch(console.error('Error!'));
