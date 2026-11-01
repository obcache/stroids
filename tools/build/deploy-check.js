const fs = require('node:fs'),
  path = require('node:path'),
  crypto = require('node:crypto');
const root = path.resolve(__dirname, '../..'),
  pkg = require(path.join(root, 'package.json'));
const required = [
  'dist/renderer/index.html',
  'dist/renderer/art/sprites.png',
  'dist/renderer/icon.ico',
  'dist/renderer/THIRD_PARTY_NOTICES.txt',
  'dist/desktop/STROIDS-win32-x64/STROIDS.exe',
  'dist/desktop/STROIDS-win32-x64/resources/app.asar',
  `dist/STROIDS-Setup-${pkg.version}.exe`,
];
for (const file of required) {
  const target = path.join(root, file);
  if (!fs.existsSync(target) || fs.statSync(target).size === 0)
    throw new Error('Missing or empty distribution file: ' + file);
}
const installer = required.at(-1),
  hash = crypto
    .createHash('sha256')
    .update(fs.readFileSync(path.join(root, installer)))
    .digest('hex');
fs.writeFileSync(
  path.join(root, 'dist/SHA256SUMS.txt'),
  hash + '  ' + path.basename(installer) + '\n',
);
console.log(
  'Distribution verified: renderer, bundled app, Windows installer. SHA256SUMS.txt updated.',
);
