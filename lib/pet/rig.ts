/**
 * Thea's body, ported 1:1 from the desktop app (thea/rig.py).
 * Drawn procedurally on a 40x40 grid, then nearest-neighbour scaled.
 */
import { DEEP, INK, PAPER, SHADE, type Rgb } from "./palette";

export const W = 40;
export const H = 40;
const CX = 20.0;
const BASE_Y = 37.0;

const BODY = { cx: 20.0, cy: 24.6, rx: 11.7, ry: 9.7 };
const FEET: ReadonlyArray<readonly [number, number, number, number]> = [
  [-5.7, 36.1, 3.7, 2.1],
  [5.7, 36.1, 3.7, 2.1],
];
const HANDS: ReadonlyArray<readonly [number, number, number, number]> = [
  [-13.2, 28.0, 2.8, 2.5],
  [13.2, 28.0, 2.8, 2.5],
];
const STEM = { cx: 20.0, cy: 12.4, rx: 1.35, ry: 4.1 };
const LEAVES: ReadonlyArray<readonly [number, number, number]> = [
  [-4.7, 8.7, 30.0],
  [4.7, 8.7, -30.0],
];

export type Pose = {
  squash?: number;
  tilt?: number;
  sway?: number;
  arm?: number;
};

export const emptyMask = () => new Uint8Array(W * H);

function addEllipse(
  mask: Uint8Array,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  deg = 0,
  transform?: (x: number, y: number) => [number, number],
) {
  const rad = (deg * Math.PI) / 180;
  const ca = Math.cos(rad);
  const sa = Math.sin(rad);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let X = x + 0.5;
      let Y = y + 0.5;
      if (transform) [X, Y] = transform(X, Y);
      const dx = X - cx;
      const dy = Y - cy;
      const u = dx * ca + dy * sa;
      const v = -dx * sa + dy * ca;
      if ((u / rx) ** 2 + (v / ry) ** 2 <= 1) mask[y * W + x] = 1;
    }
  }
}

export function bodyMask(pose: Pose = {}): Uint8Array {
  const m = emptyMask();
  const squash = pose.squash ?? 0;
  const sy = Math.max(0.55, 1 + squash);
  const sx = 1 / Math.sqrt(sy);
  const lean = pose.tilt ?? 0;
  const sway = pose.sway ?? 0;
  const arm = pose.arm ?? 0;

  const tf = (X: number, Y: number): [number, number] => {
    let Xb = (X - CX) / sx + CX;
    const Yb = BASE_Y - (BASE_Y - Y) / sy;
    if (lean) Xb = Xb - (BASE_Y - Yb) * lean;
    return [Xb, Yb];
  };

  addEllipse(m, BODY.cx, BODY.cy, BODY.rx, BODY.ry, 0, tf);

  for (const [dx, cy, rx, ry] of HANDS) {
    const side = dx < 0 ? -1 : 1;
    addEllipse(m, CX + dx, cy + arm * side * -1, rx, ry, 0, tf);
  }

  addEllipse(m, STEM.cx + sway * 0.55, STEM.cy, STEM.rx, STEM.ry, 0, tf);

  for (const [dx, cy, deg] of LEAVES) {
    const side = dx < 0 ? -1 : 1;
    addEllipse(
      m,
      CX + dx + sway * 0.5 * side,
      cy + Math.abs(sway) * 0.18,
      5.1,
      2.45,
      deg + sway * 7.0 * side,
      tf,
    );
  }

  for (const [dx, cy, rx, ry] of FEET) {
    addEllipse(m, CX + dx, cy, rx, ry);
  }

  return m;
}

export function shadowMask(): Uint8Array {
  const m = emptyMask();
  addEllipse(m, CX, 38.4, 10.6, 1.55);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if ((x + y) % 2 !== 0) m[y * W + x] = 0;
    }
  }
  return m;
}

export function erode(mask: Uint8Array, steps = 1): Uint8Array {
  let out = mask.slice();
  for (let step = 0; step < steps; step++) {
    const src = out;
    const next = out.slice();
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = y * W + x;
        if (!src[i]) continue;
        const up = y > 0 ? src[i - W] : src[i];
        const down = y < H - 1 ? src[i + W] : src[i];
        const left = x > 0 ? src[i - 1] : src[i];
        const right = x < W - 1 ? src[i + 1] : src[i];
        next[i] = up & down & left & right ? 1 : 0;
      }
    }
    out = next;
  }
  return out;
}

const set = (data: Uint8ClampedArray, i: number, c: Rgb) => {
  const o = i * 4;
  data[o] = c[0];
  data[o + 1] = c[1];
  data[o + 2] = c[2];
  data[o + 3] = 255;
};

function linePoints(x0: number, y0: number, x1: number, y1: number) {
  const n = Math.trunc(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) * 2) + 1;
  const pts: Array<[number, number]> = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    pts.push([Math.round(x0 + (x1 - x0) * t), Math.round(y0 + (y1 - y0) * t)]);
  }
  return pts;
}

export function renderBody(pose: Pose = {}): Uint8ClampedArray {
  const data = new Uint8ClampedArray(W * H * 4);

  const shadow = shadowMask();
  for (let i = 0; i < shadow.length; i++) if (shadow[i]) set(data, i, SHADE);

  const m = bodyMask(pose);
  const inner = erode(m, 1);
  const core = erode(inner, 1);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      if (!inner[i]) continue;
      set(data, i, PAPER);
      if (!core[i] && x + 0.5 > CX && y + 0.5 > 24.0) set(data, i, SHADE);
    }
  }

  for (const [dx, cy] of LEAVES) {
    const side = dx < 0 ? -1 : 1;
    for (const [x, y] of linePoints(CX + side * 1.6, 12.4, CX + dx * 1.35, cy + 0.2)) {
      if (x >= 0 && x < W && y >= 0 && y < H && m[y * W + x]) set(data, y * W + x, DEEP);
    }
  }

  for (let i = 0; i < m.length; i++) {
    if (m[i] && !inner[i]) set(data, i, INK);
  }

  return data;
}

export function flipX(data: Uint8ClampedArray): Uint8ClampedArray {
  const out = new Uint8ClampedArray(data.length);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const from = (y * W + x) * 4;
      const to = (y * W + (W - 1 - x)) * 4;
      out[to] = data[from];
      out[to + 1] = data[from + 1];
      out[to + 2] = data[from + 2];
      out[to + 3] = data[from + 3];
    }
  }
  return out;
}

export function hitMask(): Uint8Array {
  let m = bodyMask();
  for (const squash of [-0.12, 0.08]) {
    const other = bodyMask({ squash });
    for (let i = 0; i < m.length; i++) m[i] |= other[i];
  }
  for (let pass = 0; pass < 2; pass++) {
    const grow = m.slice();
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = y * W + x;
        if (!m[i]) continue;
        if (y > 0) grow[i - W] = 1;
        if (y < H - 1) grow[i + W] = 1;
        if (x > 0) grow[i - 1] = 1;
        if (x < W - 1) grow[i + 1] = 1;
      }
    }
    m = grow;
  }
  return m;
}
