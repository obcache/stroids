import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
describe('first-party version synchronization', () => {
  for (const [mode, version] of [
    ['patch', '1.2.4'],
    ['minor', '1.3.0'],
    ['major', '2.0.0'],
  ])
    it(`${mode} updates all release locations without changing vendor packages`, () => {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'stroids-version-'));
      try {
        fs.mkdirSync(path.join(dir, 'tools/project-mgmt'), { recursive: true });
        fs.mkdirSync(path.join(dir, 'installer'));
        fs.mkdirSync(path.join(dir, 'node_modules/vendor'), {
          recursive: true,
        });
        for (const file of [
          'version-sync.js',
          'version-bump.js',
          'version-show.js',
        ])
          fs.copyFileSync(
            path.resolve('tools/project-mgmt', file),
            path.join(dir, 'tools/project-mgmt', file),
          );
        fs.writeFileSync(
          path.join(dir, 'package.json'),
          JSON.stringify({
            version: '1.2.3',
            dependencies: { vendor: '7.8.9' },
          }),
        );
        fs.writeFileSync(
          path.join(dir, 'package-lock.json'),
          JSON.stringify({
            version: '1.2.3',
            packages: {
              '': { version: '1.2.3' },
              'node_modules/vendor': { version: '7.8.9' },
            },
          }),
        );
        fs.writeFileSync(path.join(dir, 'VERSION'), '1.2.3');
        fs.writeFileSync(
          path.join(dir, 'installer/stroids.iss'),
          '#define MyAppVersion "1.2.3"\nVersionInfoVersion=1.2.3\n',
        );
        fs.writeFileSync(
          path.join(dir, 'node_modules/vendor/package.json'),
          '{"version":"7.8.9"}',
        );
        execFileSync(
          process.execPath,
          ['tools/project-mgmt/version-bump.js', mode],
          { cwd: dir, stdio: 'pipe' },
        );
        const pkg = JSON.parse(
            fs.readFileSync(path.join(dir, 'package.json'), 'utf8'),
          ),
          lock = JSON.parse(
            fs.readFileSync(path.join(dir, 'package-lock.json'), 'utf8'),
          );
        expect(pkg.version).toBe(version);
        expect(lock.version).toBe(version);
        expect(lock.packages[''].version).toBe(version);
        expect(fs.readFileSync(path.join(dir, 'VERSION'), 'utf8').trim()).toBe(
          version,
        );
        expect(
          fs.readFileSync(path.join(dir, 'installer/stroids.iss'), 'utf8'),
        ).toContain(`MyAppVersion "${version}"`);
        expect(pkg.dependencies.vendor).toBe('7.8.9');
        expect(lock.packages['node_modules/vendor'].version).toBe('7.8.9');
        expect(
          JSON.parse(
            fs.readFileSync(
              path.join(dir, 'node_modules/vendor/package.json'),
              'utf8',
            ),
          ).version,
        ).toBe('7.8.9');
      } finally {
        fs.rmSync(dir, { recursive: true, force: true });
      }
    });
});
