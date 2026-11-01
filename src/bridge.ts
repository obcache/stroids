import {
  defaultProfile,
  validateProfile,
  type Profile,
} from '../shared/profile';
export interface DesktopBridge {
  loadProfile(): Promise<{ profile: Profile; warning?: string }>;
  saveProfile(profile: Profile): Promise<void>;
  exportProfile(profile: Profile): Promise<boolean>;
  importProfile(): Promise<Profile | null>;
  windowAction(action: 'minimize' | 'maximize' | 'close'): Promise<void>;
}
declare global {
  interface Window {
    desktop?: DesktopBridge;
    render_game_to_text?: () => string;
    advanceTime?: (ms: number) => void;
  }
}
const KEY = 'stroids.profile.v1';
export const bridge: DesktopBridge = window.desktop ?? {
  async loadProfile() {
    try {
      const raw = localStorage.getItem(KEY);
      return {
        profile: raw ? validateProfile(JSON.parse(raw)) : defaultProfile(),
      };
    } catch {
      return {
        profile: defaultProfile(),
        warning:
          'Your browser flight log could not be loaded. Export or restore a backup before saving new data.',
      };
    }
  },
  async saveProfile(profile) {
    localStorage.setItem(KEY, JSON.stringify(validateProfile(profile)));
  },
  async exportProfile(profile) {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(validateProfile(profile), null, 2)], {
        type: 'application/json',
      }),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stroids-flight-log.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  },
  async importProfile() {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json,application/json';
      input.oncancel = () => resolve(null);
      input.onchange = async () => {
        try {
          const file = input.files?.[0];
          if (!file) return resolve(null);
          if (file.size > 256000)
            throw new Error('Flight log is too large (maximum 250 KB).');
          resolve(validateProfile(JSON.parse(await file.text())));
        } catch (e) {
          reject(e);
        }
      };
      input.click();
    });
  },
  async windowAction() {},
};
