import {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  protocol,
  net,
  session,
  type IpcMainInvokeEvent,
} from 'electron';
import path from 'node:path';
import { promises as fs, readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { validateProfile } from '../shared/profile';
import { ProfileStore } from './store';
app.setName('STROIDS');
if (process.env.STROIDS_DATA_DIR)
  app.setPath('userData', path.resolve(process.env.STROIDS_DATA_DIR));
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'stroids',
    privileges: { standard: true, secure: true, supportFetchAPI: true },
  },
]);
let window: BrowserWindow | null = null;
const development = !app.isPackaged && process.env.STROIDS_DEV === '1';
const origin = development ? 'http://127.0.0.1:5173' : 'stroids://app';
function authorize(event: IpcMainInvokeEvent) {
  if (
    !window ||
    event.sender !== window.webContents ||
    event.senderFrame !== window.webContents.mainFrame ||
    !event.senderFrame.url.startsWith(origin + '/')
  )
    throw new Error('Untrusted request.');
}
app.whenReady().then(async () => {
  const store = new ProfileStore(app.getPath('userData'));
  const renderer = path.resolve(
    __dirname,
    app.isPackaged ? '../renderer' : '../../dist/renderer',
  );
  if (!development)
    protocol.handle('stroids', (request) => {
      const url = new URL(request.url),
        name =
          decodeURIComponent(url.pathname) === '/'
            ? 'index.html'
            : decodeURIComponent(url.pathname).replace(/^\//, '');
      const target = path.resolve(renderer, name);
      if (url.host !== 'app' || !target.startsWith(renderer + path.sep))
        return new Response('Not found', { status: 404 });
      return net.fetch(pathToFileURL(target).toString());
    });
  session.defaultSession.setPermissionRequestHandler(
    (_contents, _permission, callback) => callback(false),
  );
  session.defaultSession.setPermissionCheckHandler(() => false);
  const localAssetPrefix = pathToFileURL(renderer + path.sep).toString();
  session.defaultSession.webRequest.onBeforeRequest((details, callback) =>
    callback({
      cancel:
        !details.url.startsWith(origin + '/') &&
        !details.url.startsWith(localAssetPrefix) &&
        !(development && details.url.startsWith('ws://127.0.0.1:5173/')) &&
        !details.url.startsWith('data:'),
    }),
  );
  let bounds = { width: 1440, height: 960, maximized: false };
  const stateFile = path.join(app.getPath('userData'), 'window.json');
  try {
    const saved = JSON.parse(readFileSync(stateFile, 'utf8'));
    if (Number.isFinite(saved.width) && Number.isFinite(saved.height))
      bounds = {
        width: Math.min(2560, Math.max(900, saved.width)),
        height: Math.min(1600, Math.max(680, saved.height)),
        maximized: saved.maximized === true,
      };
  } catch {
    /* First launch or invalid layout uses safe defaults. */
  }
  window = new BrowserWindow({
    width: bounds.width,
    height: bounds.height,
    minWidth: 900,
    minHeight: 680,
    frame: false,
    backgroundColor: '#10120f',
    title: 'STROIDS',
    icon: path.join(
      __dirname,
      app.isPackaged ? '../icon.ico' : '../../public/icon.ico',
    ),
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  window.setMenu(null);
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  window.webContents.on('will-navigate', (event) => event.preventDefault());
  ipcMain.handle('profile:load', (event) => {
    authorize(event);
    return store.load();
  });
  ipcMain.handle('profile:save', (event, value: unknown) => {
    authorize(event);
    return store.save(value);
  });
  ipcMain.handle('profile:export', async (event, value: unknown) => {
    authorize(event);
    const profile = validateProfile(value);
    const result = await dialog.showSaveDialog(window!, {
      title: 'Export STROIDS flight log',
      defaultPath: 'stroids-flight-log.json',
      filters: [{ name: 'STROIDS flight log', extensions: ['json'] }],
    });
    if (result.canceled || !result.filePath) return false;
    await fs.writeFile(
      result.filePath,
      JSON.stringify(profile, null, 2),
      'utf8',
    );
    return true;
  });
  ipcMain.handle('profile:import', async (event) => {
    authorize(event);
    const result = await dialog.showOpenDialog(window!, {
      title: 'Import STROIDS flight log',
      properties: ['openFile'],
      filters: [{ name: 'STROIDS flight log', extensions: ['json'] }],
    });
    if (result.canceled || !result.filePaths[0]) return null;
    const filename = result.filePaths[0];
    if ((await fs.stat(filename)).size > 256000)
      throw new Error('Flight log is too large (maximum 250 KB).');
    return validateProfile(JSON.parse(await fs.readFile(filename, 'utf8')));
  });
  ipcMain.handle('window:action', (event, action: unknown) => {
    authorize(event);
    if (action === 'minimize') window!.minimize();
    else if (action === 'maximize') {
      if (window!.isMaximized()) window!.unmaximize();
      else window!.maximize();
    } else if (action === 'close') window!.close();
    else throw new Error('Unknown window action.');
  });
  let closing = false;
  window.on('close', (event) => {
    if (closing) return;
    event.preventDefault();
    closing = true;
    const rect = window!.getNormalBounds();
    try {
      writeFileSync(
        stateFile,
        JSON.stringify({
          width: rect.width,
          height: rect.height,
          maximized: window!.isMaximized(),
        }),
      );
    } catch {
      /* Profile errors surface in the UI; window layout is best effort. */
    }
    void store
      .flush()
      .catch(() => {})
      .then(() => window?.close());
  });
  window.on('closed', () => {
    window = null;
  });
  window.once('ready-to-show', () => {
    if (bounds.maximized) window!.maximize();
    window!.show();
  });
  if (development) await window.loadURL(origin + '/');
  else await window.loadURL('stroids://app/');
});
app.on('window-all-closed', () => app.quit());
