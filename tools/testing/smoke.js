const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');
async function main() {
  const browser = await chromium.launch({ headless: true }),
    artifacts = path.join(os.tmpdir(), 'stroids-qa');
  fs.mkdirSync(artifacts, { recursive: true });
  const page = await browser.newPage({
      viewport: { width: 1536, height: 1024 },
    }),
    errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  const state = () =>
    page.evaluate(() => JSON.parse(window.render_game_to_text()));
  const step = (ms) => page.evaluate((ms) => window.advanceTime(ms), ms);
  try {
    await page.goto(process.env.STROIDS_URL || 'http://127.0.0.1:5173');
    await page.waitForSelector('#start-btn');
    await page.evaluate(() => document.fonts.ready);
    await step(1);
    assert.match(await page.title(), /STROIDS/);
    assert.equal((await state()).mode, 'ready');
    await page.keyboard.press('f');
    await page.waitForFunction(() => !!document.fullscreenElement);
    await page.keyboard.press('f');
    await page.waitForFunction(() => !document.fullscreenElement);
    await page.screenshot({ path: path.join(artifacts, 'launch.png') });
    await page
      .getByRole('button', { name: 'HOW TO PLAY', exact: true })
      .click();
    await page.getByRole('heading', { name: 'Know your ship.' }).waitFor();
    await page.getByRole('button', { name: 'Close panel' }).click();
    await page.getByRole('button', { name: 'SETTINGS', exact: true }).click();
    await page.getByRole('checkbox', { name: /ON-SCREEN CONTROLS/ }).check();
    await page.getByRole('checkbox', { name: /SOUND EFFECTS/ }).uncheck();
    await page.getByRole('button', { name: 'Close panel' }).click();
    await page.reload();
    await page.waitForSelector('#start-btn');
    await page.getByRole('button', { name: 'SETTINGS', exact: true }).click();
    assert.equal(
      await page
        .getByRole('checkbox', { name: /ON-SCREEN CONTROLS/ })
        .isChecked(),
      true,
    );
    assert.equal(
      await page.getByRole('checkbox', { name: /SOUND EFFECTS/ }).isChecked(),
      false,
    );
    await page.getByRole('button', { name: 'Close panel' }).click();
    await step(1);
    await page.keyboard.press('Enter');
    assert.equal((await state()).mode, 'running');
    const y = (await state()).ship.y;
    await page.keyboard.down('ArrowUp');
    await step(400);
    await page.keyboard.up('ArrowUp');
    assert.notEqual((await state()).ship.y, y);
    await page.keyboard.down('Space');
    await step(300);
    await page.keyboard.up('Space');
    assert((await state()).bullets.length > 0);
    await page.keyboard.down('ArrowRight');
    const angle = (await state()).ship.angle;
    await step(150);
    await page.keyboard.up('ArrowRight');
    assert((await state()).ship.angle > angle);
    await page.screenshot({ path: path.join(artifacts, 'gameplay.png') });
    await page.keyboard.press('p');
    assert.equal((await state()).mode, 'paused');
    const paused = await state();
    await step(1000);
    assert.equal((await state()).seconds, paused.seconds);
    await page.screenshot({ path: path.join(artifacts, 'paused.png') });
    await page.getByRole('button', { name: 'RESUME FLIGHT' }).click();
    assert.equal((await state()).mode, 'running');
    await page.getByRole('button', { name: 'SETTINGS', exact: true }).click();
    assert.equal((await state()).mode, 'paused');
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'RESUME FLIGHT' }).click();
    await page.getByRole('button', { name: 'thrust', exact: true }).hover();
    await page.mouse.down();
    await step(50);
    await page.mouse.up();
    assert.equal((await state()).input.thrust, false);
    // Natural collisions, with no test-only game state mutation.
    for (let i = 0; i < 120 && (await state()).mode !== 'over'; i++)
      await step(5000);
    assert.equal((await state()).mode, 'over');
    await page.getByRole('heading', { name: 'What a run.' }).waitFor();
    await page.screenshot({ path: path.join(artifacts, 'gameover.png') });
    await page.getByRole('button', { name: 'FLIGHT LOG', exact: true }).click();
    assert.equal(await page.locator('tbody tr').count(), 1);
    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: 'EXPORT LOG' }).click();
    const file = await download;
    const exported = JSON.parse(fs.readFileSync(await file.path(), 'utf8'));
    assert.equal(exported.schemaVersion, 1);
    assert.equal(exported.runs.length, 1);
    const imported = {
      ...exported,
      runs: [
        { score: 4200, wave: 4, seconds: 60, date: '2026-11-01T12:00:00Z' },
      ],
    };
    const chooser = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'IMPORT LOG' }).click();
    await (
      await chooser
    ).setFiles({
      name: 'flight.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(imported)),
    });
    await page.getByRole('button', { name: 'REPLACE FLIGHT LOG' }).waitFor();
    assert.equal(await page.locator('tbody tr').count(), 1);
    await page.getByRole('button', { name: 'REPLACE FLIGHT LOG' }).click();
    assert.match(await page.locator('tbody').innerText(), /004200/);
    const badChooser = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'IMPORT LOG' }).click();
    await (
      await badChooser
    ).setFiles({
      name: 'invalid.json',
      mimeType: 'application/json',
      buffer: Buffer.from('{"schemaVersion":99}'),
    });
    await page.getByRole('status').filter({ hasText: 'Unsupported' }).waitFor();
    assert.match(await page.locator('tbody').innerText(), /004200/);
    await page.getByRole('button', { name: 'Close panel' }).click();
    await page.getByRole('button', { name: 'ONE MORE RUN' }).click();
    assert.equal((await state()).score, 0);
    assert.equal((await state()).lives, 3);
    await page.keyboard.press('p');
    await page.getByRole('button', { name: 'END RUN & RETURN HOME' }).click();
    assert.equal((await state()).mode, 'ready');
    await page.getByRole('button', { name: 'Dismiss message' }).click();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({
      path: path.join(artifacts, 'mobile.png'),
      fullPage: true,
    });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
    );
    await page.setViewportSize({ width: 900, height: 680 });
    await page.screenshot({
      path: path.join(artifacts, 'compact.png'),
      fullPage: true,
    });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
    );
    assert.deepEqual(errors, []);
    console.log(
      'PASS: launch, help, persisted settings, keyboard flight/fire, pause/resume, touch, natural game over, saved score, JSON export/import/rejection, restart and responsive checks.',
    );
    console.log('Screenshots: ' + artifacts);
  } finally {
    await browser.close();
  }
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
