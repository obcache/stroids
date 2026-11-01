const fs = require('node:fs'),
  path = require('node:path'),
  os = require('node:os'),
  { execFileSync } = require('node:child_process');
async function main() {
  const key =
    'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\{5D02F9DC-CC71-4C27-B2B1-A5EF92B73952}_is1';
  let installed = false;
  try {
    execFileSync('reg', ['query', key], { stdio: 'ignore', windowsHide: true });
    installed = true;
  } catch {}
  if (installed)
    throw new Error(
      'A STROIDS installation already exists. Installer smoke test stopped to preserve it.',
    );
  const root = path.resolve(__dirname, '../..'),
    pkg = require(path.join(root, 'package.json'));
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'stroids-install-'));
  if (
    !path.resolve(target).startsWith(path.resolve(os.tmpdir()) + path.sep) ||
    !path.basename(target).startsWith('stroids-install-')
  )
    throw new Error('Unsafe installer test directory.');
  let uninstall;
  try {
    execFileSync(
      path.join(root, `dist/STROIDS-Setup-${pkg.version}.exe`),
      [
        '/VERYSILENT',
        '/SUPPRESSMSGBOXES',
        '/NORESTART',
        '/NOICONS',
        '/DIR=' + target,
      ],
      { windowsHide: true, stdio: 'inherit' },
    );
    const exe = path.join(target, 'STROIDS.exe');
    if (!fs.existsSync(exe)) throw new Error('Installed executable missing.');
    uninstall = path.join(target, 'unins000.exe');
    execFileSync(process.execPath, [path.join(__dirname, 'desktop.js')], {
      env: { ...process.env, STROIDS_EXECUTABLE: exe },
      stdio: 'inherit',
      windowsHide: true,
    });
  } finally {
    if (uninstall && fs.existsSync(uninstall))
      execFileSync(
        uninstall,
        ['/VERYSILENT', '/SUPPRESSMSGBOXES', '/NORESTART'],
        { stdio: 'inherit', windowsHide: true },
      );
    if (fs.existsSync(path.join(target, 'STROIDS.exe')))
      throw new Error(
        'Uninstall did not remove the executable. Test folder retained: ' +
          target,
      );
    fs.rmSync(target, { recursive: true, force: true });
  }
  console.log(
    'PASS: isolated no-shortcut installer, installed application smoke test and clean uninstall.',
  );
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
