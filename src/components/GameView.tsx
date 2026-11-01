import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Pause,
  Play,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Crosshair,
} from 'lucide-react';
import { Game, emptyInput, type Input } from '../game/engine';
import { draw } from '../game/renderer';
import { Audio } from '../game/audio';
import { ShipIcon } from './ShipIcon';
import type { Settings, Run } from '../../shared/profile';
export const scoreText = (n: number) => String(n).padStart(6, '0');
interface Props {
  settings: Settings;
  blocked: boolean;
  best: number;
  onRun: (run: Run) => void;
  onHome: () => void;
}
export function GameView({ settings, blocked, best, onRun, onHome }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null),
    gameRef = useRef<Game | null>(null),
    audioRef = useRef<Audio | null>(null);
  const settingsRef = useRef(settings),
    blockedRef = useRef(blocked),
    onRunRef = useRef(onRun);
  settingsRef.current = settings;
  blockedRef.current = blocked;
  onRunRef.current = onRun;
  const [state, setState] = useState({
    mode: 'ready',
    score: 0,
    wave: 1,
    lives: 3,
    time: 0,
  });
  const refresh = () => {
    const g = gameRef.current;
    if (g)
      setState({
        mode: g.mode,
        score: g.score,
        wave: g.wave,
        lives: g.lives,
        time: g.time,
      });
  };
  const start = () => {
    audioRef.current?.unlock();
    gameRef.current?.start();
    refresh();
  };
  const pause = () => {
    gameRef.current?.togglePause();
    refresh();
  };
  const home = () => {
    gameRef.current?.home();
    onHome();
    refresh();
  };
  useEffect(() => {
    const g = new Game(Date.now() >>> 0),
      sound = new Audio(settingsRef.current);
    gameRef.current = g;
    audioRef.current = sound;
    const el = canvas.current!,
      ctx = el.getContext('2d')!;
    const resize = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(devicePixelRatio, 2);
      el.width = Math.round(rect.width * dpr);
      el.height = Math.round(rect.height * dpr);
      const width = Math.max(640, Math.min(1440, (rect.width * 1440) / 1474));
      g.resize(width, (width * rect.height) / rect.width);
    });
    resize.observe(el);
    let raf = 0,
      last = performance.now(),
      acc = 0,
      lastSync = 0,
      manual = false,
      recorded = false;
    const tick = (dt: number) => {
      const previous = g.mode;
      g.update(dt);
      sound.settings = settingsRef.current;
      for (const s of g.sounds.splice(0)) sound.play(s);
      if (previous === 'running' && g.mode === 'over' && !recorded) {
        recorded = true;
        onRunRef.current({
          score: g.score,
          wave: g.wave,
          seconds: Math.round(g.time),
          date: new Date().toISOString(),
        });
      }
      if (g.mode === 'running') recorded = false;
    };
    const frame = (now: number) => {
      if (!manual) {
        acc += Math.min((now - last) / 1000, 0.1);
        while (acc >= 1 / 60) {
          tick(1 / 60);
          acc -= 1 / 60;
        }
      }
      last = now;
      draw(
        ctx,
        g,
        settingsRef.current.reducedMotion ||
          matchMedia('(prefers-reduced-motion: reduce)').matches,
      );
      if (now - lastSync > 100) {
        refresh();
        lastSync = now;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    const controls: Record<string, keyof Input> = {
      ArrowLeft: 'left',
      KeyA: 'left',
      ArrowRight: 'right',
      KeyD: 'right',
      ArrowUp: 'thrust',
      KeyW: 'thrust',
      Space: 'fire',
    };
    const down = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName) ||
        blockedRef.current
      )
        return;
      if (
        target.closest('button,a') &&
        ['Space', 'Enter', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(
          e.code,
        )
      )
        return;
      if (controls[e.code]) {
        e.preventDefault();
        g.input[controls[e.code]] = true;
      }
      if (e.repeat) return;
      if (e.code === 'Enter' && (g.mode === 'ready' || g.mode === 'over')) {
        e.preventDefault();
        sound.unlock();
        g.start();
        refresh();
      }
      if (e.code === 'KeyP' || e.code === 'Escape') {
        g.togglePause();
        refresh();
      }
      if (e.code === 'KeyF') {
        if (document.fullscreenElement) void document.exitFullscreen();
        else void document.documentElement.requestFullscreen().catch(() => {});
      }
    };
    const up = (e: KeyboardEvent) => {
      if (controls[e.code]) g.input[controls[e.code]] = false;
    };
    const blur = () => {
      g.input = emptyInput();
      if (g.mode === 'running') {
        g.togglePause();
        refresh();
      }
    };
    const visibility = () => {
      if (document.hidden) blur();
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', blur);
    document.addEventListener('visibilitychange', visibility);
    window.render_game_to_text = () => g.text();
    window.advanceTime = (ms) => {
      manual = true;
      const n = Math.max(1, Math.round(Math.min(ms, 300000) / (1000 / 60)));
      for (let i = 0; i < n; i++) tick(1 / 60);
      draw(ctx, g, settingsRef.current.reducedMotion);
      refresh();
    };
    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      sound.close();
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', blur);
      document.removeEventListener('visibilitychange', visibility);
      delete window.advanceTime;
      delete window.render_game_to_text;
      gameRef.current = null;
    };
  }, []);
  useEffect(() => {
    if (blocked && gameRef.current?.mode === 'running') {
      gameRef.current.togglePause();
      refresh();
    }
  }, [blocked]);
  const touch = (key: keyof Input, pressed: boolean) => {
    if (gameRef.current) gameRef.current.input[key] = pressed;
  };
  return (
    <section className="arena" aria-label="STROIDS flight arena">
      <div className="hud">
        <div>
          <span>SCORE</span> <strong>{scoreText(state.score)}</strong>
        </div>
        <div>
          WAVE <strong>{String(state.wave).padStart(2, '0')}</strong>
        </div>
        <div className="lives" aria-label={`${state.lives} lives remaining`}>
          {Array.from({ length: Math.min(state.lives, 8) }, (_, i) => (
            <ShipIcon key={i} />
          ))}
        </div>
      </div>
      <div className="playfield">
        <canvas
          ref={canvas}
          aria-label="Spaceship and asteroids. Use arrow keys to steer, up to thrust, space to fire."
        />
        {!blocked && state.mode === 'ready' && (
          <div className="game-menu">
            <h1>
              A little ship.
              <br />A lot of space.
            </h1>
            <p>
              Drift. Dodge. Break things.
              <br />
              One more run starts here.
            </p>
            <button id="start-btn" className="primary" onClick={start}>
              LAUNCH RUN <ArrowUpRight />
            </button>
            <span className="shortcut">or press ENTER</span>
            {best > 0 && (
              <span className="personal-best">
                PERSONAL BEST {scoreText(best)}
              </span>
            )}
          </div>
        )}
        {!blocked && state.mode === 'paused' && (
          <div className="state-scrim">
            <div className="state-panel">
              <Pause className="state-icon" />
              <h1>Take a breath.</h1>
              <p>The belt can wait.</p>
              <button className="primary" onClick={pause}>
                RESUME FLIGHT <Play />
              </button>
              <button className="text-button" onClick={home}>
                END RUN & RETURN HOME
              </button>
              <span className="shortcut">P or ESC to resume</span>
            </div>
          </div>
        )}
        {!blocked && state.mode === 'over' && (
          <div className="state-scrim">
            <div className="state-panel">
              <h1>What a run.</h1>
              <p className="final-score">{scoreText(state.score)}</p>
              <p>
                Wave {state.wave} · {Math.floor(state.time / 60)}m{' '}
                {Math.floor(state.time % 60)}s in the belt
              </p>
              <button className="primary" onClick={start}>
                ONE MORE RUN <RotateCcw />
              </button>
              <button className="text-button" onClick={home}>
                BACK TO HOME
              </button>
            </div>
          </div>
        )}
        {state.mode === 'running' && !blocked && (
          <button
            className="pause-control icon-button"
            aria-label="Pause flight"
            onClick={pause}
          >
            <Pause size={20} />
          </button>
        )}
        {(settings.touchControls || matchMedia('(pointer: coarse)').matches) &&
          state.mode === 'running' &&
          !blocked && (
            <div className="touch-controls">
              {(['left', 'right', 'thrust', 'fire'] as const).map(
                (key, index) => {
                  const Icon = [ArrowLeft, ArrowRight, ArrowUp, Crosshair][
                    index
                  ];
                  return (
                    <button
                      aria-label={key}
                      key={key}
                      onPointerDown={(e) => {
                        e.currentTarget.setPointerCapture(e.pointerId);
                        touch(key, true);
                      }}
                      onPointerUp={() => touch(key, false)}
                      onPointerCancel={() => touch(key, false)}
                      onLostPointerCapture={() => touch(key, false)}
                    >
                      <Icon />
                    </button>
                  );
                },
              )}
            </div>
          )}
      </div>
      <div className="arena-status">
        <span>
          SECTOR <b>{String(state.wave).padStart(2, '0')}</b> /{' '}
          {state.wave < 4
            ? 'THE QUIET BELT'
            : state.wave < 8
              ? 'THE OUTER REACHES'
              : 'DEEP SPACE'}
        </span>
        <span className="system-status">
          <i />
          {state.mode === 'running'
            ? 'FLIGHT IN PROGRESS'
            : state.mode === 'paused'
              ? 'FLIGHT ON HOLD'
              : state.mode === 'over'
                ? 'SIGNAL LOST'
                : 'ALL SYSTEMS READY'}
        </span>
      </div>
    </section>
  );
}
