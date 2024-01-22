const fs = require('fs').promises;
const path = require('path');

const templatePath = `${__dirname}/template.html`;
const componentsPath = `${__dirname}/components`;
const stylesPath = `${__dirname}/styles`;
const assetsPath = `${__dirname}/assets`;
const distPath = `${__dirname}/project-dist`;

async function copyDir(srcPath, destPath) {
  await fs.mkdir(destPath, { recursive: true });

  const srcEntries = await fs.readdir(srcPath, { withFileTypes: true });

  const entryNames = srcEntries.map((entry) => entry.name);

  srcEntries.forEach(async (entry) => {
    const srcFilePath = path.join(srcPath, entry.name);
    const destFilePath = path.join(destPath, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcFilePath, destFilePath);
    }
    if (entry.isFile()) {
      await fs.copyFile(srcFilePath, destFilePath);
    }
  });

  const destEntries = await fs.readdir(destPath, { withFileTypes: true });

  destEntries.forEach(async (entry) => {
    if (!entryNames.includes(entry.name)) {
      const destFilePath = path.join(destPath, entry.name);
      await fs.unlink(destFilePath);
    }
  });
}

async function bundleStyles(srcPath, destPath) {
  let styles = [];
  await fs.mkdir(destPath, { recursive: true });
  const files = await fs.readdir(srcPath);
  const cssFiles = files.filter((file) => path.extname(file) === '.css');

  for (let file of cssFiles) {
    const data = await fs.readFile(`${srcPath}/${file}`, 'utf8');
    styles.push(data);
  }
  await fs.writeFile(`${destPath}/style.css`, styles.join('\n'));
}

async function buildPage() {
  await fs.mkdir(distPath, { recursive: true });

  let template = await fs.readFile(templatePath, 'utf-8');

  const componentFiles = await fs.readdir(componentsPath);
  for (const file of componentFiles) {
    if (path.extname(file) === '.html') {
      const tagName = path.basename(file, '.html');
      console.log(tagName);
      const data = await fs.readFile(`${componentsPath}/${file}`, 'utf-8');
      template = template.replace(`{{${tagName}}}`, data);
    }
  }

  await copyDir(assetsPath, `${distPath}/assets`);
  await fs.writeFile(`${distPath}/index.html`, template);
  await bundleStyles(stylesPath, distPath);
}

buildPage();
