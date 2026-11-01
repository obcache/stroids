import { describe, it, expect } from 'vitest';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { defaultProfile, validateProfile, recordRun } from '../shared/profile';
import { ProfileStore } from '../electron/store';
const run = { score: 500, wave: 2, seconds: 12, date: '2026-11-01T12:00:00Z' };
describe('versioned local flight log', () => {
  it('round-trips settings and scores and rejects unknown schemas', () => {
    const p = recordRun(defaultProfile(), run);
    expect(validateProfile(JSON.parse(JSON.stringify(p))).runs[0].score).toBe(
      500,
    );
    expect(() => validateProfile({ ...p, schemaVersion: 2 })).toThrow(
      'version',
    );
  });
  it('rejects malformed values rather than partially importing them', () => {
    const p = defaultProfile();
    for (const value of [
      null,
      {},
      { ...p, settings: { ...p.settings, volume: 2 } },
      { ...p, runs: [{ ...run, score: -1 }] },
      { ...p, runs: [{ ...run, date: 'yesterday' }] },
      { ...p, runs: [{ ...run, wave: 0 }] },
    ])
      expect(() => validateProfile(value)).toThrow();
  });
  it('keeps the latest 100 runs and removes arbitrary imported fields', () => {
    let p = defaultProfile();
    for (let i = 0; i < 110; i++) p = recordRun(p, { ...run, score: i });
    expect(p.runs.length).toBe(100);
    expect(p.runs[0].score).toBe(109);
    expect(validateProfile({ ...p, malicious: 'ignored' })).not.toHaveProperty(
      'malicious',
    );
  });
  it('serializes writes atomically and recovers a corrupt log with a backup', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'stroids-store-'));
    try {
      const s = new ProfileStore(dir);
      expect((await s.load()).profile).toEqual(defaultProfile());
      const first = recordRun(defaultProfile(), run),
        second = recordRun(first, { ...run, score: 900 });
      await Promise.all([s.save(first), s.save(second)]);
      expect((await s.load()).profile.runs[0].score).toBe(900);
      expect(await fs.readdir(dir)).toEqual(['profile.json']);
      await fs.writeFile(s.file, 'broken json');
      const recovered = await s.load();
      expect(recovered.warning).toContain('backup');
      const backup = (await fs.readdir(dir)).find((x) => x.endsWith('.bak'))!;
      expect(await fs.readFile(path.join(dir, backup), 'utf8')).toBe(
        'broken json',
      );
    } finally {
      await fs.rm(dir, { recursive: true, force: true });
    }
  });
});
