import { Game } from './engine';
const atlas = new Image();
atlas.src = new URL('/art/sprites.png', import.meta.url).href;
const stars = Array.from({ length: 190 }, (_, i) => ({
  x: ((i * 7919 + 197) % 14400) / 14400,
  y: ((i * 3571 + 43) % 6400) / 6400,
  r: i % 19 === 0 ? 1.7 : 1,
  a: 0.35 + (i % 7) * 0.07,
}));
export function draw(
  ctx: CanvasRenderingContext2D,
  game: Game,
  reduced: boolean,
) {
  const WIDTH = game.width,
    HEIGHT = game.height;
  const w = ctx.canvas.width,
    h = ctx.canvas.height;
  ctx.setTransform(w / WIDTH, 0, 0, h / HEIGHT, 0, 0);
  ctx.fillStyle = '#10120f';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.strokeStyle = '#24291d';
  ctx.lineWidth = 0.65;
  ctx.setLineDash([3, 6]);
  for (let x = WIDTH / 4; x < WIDTH; x += WIDTH / 4) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, HEIGHT);
    ctx.stroke();
  }
  for (let y = HEIGHT / 4; y < HEIGHT; y += HEIGHT / 4) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WIDTH, y);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(WIDTH / 2, HEIGHT / 2, 76, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(WIDTH / 2, HEIGHT / 2, 150, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  for (const star of stars) {
    ctx.globalAlpha = star.a;
    ctx.fillStyle = '#eeeee4';
    ctx.fillRect(star.x * WIDTH, star.y * HEIGHT, star.r, star.r);
  }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = '#8a9b47';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(WIDTH / 2 - 9, HEIGHT / 2);
  ctx.lineTo(WIDTH / 2 + 9, HEIGHT / 2);
  ctx.moveTo(WIDTH / 2, HEIGHT / 2 - 9);
  ctx.lineTo(WIDTH / 2, HEIGHT / 2 + 9);
  ctx.stroke();
  if (atlas.complete && atlas.naturalWidth) {
    const cell = atlas.naturalWidth / 2;
    for (const rock of game.rocks) {
      const d = rock.radius * 2.75;
      // Draw adjacent copies for a continuous toroidal edge, including large sprites.
      for (const ox of [-WIDTH, 0, WIDTH])
        for (const oy of [-HEIGHT, 0, HEIGHT]) {
          if (
            rock.x + ox < -d ||
            rock.x + ox > WIDTH + d ||
            rock.y + oy < -d ||
            rock.y + oy > HEIGHT + d
          )
            continue;
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          ctx.translate(rock.x + ox, rock.y + oy);
          ctx.rotate(rock.angle);
          for (let pass = 0; pass < 3; pass++)
            ctx.drawImage(
              atlas,
              (rock.art % 2) * cell,
              Math.floor(rock.art / 2) * cell,
              cell,
              cell,
              -d / 2,
              -d / 2,
              d,
              d,
            );
          ctx.restore();
        }
    }
    if (game.mode !== 'over') {
      const s = game.ship;
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.angle + Math.PI / 2);
      if (game.mode === 'running' && s.invulnerable > 0) {
        ctx.strokeStyle = '#7b884c';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 5]);
        ctx.beginPath();
        ctx.arc(0, 0, 29, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      if (game.input.thrust || game.mode === 'ready') {
        const flicker = reduced ? 12 : 10 + Math.sin(game.animation * 45) * 6;
        ctx.strokeStyle = '#d9fa68';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(-5, 11);
        ctx.lineTo(0, 22 + flicker);
        ctx.lineTo(5, 11);
        ctx.stroke();
      }
      ctx.globalCompositeOperation = 'lighter';
      for (let pass = 0; pass < 3; pass++)
        ctx.drawImage(atlas, cell, cell, cell, cell, -24, -24, 48, 48);
      ctx.restore();
    }
  }
  ctx.fillStyle = '#d9fa68';
  for (const b of game.bullets) {
    ctx.beginPath();
    ctx.arc(b.x, b.y, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
  if (!reduced)
    for (const p of game.particles) {
      ctx.globalAlpha = p.life / p.max;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 2, 2);
    }
  ctx.globalAlpha = 1;
}
