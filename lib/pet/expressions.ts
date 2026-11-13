/**
 * Faces, ported 1:1 from the desktop app (thea/expressions.py).
 * Every expression paints strictly inside the face rectangle; the silhouette
 * never changes. That rule is the heart of Thea's art direction.
 */
import { DEEP, INK, PAPER, SHADE, type Rgb } from "./palette";
import { W } from "./rig";

const FACE_X0 = 11;
const FACE_X1 = 28;
const FACE_Y0 = 20;
const FACE_Y1 = 30;

const EYE_Y = 22;
const EYE_L = 15;
const EYE_R = 22;
const MOUTH_Y = 27;

export type Expression =
  | "neutral"
  | "sad"
  | "happy"
  | "surprised"
  | "angry"
  | "eating"
  | "sing"
  | "sleep";

export type Look = readonly [number, number];

function px(data: Uint8ClampedArray, x: number, y: number, color: Rgb) {
  if (x < FACE_X0 || x >= FACE_X1 || y < FACE_Y0 || y >= FACE_Y1) return;
  if (x < 0 || x >= W || y < 0 || y >= 40) return;
  const o = (y * W + x) * 4;
  data[o] = color[0];
  data[o + 1] = color[1];
  data[o + 2] = color[2];
  data[o + 3] = 255;
}

function rect(data: Uint8ClampedArray, x: number, y: number, w: number, h: number, color: Rgb) {
  for (let yy = y; yy < y + h; yy++) {
    for (let xx = x; xx < x + w; xx++) px(data, xx, yy, color);
  }
}

function dither(data: Uint8ClampedArray, x: number, y: number, w: number, h: number, color: Rgb) {
  for (let yy = 0; yy < h; yy++) {
    for (let xx = 0; xx < w; xx++) {
      if ((xx + yy) % 2 === 0) px(data, x + xx, y + yy, color);
    }
  }
}

function openEye(
  data: Uint8ClampedArray,
  x0: number,
  y0: number,
  look: Look,
  w = 3,
  h = 4,
) {
  const x = x0 + look[0];
  const y = y0 + look[1];
  rect(data, x, y, w, h, INK);
  px(data, x, y + 1, PAPER);
}

function closedUp(data: Uint8ClampedArray, x0: number, y0: number, look: Look) {
  const x = x0 + look[0];
  const y = y0 + look[1];
  px(data, x, y + 2, INK);
  px(data, x + 1, y + 1, INK);
  px(data, x + 2, y + 2, INK);
}

function closedLine(data: Uint8ClampedArray, x0: number, y0: number, look: Look) {
  rect(data, x0 + look[0], y0 + 3 + look[1], 3, 1, INK);
}

type Mouth =
  | "flat"
  | "small"
  | "frown_sad"
  | "frown_angry"
  | "happy"
  | "surprised"
  | "sleep"
  | "eating"
  | "sing";

function mouth(data: Uint8ClampedArray, kind: Mouth, chew = 0) {
  if (kind === "flat") rect(data, 19, MOUTH_Y, 2, 1, INK);
  else if (kind === "small") rect(data, 18, MOUTH_Y, 3, 1, INK);
  else if (kind === "frown_sad") {
    px(data, 18, MOUTH_Y + 1, INK);
    px(data, 19, MOUTH_Y, INK);
    px(data, 20, MOUTH_Y, INK);
    px(data, 21, MOUTH_Y + 1, INK);
  } else if (kind === "frown_angry") {
    px(data, 18, MOUTH_Y, INK);
    px(data, 19, MOUTH_Y + 1, INK);
    px(data, 20, MOUTH_Y, INK);
  } else if (kind === "happy") {
    rect(data, 18, MOUTH_Y, 4, 2, INK);
    px(data, 19, MOUTH_Y + 1, PAPER);
    px(data, 20, MOUTH_Y + 1, PAPER);
  } else if (kind === "surprised") {
    rect(data, 19, MOUTH_Y, 2, 2, INK);
  } else if (kind === "sleep") {
    rect(data, 19, MOUTH_Y, 2, 1, INK);
  } else if (kind === "eating") {
    const h = 2 + (chew > 0.45 ? 1 : 0);
    rect(data, 18, MOUTH_Y - 1, 3, h, INK);
    px(data, 19, MOUTH_Y + h - 1, DEEP);
  } else if (kind === "sing") {
    const h = 2 + (chew > 0.35 ? 1 : 0);
    rect(data, 19, MOUTH_Y - 1, 2, h, INK);
  }
}

export function drawFace(
  data: Uint8ClampedArray,
  expression: Expression,
  look: Look = [0, 0],
  blink = false,
  chew = 0,
) {
  const lx = Math.max(-1, Math.min(1, Math.trunc(look[0])));
  const ly = Math.max(-1, Math.min(1, Math.trunc(look[1])));
  const l: Look = [lx, ly];

  if (expression === "happy") {
    for (const x of [EYE_L, EYE_R]) closedUp(data, x, EYE_Y + 1, l);
    mouth(data, "happy");
    for (const x of [12, 25]) dither(data, x, 26, 3, 2, SHADE);
    return;
  }

  if (expression === "surprised") {
    for (const x of [EYE_L - 1, EYE_R - 1]) {
      rect(data, x + lx, EYE_Y - 1 + ly, 4, 4, INK);
      px(data, x + lx + 1, EYE_Y + ly, PAPER);
    }
    mouth(data, "surprised");
    return;
  }

  if (expression === "sad") {
    for (const [x, outer] of [
      [EYE_L, -1],
      [EYE_R, 1],
    ] as const) {
      rect(data, x + lx, EYE_Y + 1 + ly, 3, 3, INK);
      px(data, x + lx, EYE_Y + 2 + ly, PAPER);
      px(data, x + lx + (outer > 0 ? 2 : 0), EYE_Y + ly, INK);
    }
    px(data, 14, 26, INK);
    px(data, 14, 27, INK);
    mouth(data, "frown_sad");
    return;
  }

  if (expression === "angry") {
    for (const x of [EYE_L, EYE_R]) {
      rect(data, x + lx, EYE_Y + 1 + ly, 3, 3, INK);
      px(data, x + lx, EYE_Y + 2 + ly, PAPER);
    }
    for (const [bx, by] of [
      [14, 21],
      [15, 21],
      [16, 22],
      [25, 21],
      [24, 21],
      [23, 22],
    ]) {
      px(data, bx + lx, by + ly, INK);
    }
    mouth(data, "frown_angry");
    return;
  }

  if (expression === "eating") {
    for (const x of [EYE_L, EYE_R]) closedUp(data, x, EYE_Y + 1, l);
    mouth(data, "eating", chew);
    return;
  }

  if (expression === "sing") {
    for (const x of [EYE_L, EYE_R]) closedUp(data, x, EYE_Y + 1, l);
    mouth(data, "sing", chew);
    return;
  }

  if (expression === "sleep") {
    for (const x of [EYE_L, EYE_R]) closedLine(data, x, EYE_Y, l);
    mouth(data, "sleep");
    return;
  }

  for (const x of [EYE_L, EYE_R]) {
    if (blink) closedLine(data, x, EYE_Y, l);
    else openEye(data, x, EYE_Y, l);
  }
  mouth(data, "flat");
}
