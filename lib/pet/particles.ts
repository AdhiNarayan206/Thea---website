/** Emotion indicators, ported from the app (thea/particles.py). */
import { hex, DEEP, INK, SHADE } from "./palette";

export type ParticleKind =
  | "heart"
  | "sparkle"
  | "note"
  | "bang"
  | "tear"
  | "steam"
  | "crumb"
  | "dust"
  | "zzz";

const GLYPHS: Record<ParticleKind, string[]> = {
  heart: [".#.#.", "#####", "#####", ".###.", "..#.."],
  sparkle: ["..#..", ".###.", "#####", ".###.", "..#.."],
  note: ["..##.", "..#..", "..#..", "###..", "###.."],
  bang: ["#", "#", "#", "."],
  tear: ["#", "#"],
  steam: ["##", "##"],
  crumb: ["#"],
  dust: ["#"],
  zzz: ["###", "..#", ".#.", "###"],
};

const COLORS: Record<ParticleKind, string> = {
  heart: hex(INK),
  sparkle: hex(INK),
  note: hex(INK),
  bang: hex(INK),
  tear: hex(DEEP),
  steam: hex(SHADE),
  crumb: hex(DEEP),
  dust: hex(SHADE),
  zzz: hex(INK),
};

const FLOATERS = new Set<ParticleKind>(["heart", "sparkle", "note", "bang", "steam", "zzz"]);

type Particle = {
  kind: ParticleKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
};

export type SpawnOptions = {
  n?: number;
  spread?: number;
  vx?: number;
  vy?: number;
  life?: number;
  jitter?: number;
};

export class Particles {
  items: Particle[] = [];
  private limit = 140;

  spawn(kind: ParticleKind, x: number, y: number, o: SpawnOptions = {}) {
    const n = o.n ?? 1;
    const spread = o.spread ?? 4;
    const jitter = o.jitter ?? 1;
    for (let i = 0; i < n; i++) {
      if (this.items.length >= this.limit) return;
      this.items.push({
        kind,
        x: x + (Math.random() * 2 - 1) * spread,
        y: y + (Math.random() * 2 - 1) * spread,
        vx: (o.vx ?? 0) + (Math.random() * 2 - 1) * 25 * jitter,
        vy: (o.vy ?? 0) + (Math.random() * 2 - 1) * 20 * jitter,
        life: (o.life ?? 1) * (0.7 + Math.random() * 0.55),
      });
    }
  }

  update(dt: number) {
    const alive: Particle[] = [];
    for (const p of this.items) {
      p.life -= dt;
      if (p.life <= 0) continue;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (FLOATERS.has(p.kind)) {
        p.vy -= 26 * dt;
        p.vx *= 1 - 0.7 * dt;
        p.vy *= 1 - 0.2 * dt;
      } else {
        p.vy += 620 * dt;
      }
      alive.push(p);
    }
    this.items = alive;
  }

  clear() {
    this.items = [];
  }

  draw(ctx: CanvasRenderingContext2D, scale: number) {
    const unit = Math.max(2, Math.round(scale));
    for (const p of this.items) {
      if (p.life < 0.3 && Math.floor(p.life * 22) % 2 === 0) continue;
      const glyph = GLYPHS[p.kind];
      if (!glyph) continue;
      const gx = Math.round(p.x / unit) * unit;
      const gy = Math.round(p.y / unit) * unit;
      ctx.fillStyle = COLORS[p.kind];
      for (let row = 0; row < glyph.length; row++) {
        const line = glyph[row];
        for (let col = 0; col < line.length; col++) {
          if (line[col] === "#") ctx.fillRect(gx + col * unit, gy + row * unit, unit, unit);
        }
      }
    }
  }
}
