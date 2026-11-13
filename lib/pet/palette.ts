/** The app's closed four-value palette. No colour ever enters the sprite. */
export type Rgb = readonly [r: number, g: number, b: number];

export const INK: Rgb = [0, 0, 0];
export const PAPER: Rgb = [255, 255, 255];
export const SHADE: Rgb = [185, 185, 185];
export const DEEP: Rgb = [105, 105, 105];

export const hex = (c: Rgb) =>
  "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");
