import { describe, it, expect } from 'vitest';
import { Game, WIDTH, HEIGHT, wrap, distance } from '../src/game/engine';
const frames = (g: Game, n: number) => {
  for (let i = 0; i < n; i++) g.update(1 / 60);
};
describe('flight simulation', () => {
  it('starts a clean run with safe spawning and three ships', () => {
    const g = new Game(9);
    g.start();
    expect(g.mode).toBe('running');
    expect(g.lives).toBe(3);
    expect(g.rocks.length).toBe(5);
    expect(g.rocks.every((r) => distance(r, g.ship) >= 225)).toBe(true);
  });
  it('accelerates, rotates and retains momentum when thrust is released', () => {
    const g = new Game();
    g.start();
    g.rocks = [];
    g.input.thrust = true;
    frames(g, 30);
    expect(g.ship.vy).toBeLessThan(-80);
    g.input.thrust = false;
    const before = g.ship.y;
    frames(g, 10);
    expect(g.ship.y).toBeLessThan(before);
    g.input.right = true;
    frames(g, 10);
    expect(g.ship.angle).toBeGreaterThan(-Math.PI / 2);
  });
  it('wraps the ship, bullets and rocks across the field', () => {
    const g = new Game();
    g.start();
    g.ship.x = WIDTH - 1;
    g.ship.vx = 240;
    frames(g, 1);
    expect(g.ship.x).toBeLessThan(10);
    g.ship.y = HEIGHT - 1;
    g.ship.vy = 240;
    frames(g, 1);
    expect(g.ship.y).toBeLessThan(10);
    expect(wrap(-5, WIDTH)).toBe(WIDTH - 5);
    expect(distance({ x: 2, y: 20 }, { x: WIDTH - 2, y: 20 })).toBe(4);
  });
  it('fires repeatedly with bounded lifetime and cooldown', () => {
    const g = new Game();
    g.start();
    g.rocks = [];
    g.input.fire = true;
    frames(g, 60);
    expect(g.bullets.length).toBeGreaterThan(4);
    expect(g.bullets.length).toBeLessThan(10);
    g.input.fire = false;
    frames(g, 70);
    expect(g.bullets).toHaveLength(0);
  });
  it('bullet hits split large rocks, award score, then clear a wave', () => {
    const g = new Game();
    g.start();
    const r = g.rocks[0];
    r.x = 100;
    r.y = 100;
    r.vx = 0;
    r.vy = 0;
    g.rocks = [r];
    g.bullets = [{ x: 100, y: 100, vx: 0, vy: 0, life: 1 }];
    frames(g, 1);
    expect(g.score).toBe(20);
    expect(g.rocks).toHaveLength(2);
    expect(g.rocks.every((r) => r.size === 2)).toBe(true);
    while (g.rocks.length) g.destroyRock(0);
    expect(g.score).toBe(520);
    expect(g.waveDelay).toBeGreaterThan(0);
    frames(g, 100);
    expect(g.wave).toBe(2);
    expect(g.rocks).toHaveLength(6);
  });
  it('grants an extra ship at each 10,000 points', () => {
    const g = new Game();
    g.start();
    g.score = 9990;
    g.destroyRock(0);
    expect(g.lives).toBe(4);
    expect(g.extraLifeAt).toBe(20000);
  });
  it('loses one life, respawns safely, ends the run and restarts', () => {
    const g = new Game();
    g.start();
    const hit = () => {
      const r = g.rocks[0];
      r.x = g.ship.x;
      r.y = g.ship.y;
      r.vx = r.vy = 0;
      g.ship.invulnerable = 0;
      frames(g, 1);
    };
    hit();
    expect(g.lives).toBe(2);
    expect(g.ship.invulnerable).toBeGreaterThan(2);
    frames(g, 1);
    expect(g.lives).toBe(2);
    hit();
    hit();
    expect(g.mode).toBe('over');
    expect(g.lives).toBe(0);
    g.start();
    expect(g.lives).toBe(3);
    expect(g.score).toBe(0);
    expect(g.time).toBe(0);
    expect(g.mode).toBe('running');
  });
  it('freezes all simulation during pause and clears held input', () => {
    const g = new Game();
    g.start();
    g.input.thrust = true;
    g.togglePause();
    const state = g.text();
    frames(g, 120);
    expect(g.text()).toBe(state);
    expect(g.input.thrust).toBe(false);
    g.togglePause();
    frames(g, 1);
    expect(g.time).toBeGreaterThan(0);
  });
  it('produces repeatable simulation and truthful text state', () => {
    const a = new Game(123),
      b = new Game(123);
    for (const g of [a, b]) {
      g.start();
      g.input.fire = true;
      g.input.right = true;
      frames(g, 300);
    }
    expect(a.text()).toBe(b.text());
    expect(JSON.parse(a.text()).coordinates).toContain('top-left');
  });
  it('preserves positions and round geometry on viewport changes', () => {
    const g = new Game();
    g.start();
    g.resize(640, 720);
    expect(g.ship.x).toBe(320);
    expect(g.ship.y).toBe(360);
    expect(
      g.rocks.every((r) => r.x >= 0 && r.x < 640 && r.y >= 0 && r.y < 720),
    ).toBe(true);
    g.home();
    expect(g.ship.x).toBeLessThan(640);
    g.start();
    expect(g.ship.y).toBe(360);
  });
});
