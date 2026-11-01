export interface Settings {
  sound: boolean;
  volume: number;
  reducedMotion: boolean;
  touchControls: boolean;
}
export interface Run {
  score: number;
  wave: number;
  seconds: number;
  date: string;
}
export interface Profile {
  schemaVersion: 1;
  settings: Settings;
  runs: Run[];
}
export const defaultProfile = (): Profile => ({
  schemaVersion: 1,
  settings: {
    sound: true,
    volume: 0.45,
    reducedMotion: false,
    touchControls: false,
  },
  runs: [],
});
export function validateProfile(value: unknown): Profile {
  if (!value || typeof value !== 'object')
    throw new Error('This is not a STROIDS flight log.');
  const p = value as Profile;
  if (p.schemaVersion !== 1)
    throw new Error('Unsupported flight log version. Expected version 1.');
  const s = p.settings;
  if (
    !s ||
    typeof s.sound !== 'boolean' ||
    typeof s.reducedMotion !== 'boolean' ||
    typeof s.touchControls !== 'boolean' ||
    !Number.isFinite(s.volume) ||
    s.volume < 0 ||
    s.volume > 1
  )
    throw new Error('Invalid settings in flight log.');
  if (!Array.isArray(p.runs) || p.runs.length > 100)
    throw new Error('Flight log must contain at most 100 runs.');
  const runs = p.runs.map((r) => {
    if (
      !r ||
      !Number.isSafeInteger(r.score) ||
      r.score < 0 ||
      r.score > 1e9 ||
      !Number.isSafeInteger(r.wave) ||
      r.wave < 1 ||
      r.wave > 100000 ||
      !Number.isFinite(r.seconds) ||
      r.seconds < 0 ||
      r.seconds > 1e8 ||
      typeof r.date !== 'string' ||
      r.date.length > 40 ||
      !Number.isFinite(Date.parse(r.date))
    )
      throw new Error('Invalid run in flight log.');
    return {
      score: r.score,
      wave: r.wave,
      seconds: r.seconds,
      date: new Date(r.date).toISOString(),
    };
  });
  return {
    schemaVersion: 1,
    settings: {
      sound: s.sound,
      volume: s.volume,
      reducedMotion: s.reducedMotion,
      touchControls: s.touchControls,
    },
    runs,
  };
}
export function recordRun(profile: Profile, run: Run): Profile {
  return validateProfile({
    ...profile,
    runs: [run, ...profile.runs].slice(0, 100),
  });
}
