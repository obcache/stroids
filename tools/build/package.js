const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { packager } = require('@electron/packager');
async function main() {
  const root = path.resolve(__dirname, '../..'),
    stage = path.resolve(root, '.tmp/package-source');
  if (
    !stage.startsWith(root + path.sep) ||
    path.relative(root, stage) !== path.join('.tmp', 'package-source')
  )
    throw new Error('Unsafe staging path.');
  fs.rmSync(stage, { recursive: true, force: true });
  fs.mkdirSync(stage, { recursive: true });
  const pkg = require(path.join(root, 'package.json'));
  fs.writeFileSync(
    path.join(stage, 'package.json'),
    JSON.stringify({
      name: pkg.name,
      productName: 'STROIDS',
      version: pkg.version,
      main: 'electron/main.js',
      description: pkg.description,
      author: pkg.author,
    }),
  );
  fs.cpSync(path.join(root, 'build/electron'), path.join(stage, 'electron'), {
    recursive: true,
  });
  fs.cpSync(path.join(root, 'build/shared'), path.join(stage, 'shared'), {
    recursive: true,
  });
  fs.cpSync(path.join(root, 'dist/renderer'), path.join(stage, 'renderer'), {
    recursive: true,
  });
  fs.copyFileSync(
    path.join(root, 'public/icon.ico'),
    path.join(stage, 'icon.ico'),
  );
  fs.copyFileSync(
    path.join(root, 'public/THIRD_PARTY_NOTICES.txt'),
    path.join(stage, 'THIRD_PARTY_NOTICES.txt'),
  );
  await packager({
    dir: stage,
    out: path.join(root, 'dist/desktop'),
    name: 'STROIDS',
    executableName: 'STROIDS',
    platform: 'win32',
    arch: 'x64',
    electronVersion: pkg.devDependencies.electron,
    icon: path.join(root, 'public/icon.ico'),
    overwrite: true,
    asar: true,
    prune: true,
    appVersion: pkg.version,
    win32metadata: {
      CompanyName: 'STROIDS',
      FileDescription: 'STROIDS arcade game',
      ProductName: 'STROIDS',
    },
  });
  const candidates = [
    process.env.ISCC_PATH,
    'C:/Program Files (x86)/Inno Setup 6/ISCC.exe',
    'C:/Program Files/Inno Setup 6/ISCC.exe',
  ].filter(Boolean);
  const compiler = candidates.find((file) => fs.existsSync(file));
  if (!compiler)
    throw new Error(
      'Portable app built. Install Inno Setup 6 or set ISCC_PATH, then rerun npm run package to create the installer.',
    );
  execFileSync(compiler, [path.join(root, 'installer/stroids.iss')], {
    cwd: root,
    stdio: 'inherit',
    windowsHide: true,
  });
  execFileSync(process.execPath, [path.join(__dirname, 'deploy-check.js')], {
    cwd: root,
    stdio: 'inherit',
  });
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
