export const WIDTH = 1440,
  HEIGHT = 640;
export type Mode = 'ready' | 'running' | 'paused' | 'over';
export interface Body {
  x: number;
  y: number;
  vx: number;
  vy: number;
}
export interface Rock extends Body {
  id: number;
  size: 1 | 2 | 3;
  radius: number;
  angle: number;
  spin: number;
  art: number;
}
export interface Bullet extends Body {
  life: number;
}
export interface Particle extends Body {
  life: number;
  max: number;
  color: string;
}
export interface Input {
  left: boolean;
  right: boolean;
  thrust: boolean;
  fire: boolean;
}
export type Sound = 'shoot' | 'break' | 'hit' | 'wave' | 'start';
export const emptyInput = (): Input => ({
  left: false,
  right: false,
  thrust: false,
  fire: false,
});
export const wrap = (n: number, max: number) => ((n % max) + max) % max;
export function distance(
  a: Pick<Body, 'x' | 'y'>,
  b: Pick<Body, 'x' | 'y'>,
  width = WIDTH,
  height = HEIGHT,
) {
  const x = Math.abs(a.x - b.x),
    y = Math.abs(a.y - b.y);
  return Math.hypot(Math.min(x, width - x), Math.min(y, height - y));
}
export class Game {
  width = WIDTH;
  height = HEIGHT;
  mode: Mode = 'ready';
  score = 0;
  wave = 1;
  lives = 3;
  time = 0;
  animation = 0;
  ship = {
    x: WIDTH / 2,
    y: HEIGHT / 2,
    vx: 0,
    vy: 0,
    angle: -Math.PI / 2,
    invulnerable: 2.5,
  };
  rocks: Rock[] = [];
  bullets: Bullet[] = [];
  particles: Particle[] = [];
  input = emptyInput();
  cooldown = 0;
  waveDelay = 0;
  extraLifeAt = 10000;
  nextId = 1;
  sounds: Sound[] = [];
  private seed: number;
  constructor(seed = 481516) {
    this.seed = seed;
    this.attract();
  }
  random() {
    this.seed = (Math.imul(1664525, this.seed) + 1013904223) >>> 0;
    return this.seed / 4294967296;
  }
  private rock(x: number, y: number, size: 1 | 2 | 3, speed = 1): Rock {
    const angle = this.random() * Math.PI * 2,
      velocity = (24 + this.random() * 30 + (3 - size) * 16) * speed;
    return {
      id: this.nextId++,
      x,
      y,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      size,
      radius: [0, 14, 28, 48][size],
      angle,
      spin: (this.random() - 0.5) * 0.55,
      art: Math.floor(this.random() * 3),
    };
  }
  attract() {
    this.rocks = [
      [1160, 140, 3],
      [1300, 520, 3],
      [950, 475, 2],
      [1040, 265, 2],
      [770, 100, 1],
      [1370, 330, 1],
      [880, 585, 3],
      [570, 560, 1],
    ].map(([x, y, size]) =>
      this.rock(
        (x / WIDTH) * this.width,
        (y / HEIGHT) * this.height,
        size as 1 | 2 | 3,
        0.25,
      ),
    );
    this.ship.x = (955 / WIDTH) * this.width;
    this.ship.y = this.height / 2;
    this.ship.angle = -0.13;
  }
  start() {
    this.mode = 'running';
    this.score = 0;
    this.wave = 1;
    this.lives = 3;
    this.time = 0;
    this.bullets = [];
    this.particles = [];
    this.sounds = ['start'];
    this.cooldown = 0;
    this.waveDelay = 0;
    this.extraLifeAt = 10000;
    this.input = emptyInput();
    this.respawn();
    this.spawnWave();
  }
  resize(width: number, height: number) {
    const sx = width / this.width,
      sy = height / this.height;
    for (const body of [
      this.ship,
      ...this.rocks,
      ...this.bullets,
      ...this.particles,
    ]) {
      body.x *= sx;
      body.y *= sy;
    }
    this.width = width;
    this.height = height;
  }
  respawn() {
    this.ship = {
      x: this.width / 2,
      y: this.height / 2,
      vx: 0,
      vy: 0,
      angle: -Math.PI / 2,
      invulnerable: 2.8,
    };
  }
  togglePause() {
    if (this.mode === 'running') this.mode = 'paused';
    else if (this.mode === 'paused') this.mode = 'running';
    this.input = emptyInput();
  }
  home() {
    this.mode = 'ready';
    this.bullets = [];
    this.particles = [];
    this.input = emptyInput();
    this.attract();
  }
  spawnWave() {
    this.rocks = [];
    for (let i = 0; i < Math.min(4 + this.wave, 14); i++) {
      let x = 0,
        y = 0;
      do {
        x = this.random() * this.width;
        y = this.random() * this.height;
      } while (
        distance({ x, y }, this.ship, this.width, this.height) <
        Math.min(225, Math.max(this.width, this.height) * 0.3)
      );
      this.rocks.push(
        this.rock(x, y, 3, 1 + Math.min(this.wave - 1, 20) * 0.08),
      );
    }
  }
  burst(x: number, y: number, color: string, count: number) {
    for (let i = 0; i < count; i++) {
      const a = this.random() * Math.PI * 2,
        v = 30 + this.random() * 150,
        life = 0.25 + this.random() * 0.65;
      this.particles.push({
        x,
        y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,
        life,
        max: life,
        color,
      });
    }
  }
  destroyRock(index: number) {
    const r = this.rocks[index];
    if (!r) return;
    this.rocks.splice(index, 1);
    this.score += [0, 100, 50, 20][r.size];
    this.sounds.push('break');
    this.burst(r.x, r.y, '#eeeee4', r.size * 6);
    if (r.size > 1)
      for (let i = 0; i < 2; i++)
        this.rocks.push(
          this.rock(
            wrap(r.x + (i ? 8 : -8), this.width),
            r.y,
            (r.size - 1) as 1 | 2,
            1 + this.wave * 0.06,
          ),
        );
    if (this.score >= this.extraLifeAt) {
      this.lives++;
      this.extraLifeAt += 10000;
    }
    if (!this.rocks.length) this.waveDelay = 1.6;
  }
  update(dt: number) {
    if (this.mode === 'paused' || this.mode === 'over') return;
    this.animation += dt;
    for (const r of this.rocks) {
      r.x = wrap(r.x + r.vx * dt, this.width);
      r.y = wrap(r.y + r.vy * dt, this.height);
      r.angle += r.spin * dt;
    }
    if (this.mode === 'ready') return;
    this.time += dt;
    this.cooldown = Math.max(0, this.cooldown - dt);
    this.ship.invulnerable = Math.max(0, this.ship.invulnerable - dt);
    if (this.waveDelay > 0) {
      this.waveDelay -= dt;
      if (this.waveDelay <= 0) {
        this.wave++;
        this.spawnWave();
        this.ship.invulnerable = Math.max(this.ship.invulnerable, 1.5);
        this.sounds.push('wave');
      }
    }
    const s = this.ship,
      i = this.input;
    s.angle += ((i.right ? 1 : 0) - (i.left ? 1 : 0)) * 4.1 * dt;
    if (i.thrust) {
      s.vx += Math.cos(s.angle) * 245 * dt;
      s.vy += Math.sin(s.angle) * 245 * dt;
    }
    const speed = Math.hypot(s.vx, s.vy);
    if (speed > 390) {
      s.vx *= 390 / speed;
      s.vy *= 390 / speed;
    }
    s.vx *= Math.pow(0.992, dt * 60);
    s.vy *= Math.pow(0.992, dt * 60);
    s.x = wrap(s.x + s.vx * dt, this.width);
    s.y = wrap(s.y + s.vy * dt, this.height);
    if (i.fire && this.cooldown === 0) {
      this.bullets.push({
        x: wrap(s.x + Math.cos(s.angle) * 20, this.width),
        y: wrap(s.y + Math.sin(s.angle) * 20, this.height),
        vx: Math.cos(s.angle) * 600 + s.vx,
        vy: Math.sin(s.angle) * 600 + s.vy,
        life: 1.1,
      });
      this.cooldown = 0.15;
      this.sounds.push('shoot');
    }
    for (const b of this.bullets) {
      b.x = wrap(b.x + b.vx * dt, this.width);
      b.y = wrap(b.y + b.vy * dt, this.height);
      b.life -= dt;
      if (b.life <= 0) continue;
      const hit = this.rocks.findIndex(
        (r) => distance(b, r, this.width, this.height) < r.radius + 3,
      );
      if (hit >= 0) {
        b.life = 0;
        this.destroyRock(hit);
      }
    }
    this.bullets = this.bullets.filter((b) => b.life > 0);
    for (const p of this.particles) {
      p.x = wrap(p.x + p.vx * dt, this.width);
      p.y = wrap(p.y + p.vy * dt, this.height);
      p.life -= dt;
    }
    this.particles = this.particles.filter((p) => p.life > 0);
    if (
      s.invulnerable === 0 &&
      this.rocks.some(
        (r) => distance(s, r, this.width, this.height) < r.radius + 10,
      )
    ) {
      this.burst(s.x, s.y, '#d9fa68', 30);
      this.sounds.push('hit');
      this.lives--;
      if (this.lives <= 0) {
        this.mode = 'over';
        this.input = emptyInput();
      } else this.respawn();
    }
  }
  text() {
    return JSON.stringify({
      coordinates: `origin top-left; x right, y down; toroidal ${Math.round(this.width)} × ${Math.round(this.height)}`,
      mode: this.mode,
      score: this.score,
      wave: this.wave,
      lives: this.lives,
      seconds: +this.time.toFixed(2),
      ship: { ...this.ship },
      rocks: this.rocks.map((r) => ({
        x: r.x,
        y: r.y,
        radius: r.radius,
        size: r.size,
      })),
      bullets: this.bullets,
      cooldown: this.cooldown,
      waveDelay: this.waveDelay,
      input: this.input,
    });
  }
}
