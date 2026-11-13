/**
 * A browser-sized version of the desktop app's state machine.
 * Physics stays in CSS pixels; every constant is scaled from the app's
 * default 5x sprite scale so she moves with the same weight.
 */
import { drawFace, type Expression, type Look } from "./expressions";
import { Particles, type ParticleKind, type SpawnOptions } from "./particles";
import { flipX, hitMask, H, renderBody, W, type Pose } from "./rig";

export type PetState = "idle" | "run" | "jump" | "fall" | "happy" | "eat" | "sing" | "sleep" | "drag";

const GRAVITY = 1500;
const RUN_SPEED = 270;
const RUN_TIMEOUT = 2.6;
const RUN_ARRIVE = 26;
const JUMP_VELOCITY = -560;
const DRAG_ANGRY_AFTER = 4.0;
const FEED_ZONE = 0.16;
const EAT_SECONDS = 2.6;
const SING_SECONDS = 4.2;

const approach = (value: number, target: number, step: number) =>
  value < target ? Math.min(value + step, target) : Math.max(value - step, target);

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

type Options = {
  width: number;
  height: number;
  scale: number;
  reducedMotion?: boolean;
  onState?: (state: PetState) => void;
};

export class PetEngine {
  scale: number;
  size: number;
  width: number;
  height: number;
  x: number;
  y: number;
  vx = 0;
  vy = 0;
  facing: 1 | -1 = 1;
  state: PetState = "idle";
  stateT = 0;
  t = 0;
  squash = 0;
  cursor: [number, number] = [-1, -1];
  isDragging = false;

  private reduced: boolean;
  private onState?: (state: PetState) => void;
  private surprisedT = 0;
  private angryT = 0;
  private runTarget: number | null = null;
  private runUntil = 0;
  private idleT = 0;
  private blinkIn = 2.4 + Math.random() * 2.4;
  private blinkT = 0;
  private dragStartedAt = 0;
  private dustT = 0;
  private emitT = 0;
  private hitmask = hitMask();
  private off = document.createElement("canvas");
  private particles = new Particles();

  constructor({ width, height, scale, reducedMotion = false, onState }: Options) {
    this.width = width;
    this.height = height;
    this.scale = scale;
    this.size = W * scale;
    this.x = (width - this.size) / 2;
    this.y = this.floor();
    this.reduced = reducedMotion;
    this.onState = onState;
    this.off.width = W;
    this.off.height = H;
  }

  get feedY() {
    return this.height * FEED_ZONE;
  }

  floor() {
    return this.height - this.size;
  }

  private k() {
    return this.scale / 5;
  }

  private setState(state: PetState) {
    if (this.state === state) return;
    this.state = state;
    this.stateT = 0;
    this.onState?.(state);
  }

  resize(width: number, height: number, scale: number) {
    const cx = this.x + this.size / 2;
    this.width = width;
    this.height = height;
    this.scale = scale;
    this.size = W * scale;
    this.x = clamp(cx - this.size / 2, 0, Math.max(0, width - this.size));
    this.y = clamp(this.y, 0, this.floor());
    if (this.state === "idle" || this.state === "sleep") this.y = this.floor();
  }

  setCursor(x: number, y: number) {
    this.cursor = [x, y];
  }

  hit(px: number, py: number) {
    const lx = Math.round((px - this.x) / this.scale);
    const ly = Math.round((py - this.y) / this.scale);
    if (lx < 0 || lx >= W || ly < 0 || ly >= H) {
      const pad = 6;
      return (
        px >= this.x - pad &&
        px <= this.x + this.size + pad &&
        py >= this.y - pad &&
        py <= this.y + this.size + pad
      );
    }
    return this.hitmask[ly * W + lx] === 1;
  }

  private head(): [number, number] {
    return [this.x + this.size * 0.5, this.y + this.size * 0.22];
  }

  private mouthPoint(): [number, number] {
    return [this.x + this.size * 0.5, this.y + this.size * 0.7];
  }

  private feet(): [number, number] {
    return [this.x + this.size * 0.5, this.y + this.size * 0.92];
  }

  private bowlPos(): [number, number] {
    return [this.x + this.size * 0.74, this.y + this.size * 0.84];
  }

  private spawn(kind: ParticleKind, at: [number, number], o: SpawnOptions = {}) {
    this.particles.spawn(kind, at[0], at[1], o);
  }

  interact() {
    if (this.state === "sleep") return this.wake();
    if (this.state === "eat" || this.state === "sing" || this.state === "drag") return;

    const cx = this.x + this.size / 2;
    const side = this.cursor[0] >= cx ? 1 : -1;
    const target =
      Math.abs(this.cursor[0] - cx) < this.size * 0.5
        ? this.cursor[0] + side * this.size * 2.2
        : this.cursor[0];

    this.runTarget = clamp(target, 0, this.width);
    this.runUntil = this.t + RUN_TIMEOUT;
    this.setState("run");
    this.idleT = 0;
  }

  runTo(x: number) {
    if (this.state === "sleep") this.wake();
    if (this.state === "eat" || this.state === "sing" || this.state === "drag") return;
    this.runTarget = clamp(x, 0, this.width);
    this.runUntil = this.t + RUN_TIMEOUT;
    this.setState("run");
    this.idleT = 0;
  }

  tap() {
    if (this.state === "sleep") return this.wake();
    if (this.state === "eat" || this.state === "sing" || this.state === "drag") return;
    this.vy = JUMP_VELOCITY * this.k();
    this.setState("jump");
    this.squash = 0.1;
  }

  doubleTap() {
    if (this.state === "drag") return;
    this.setState("happy");
    this.squash = 0;
    this.spawn("heart", this.head(), { n: 4, spread: this.size * 0.1, vy: -40 });
  }

  beginDrag() {
    this.setState("drag");
    this.isDragging = true;
    this.dragStartedAt = this.t;
    this.idleT = 0;
    this.vx = 0;
    this.vy = 0;
    this.particles.clear();
  }

  dragTo(px: number, py: number) {
    this.x = clamp(px - this.size / 2, 0, Math.max(0, this.width - this.size));
    this.y = clamp(py - this.size * 0.45, 0, this.floor());
  }

  release(vx: number, vy: number, dropY: number) {
    this.isDragging = false;
    if (dropY < this.feedY) {
      this.startEat(this.x + this.size / 2, this.feedY);
      return;
    }
    this.vx = vx * 0.75;
    this.vy = vy * 0.75;
    const held = this.t - this.dragStartedAt;
    if (held > DRAG_ANGRY_AFTER) this.angryT = 2.4;
    else if (held < 0.35) {
      this.vx *= 0.5;
      this.vy = Math.min(this.vy, 0);
    }
    this.setState("fall");
  }

  startEat(x?: number, y?: number) {
    if (x !== undefined) {
      this.x = clamp(x - this.size / 2, 0, Math.max(0, this.width - this.size));
    }
    this.y = y === undefined ? this.floor() : clamp(y, 0, this.floor());
    this.vx = 0;
    this.vy = 0;
    this.isDragging = false;
    this.setState("eat");
    this.spawn("crumb", this.mouthPoint(), { n: 3, spread: this.size * 0.05 });
  }

  sleep() {
    if (this.state === "drag" || this.state === "eat") return;
    this.vx = 0;
    this.vy = 0;
    this.setState("sleep");
  }

  wake() {
    if (this.state !== "sleep") return;
    this.setState("idle");
    this.surprisedT = 0.5;
    this.spawn("bang", this.head(), { n: 2, spread: this.size * 0.1, vy: -30 });
  }

  toggleSleep() {
    if (this.state === "sleep") this.wake();
    else this.sleep();
  }

  sing() {
    if (this.state === "drag") return;
    if (this.state === "sleep") this.wake();
    this.vx = 0;
    this.vy = 0;
    this.setState("sing");
  }

  expression(): Expression {
    if (this.state === "eat") return "eating";
    if (this.state === "sing") return "sing";
    if (this.state === "sleep") return "sleep";
    if (this.state === "happy") return "happy";
    if (this.state === "drag") return "surprised";
    if (this.surprisedT > 0) return "surprised";
    if (this.angryT > 0) return "angry";
    return "neutral";
  }

  private blinking() {
    return (
      this.blinkT > 0 &&
      !["sleep", "happy", "eat", "sing"].includes(this.state)
    );
  }

  private lookForFace(): Look {
    if (this.expression() === "sleep" || this.expression() === "happy") return [0, 0];
    const cx = this.x + this.size / 2;
    const dx = this.cursor[0] - cx;
    const dy = this.cursor[1] - (this.y + this.size * 0.55);
    let lx = Math.abs(dx) < this.size * 0.12 ? 0 : dx > 0 ? 1 : -1;
    const ly = Math.abs(dy) < this.size * 0.35 ? 0 : dy < 0 ? -1 : 1;
    if (this.facing < 0) lx = -lx;
    return [lx, ly];
  }

  private pose(): Pose {
    const t = this.t;
    let squash = this.squash;
    let arm = 0;
    let sway = this.reduced ? 0 : Math.sin(t * 1.6) * 0.4;
    let tilt = 0;

    if (!this.reduced) {
      if (this.state === "run") {
        squash += Math.sin(t * 15) * 0.022;
        arm = Math.sin(t * 15) * 0.9;
        sway = Math.sin(t * 6) * 0.8;
        tilt = 0.03 * this.facing;
      } else if (this.state === "happy") {
        squash += Math.sin(t * 11) * 0.05;
        arm = 0.9;
        sway = Math.sin(t * 5) * 0.9;
      } else if (this.state === "idle") {
        squash += Math.sin(t * 2.2) * 0.014;
        sway = Math.sin(t * 1.5) * 0.45;
      } else if (this.state === "sleep") {
        squash += Math.sin(t * 1.05) * 0.02;
        sway = Math.sin(t * 1.1) * 0.25;
      } else if (this.state === "drag") {
        squash = -0.06;
        arm = Math.sin(t * 9) * 0.5;
        sway = Math.sin(t * 7) * 0.5;
      }
    } else if (this.state === "drag") {
      squash = -0.06;
    }

    return { squash, tilt, sway, arm };
  }

  update(dtRaw: number) {
    const dt = Math.min(dtRaw, 0.05);
    this.t += dt;
    this.stateT += dt;
    this.surprisedT = Math.max(0, this.surprisedT - dt);
    this.angryT = Math.max(0, this.angryT - dt);
    this.squash = approach(this.squash, 0, 0.85 * dt);

    this.blinkIn -= dt;
    if (this.blinkIn <= 0) {
      this.blinkT = 0.13;
      this.blinkIn = 2.4 + Math.random() * 3.4;
    }
    this.blinkT = Math.max(0, this.blinkT - dt);

    if (this.state === "idle" || this.state === "run") {
      this.idleT += dt;
      if (this.state === "idle" && this.idleT > 28) this.sleep();
    } else {
      this.idleT = 0;
    }

    if (this.state === "run") {
      const cx = this.x + this.size / 2;
      if (this.runTarget === null || this.t > this.runUntil) {
        this.setState("idle");
      } else {
        const dir = this.runTarget > cx ? 1 : -1;
        if (Math.abs(this.runTarget - cx) <= RUN_ARRIVE * this.k()) {
          this.arrive();
        } else {
          this.facing = dir > 0 ? 1 : -1;
          this.vx = dir * RUN_SPEED * this.k();
          this.x += this.vx * dt;
          const lo = 0;
          const hi = this.width - this.size;
          if (this.x < lo) {
            this.x = lo;
            this.vx = 0;
            this.setState("idle");
          } else if (this.x > hi) {
            this.x = hi;
            this.vx = 0;
            this.setState("idle");
          }
          this.dustT -= dt;
          if (this.dustT <= 0) {
            this.dustT = 0.12;
            const [fx, fy] = this.feet();
            this.spawn("dust", [fx - this.facing * this.size * 0.16, fy], {
              n: 2,
              spread: this.size * 0.04,
              vy: -20,
              life: 0.45,
            });
          }
        }
      }
    } else if (this.state === "jump" || this.state === "fall") {
      this.vy += GRAVITY * this.k() * dt;
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      const hi = this.width - this.size;
      if (this.x < 0) {
        this.x = 0;
        this.vx = Math.abs(this.vx) * 0.35;
      } else if (this.x > hi) {
        this.x = hi;
        this.vx = -Math.abs(this.vx) * 0.35;
      }
      const ground = this.floor();
      if (this.y >= ground) {
        const impact = this.vy;
        this.y = ground;
        this.vy = 0;
        this.vx = 0;
        this.setState("idle");
        this.squash = -Math.min(0.22, Math.abs(impact) / (5200 * this.k()));
        if (impact > 500 * this.k()) {
          const [fx, fy] = this.feet();
          this.spawn("dust", [fx, fy], {
            n: 6,
            spread: this.size * 0.18,
            vy: -40,
            life: 0.5,
          });
        }
      }
    } else if (this.state === "happy") {
      this.emitT -= dt;
      if (this.emitT <= 0) {
        this.emitT = 0.22;
        this.spawn("heart", this.head(), { spread: this.size * 0.12, vy: -45, life: 1.2 });
      }
      this.facing = this.cursor[0] >= this.x + this.size / 2 ? 1 : -1;
      if (this.stateT > 1.9) this.setState("idle");
    } else if (this.state === "eat") {
      this.emitT -= dt;
      if (this.emitT <= 0) {
        this.emitT = 0.34;
        const [bx, by] = this.bowlPos();
        this.spawn("crumb", [bx, by - this.size * 0.04], {
          n: 2,
          spread: this.size * 0.05,
          vy: -30,
          life: 0.6,
        });
      }
      if (this.stateT > EAT_SECONDS) {
        this.vy = 40 * this.k();
        this.setState("fall");
      }
    } else if (this.state === "sing") {
      this.emitT -= dt;
      if (this.emitT <= 0) {
        this.emitT = 0.3;
        const [hx, hy] = this.head();
        this.spawn("note", [hx + this.size * (0.12 + Math.random() * 0.18), hy], {
          spread: this.size * 0.05,
          vy: -55,
          life: 1.5,
        });
      }
      if (this.stateT > SING_SECONDS) this.setState("idle");
    } else if (this.state === "sleep") {
      this.emitT -= dt;
      if (this.emitT <= 0) {
        this.emitT = 0.85;
        const [hx, hy] = this.head();
        this.spawn("zzz", [hx + this.size * 0.2, hy], {
          spread: this.size * 0.06,
          vy: -28,
          life: 2,
        });
      }
    } else if (this.state === "idle") {
      const cx = this.x + this.size / 2;
      if (Math.abs(this.cursor[0] - cx) > this.size * 0.15) {
        this.facing = this.cursor[0] >= cx ? 1 : -1;
      }
    }

    if (this.surprisedT > 0 && this.state !== "drag") {
      this.emitT -= dt;
      if (this.emitT <= 0) {
        this.emitT = 0.45;
        const [hx, hy] = this.head();
        this.spawn("bang", [hx + this.size * 0.18, hy - this.size * 0.05], {
          spread: this.size * 0.05,
          vy: -35,
          life: 0.8,
        });
      }
    }

    if (this.expression() === "angry" && this.state !== "sleep") {
      this.emitT -= dt;
      if (this.emitT <= 0) {
        this.emitT = 0.5;
        const [hx, hy] = this.head();
        this.spawn("steam", [hx + this.size * 0.16, hy - this.size * 0.12], {
          spread: this.size * 0.04,
          vy: -45,
          life: 1,
        });
      }
    }

    this.particles.update(dt);
  }

  private arrive() {
    this.setState("jump");
    this.vy = -300 * this.k();
    this.vx = 0;
    this.facing = this.runTarget !== null && this.runTarget >= this.x + this.size / 2 ? 1 : -1;
    this.spawn("sparkle", this.head(), { n: 3, spread: this.size * 0.1, vy: -30 });
  }

  render(ctx: CanvasRenderingContext2D) {
    const frame = renderBody(this.pose());
    const expr = this.expression();
    const chew = (Math.sin(this.t * 9) + 1) / 2;
    drawFace(frame, expr, this.lookForFace(), this.blinking(), chew);
    const pixels = this.facing < 0 ? flipX(frame) : frame;

    const off = this.off.getContext("2d");
    if (!off) return;
    const imgData = off.createImageData(W, H);
    imgData.data.set(pixels);
    off.putImageData(imgData, 0, 0);

    ctx.clearRect(0, 0, this.width, this.height);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this.off, Math.round(this.x), Math.round(this.y), this.size, this.size);

    if (this.state === "eat") this.drawBowl(ctx);

    if (this.isDragging && this.cursor[1] < this.feedY) this.drawShelf(ctx);

    this.particles.draw(ctx, this.scale);
  }

  private drawBowl(ctx: CanvasRenderingContext2D) {
    const s = this.scale;
    const [bx, by] = this.bowlPos();
    const cell = (x: number, y: number, w: number, h: number, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(Math.round(bx + x * s), Math.round(by + y * s), Math.round(w * s), Math.round(h * s));
    };
    cell(0, 0, 6, 1, "#000");
    cell(0, 1, 1, 2, "#000");
    cell(5, 1, 1, 2, "#000");
    cell(1, 1, 4, 1, "#b9b9b9");
    cell(1, 2, 4, 1, "#fff");
  }

  private drawShelf(ctx: CanvasRenderingContext2D) {
    const s = Math.max(2, Math.round(this.scale));
    const y = Math.round(this.feedY);
    ctx.fillStyle = "#000";
    for (let x = 0; x < this.width; x += s * 4) {
      ctx.fillRect(x, y, s * 2, s);
    }
  }
}
