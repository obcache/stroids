const { spawn } = require('node:child_process');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
async function main() {
  const compile = spawn(
    process.execPath,
    [require.resolve('typescript/bin/tsc'), '-p', 'tsconfig.electron.json'],
    { cwd: root, stdio: 'inherit', windowsHide: true },
  );
  await new Promise((resolve, reject) =>
    compile.on('exit', (code) =>
      code === 0
        ? resolve()
        : reject(new Error('Electron compilation failed.')),
    ),
  );
  const server = spawn(
    process.execPath,
    [path.join(root, 'node_modules/vite/bin/vite.js'), '--host', '127.0.0.1'],
    { cwd: root, stdio: 'inherit', windowsHide: true },
  );
  process.on('exit', () => server.kill());
  for (let i = 0; i < 100; i++) {
    try {
      const response = await fetch('http://127.0.0.1:5173');
      if (response.ok) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
    if (i === 99) throw new Error('Vite did not start.');
  }
  const env = { ...process.env, STROIDS_DEV: '1' };
  delete env.ELECTRON_RUN_AS_NODE;
  const desktop = spawn(require('electron'), ['.'], {
    cwd: root,
    env,
    stdio: 'inherit',
    windowsHide: true,
  });
  desktop.on('exit', (code) => {
    server.kill();
    process.exitCode = code ?? 0;
  });
  process.on('SIGINT', () => {
    desktop.kill();
    server.kill();
  });
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
