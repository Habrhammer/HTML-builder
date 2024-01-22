const fs = require('fs').promises;
const path = require('path');

const srcPath = `${__dirname}/styles`;
const destPath = `${__dirname}/project-dist`;

async function bundleStyles() {
  let styles = [];
  await fs.mkdir(destPath, { recursive: true });
  const files = await fs.readdir(srcPath);
  const cssFiles = files.filter((file) => path.extname(file) === '.css');

  for (let file of cssFiles) {
    const data = await fs.readFile(`${srcPath}/${file}`, 'utf8');
    styles.push(data);
  }
  await fs.writeFile(`${destPath}/bundle.css`, styles.join('\n'));
}

bundleStyles();