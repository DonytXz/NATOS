'use strict';

const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

function patchFile(relativePath, search, replacement) {
  const filePath = path.join(projectRoot, 'node_modules', relativePath);

  if (!fs.existsSync(filePath)) {
    console.warn(`Skipping compatibility patch: ${relativePath} is not installed.`);
    return;
  }

  const source = fs.readFileSync(filePath, 'utf8');

  if (source.includes(search)) {
    fs.writeFileSync(filePath, source.replace(search, replacement));
    console.log(`Patched ${relativePath} for current Node.js releases.`);
  } else if (!source.includes(replacement)) {
    console.warn(`Skipping compatibility patch: ${relativePath} has changed.`);
  }
}

const deprecatedImport = "let extend = require('util')._extend";
patchFile(
  'circular-dependency-plugin/index.js',
  deprecatedImport,
  'let extend = Object.assign'
);

patchFile(
  'webpack/lib/util/createHash.js',
  'module.exports = algorithm => {',
  'module.exports = algorithm => {\n\tif (algorithm === "md4") algorithm = "sha256";'
);

patchFile(
  'loader-utils/lib/getHashDigest.js',
  "hashType = hashType || 'md4';",
  "hashType = hashType || 'sha256';"
);

[
  'babel-loader/lib/cache.js',
  'copy-webpack-plugin/dist/postProcessPattern.js',
  'webpack/node_modules/terser-webpack-plugin/dist/index.js'
].forEach(relativePath => {
  const filePath = path.join(projectRoot, 'node_modules', relativePath);

  if (!fs.existsSync(filePath)) {
    return;
  }

  const source = fs.readFileSync(filePath, 'utf8');
  const patched = source
    .replace(/createHash\('md4'\)/g, "createHash('sha256')")
    .replace(/createHash\("md4"\)/g, 'createHash("sha256")');

  if (patched !== source) {
    fs.writeFileSync(filePath, patched);
    console.log(`Patched ${relativePath} for current Node.js releases.`);
  }
});
