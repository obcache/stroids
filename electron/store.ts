import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  defaultProfile,
  validateProfile,
  type Profile,
} from '../shared/profile';
export class ProfileStore {
  private tail: Promise<void> = Promise.resolve();
  constructor(readonly directory: string) {}
  get file() {
    return path.join(this.directory, 'profile.json');
  }
  async load(): Promise<{ profile: Profile; warning?: string }> {
    try {
      return {
        profile: validateProfile(
          JSON.parse(await fs.readFile(this.file, 'utf8')),
        ),
      };
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === 'ENOENT')
        return { profile: defaultProfile() };
      await fs.copyFile(this.file, this.file + `.unreadable-${Date.now()}.bak`);
      return {
        profile: defaultProfile(),
        warning:
          'Your previous flight log could not be read. A backup was preserved beside profile.json; default settings are active.',
      };
    }
  }
  save(value: unknown): Promise<void> {
    const profile = validateProfile(value),
      json = JSON.stringify(profile, null, 2);
    const write = this.tail
      .catch(() => {})
      .then(async () => {
        await fs.mkdir(this.directory, { recursive: true });
        const temporary = this.file + '.tmp';
        await fs.writeFile(temporary, json, 'utf8');
        await fs.rename(temporary, this.file);
      });
    this.tail = write;
    return write;
  }
  flush() {
    return this.tail;
  }
}
