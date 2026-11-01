const { _electron: electron } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
async function main() {
  const root = path.resolve(__dirname, '../..'),
    data = fs.mkdtempSync(path.join(os.tmpdir(), 'stroids-desktop-')),
    env = { ...process.env, STROIDS_DATA_DIR: data };
  delete env.ELECTRON_RUN_AS_NODE;
  const executable = process.env.STROIDS_EXECUTABLE;
  const options = executable
    ? { executablePath: path.resolve(executable), env, args: [] }
    : { args: [root], env };
  let app;
  try {
    app = await electron.launch(options);
    const page = await app.firstWindow();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.waitForSelector('#start-btn');
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.evaluate(() => typeof window.require), 'undefined');
    assert.equal(await page.evaluate(() => typeof window.process), 'undefined');
    assert.equal(
      await page.evaluate(() => typeof window.desktop.saveProfile),
      'function',
    );
    assert.match(page.url(), /^stroids:\/\/app\//);
    await page.getByRole('button', { name: 'SETTINGS', exact: true }).click();
    await page.getByRole('checkbox', { name: /SOUND EFFECTS/ }).uncheck();
    await page.getByRole('button', { name: 'Close panel' }).click();
    await page.evaluate(async () => {
      const result = await window.desktop.loadProfile();
      await window.desktop.saveProfile({
        ...result.profile,
        settings: { ...result.profile.settings, sound: false },
        runs: [
          { score: 7200, wave: 5, seconds: 90, date: '2026-11-01T12:00:00Z' },
        ],
      });
    });
    await page.reload();
    await page.waitForSelector('#start-btn');
    await page.getByText('PERSONAL BEST 007200').waitFor();
    await page.getByRole('button', { name: 'SETTINGS', exact: true }).click();
    assert.equal(
      await page.getByRole('checkbox', { name: /SOUND EFFECTS/ }).isChecked(),
      false,
    );
    await page.getByRole('button', { name: 'Close panel' }).click();
    const rejected = await page.evaluate(async () => {
      try {
        await window.desktop.saveProfile({ schemaVersion: 99 });
        return false;
      } catch {
        return true;
      }
    });
    assert.equal(rejected, true);
    const exportFile = path.join(data, 'export.json');
    await app.evaluate(({ dialog }, file) => {
      dialog.showSaveDialog = async () => ({ canceled: false, filePath: file });
    }, exportFile);
    await page.getByRole('button', { name: 'FLIGHT LOG', exact: true }).click();
    await page.getByRole('button', { name: 'EXPORT LOG' }).click();
    await page.getByRole('status').filter({ hasText: 'exported' }).waitFor();
    assert.equal(
      JSON.parse(fs.readFileSync(exportFile, 'utf8')).runs[0].score,
      7200,
    );
    await app.evaluate(({ dialog }, file) => {
      dialog.showOpenDialog = async () => ({
        canceled: false,
        filePaths: [file],
      });
    }, exportFile);
    await page.getByRole('button', { name: 'IMPORT LOG' }).click();
    await page.getByRole('button', { name: 'REPLACE FLIGHT LOG' }).waitFor();
    await page.getByRole('button', { name: 'REPLACE FLIGHT LOG' }).click();
    await page.getByRole('status').filter({ hasText: 'imported' }).waitFor();
    await page.getByRole('button', { name: 'Close panel' }).click();
    await page.getByRole('button', { name: 'LAUNCH RUN' }).click();
    await page.keyboard.down('ArrowUp');
    await page.evaluate(() => window.advanceTime(500));
    await page.keyboard.up('ArrowUp');
    assert.equal(
      await page.evaluate(() => JSON.parse(window.render_game_to_text()).mode),
      'running',
    );
    await page.keyboard.press('p');
    assert.equal(
      await page.evaluate(() => JSON.parse(window.render_game_to_text()).mode),
      'paused',
    );
    await page.screenshot({
      path: path.join(os.tmpdir(), 'stroids-qa', 'desktop.png'),
    });
    const isolated = await app.evaluate(({ BrowserWindow }) => {
      const p =
        BrowserWindow.getAllWindows()[0].webContents.getLastWebPreferences();
      return {
        sandbox: p.sandbox,
        contextIsolation: p.contextIsolation,
        nodeIntegration: p.nodeIntegration,
      };
    });
    assert.deepEqual(isolated, {
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
    });
    await page
      .getByRole('button', { name: 'Maximize or restore window' })
      .click();
    assert.equal(
      await app.evaluate(({ BrowserWindow }) =>
        BrowserWindow.getAllWindows()[0].isMaximized(),
      ),
      true,
    );
    await page
      .getByRole('button', { name: 'Maximize or restore window' })
      .click();
    assert.equal(
      await app.evaluate(({ BrowserWindow }) =>
        BrowserWindow.getAllWindows()[0].isMaximized(),
      ),
      false,
    );
    const before = page.url();
    await page.evaluate(() => window.open('https://example.com'));
    assert.equal(app.windows().length, 1);
    assert.equal(page.url(), before);
    assert.deepEqual(errors, []);
    await app.close();
    app = null;
    if (!executable) {
      const saved = JSON.parse(
        fs.readFileSync(path.join(data, 'profile.json'), 'utf8'),
      );
      assert.equal(saved.runs[0].score, 7200);
      assert.equal(saved.settings.sound, false);
      app = await electron.launch(options);
      const reopened = await app.firstWindow();
      await reopened.waitForSelector('#start-btn');
      await reopened.getByText('PERSONAL BEST 007200').waitFor();
      await app.close();
      app = null;
    }
    console.log(
      'PASS: built desktop protocol/assets, isolated preload, JSON validation/save/reload, movement/pause, window controls, blocked popups and persisted relaunch.',
    );
  } finally {
    if (app) await app.close();
    fs.rmSync(data, { recursive: true, force: true });
  }
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
