import type { Settings } from '../../shared/profile';
import type { Sound } from './engine';
export class Audio {
  context: AudioContext | null = null;
  settings: Settings;
  constructor(settings: Settings) {
    this.settings = settings;
  }
  unlock() {
    if (!this.context) this.context = new AudioContext();
    void this.context.resume();
  }
  play(sound: Sound) {
    if (
      !this.settings.sound ||
      !this.context ||
      this.context.state !== 'running'
    )
      return;
    const ctx = this.context,
      t = ctx.currentTime,
      osc = ctx.createOscillator(),
      gain = ctx.createGain();
    const [from, to, duration] =
      sound === 'shoot'
        ? [800, 150, 0.08]
        : sound === 'break'
          ? [110, 35, 0.15]
          : sound === 'hit'
            ? [160, 24, 0.4]
            : sound === 'wave'
              ? [300, 700, 0.4]
              : [220, 660, 0.22];
    osc.type =
      sound === 'shoot'
        ? 'square'
        : sound === 'break' || sound === 'hit'
          ? 'sawtooth'
          : 'sine';
    osc.frequency.setValueAtTime(from, t);
    osc.frequency.exponentialRampToValueAtTime(to, t + duration);
    gain.gain.setValueAtTime(this.settings.volume * 0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + duration);
  }
  close() {
    void this.context?.close();
  }
}
