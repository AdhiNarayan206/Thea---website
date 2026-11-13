"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { PetEngine, type PetState } from "@/lib/pet/engine";
import styles from "./HeroPet.module.css";

const COPY: Record<PetState, string> = {
  idle: "She's awake.",
  run: "Running to you.",
  jump: "A small hop.",
  fall: "Coming down.",
  happy: "Delighted.",
  eat: "Eating.",
  sing: "Singing.",
  sleep: "Asleep — click to wake her.",
  drag: "Surprised!",
};

type Down = {
  x: number;
  y: number;
  time: number;
  dragging: boolean;
  id: number;
};

export default function HeroPet() {
  const stageRef = useRef<HTMLDivElement>(null);
  const deskRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<PetEngine | null>(null);
  const hoveringRef = useRef(false);
  const downRef = useRef<Down | null>(null);
  const samplesRef = useRef<Array<{ x: number; y: number; t: number }>>([]);
  const lastTapRef = useRef({ time: 0, x: 0, y: 0 });
  const [state, setState] = useState<PetState>("idle");
  const [hovering, setHovering] = useState(false);
  const [clock, setClock] = useState("");

  const localPoint = useCallback((clientX: number, clientY: number) => {
    const rect = deskRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  useEffect(() => {
    const desk = deskRef.current;
    const canvas = canvasRef.current;
    if (!desk || !canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let engine: PetEngine | null = null;
    let raf = 0;
    let ctx: CanvasRenderingContext2D | null = null;

    const measure = () => {
      const rect = desk.getBoundingClientRect();
      if (rect.width < 10 || rect.height < 10) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const scale = Math.max(
        3,
        Math.min(8, Math.floor(Math.min(rect.height * 0.56, rect.width * 0.58) / 40)),
      );

      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      ctx = canvas.getContext("2d");
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!engine) {
        engine = new PetEngine({
          width: rect.width,
          height: rect.height,
          scale,
          reducedMotion: reduce,
          onState: setState,
        });
        engineRef.current = engine;
        engine.setCursor(rect.width * 0.5, rect.height * 0.32);
      } else {
        engine.resize(rect.width, rect.height, scale);
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(desk);
    window.addEventListener("resize", measure);

    let last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const e = engineRef.current;
      const context = ctx;
      if (e && context) {
        e.update(dt);
        e.render(context);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (event: PointerEvent) => {
      const e = engineRef.current;
      if (!e) return;
      const p = localPoint(event.clientX, event.clientY);
      if (!p) return;
      e.setCursor(p.x, p.y);
      if (event.pointerType !== "touch") {
        const isHit = e.hit(p.x, p.y);
        if (isHit !== hoveringRef.current) {
          hoveringRef.current = isHit;
          setHovering(isHit);
        }
      }

      const down = downRef.current;
      if (!down) return;
      if (!down.dragging && event.pointerType === "mouse") {
        if (Math.hypot(p.x - down.x, p.y - down.y) > 5) {
          down.dragging = true;
          e.beginDrag();
        }
      }
      if (down.dragging) {
        e.dragTo(p.x, p.y);
        samplesRef.current.push({ x: p.x, y: p.y, t: performance.now() });
        if (samplesRef.current.length > 12) samplesRef.current.shift();
      }
    };

    const onUp = (event: PointerEvent) => {
      const e = engineRef.current;
      const down = downRef.current;
      if (!e || !down || event.pointerId !== down.id) return;
      downRef.current = null;
      const p = localPoint(event.clientX, event.clientY);
      if (!p) return;

      if (down.dragging) {
        const now = performance.now();
        const recent = samplesRef.current.filter((s) => now - s.t <= 120);
        let vx = 0;
        let vy = 0;
        if (recent.length >= 2) {
          const first = recent[0];
          const lastSample = recent[recent.length - 1];
          const dt = Math.max(0.001, (lastSample.t - first.t) / 1000);
          const cap = 1400 * (e.scale / 5);
          vx = Math.max(-cap, Math.min(cap, (lastSample.x - first.x) / dt));
          vy = Math.max(-cap, Math.min(cap, (lastSample.y - first.y) / dt));
        }
        e.release(vx, vy, p.y);
        return;
      }

      const now = performance.now();
      const last = lastTapRef.current;
      if (now - last.time < 280 && Math.hypot(p.x - last.x, p.y - last.y) < 28) {
        e.doubleTap();
        lastTapRef.current = { time: 0, x: 0, y: 0 };
      } else {
        e.tap();
        lastTapRef.current = { time: now, x: p.x, y: p.y };
      }
    };

    const onKey = (event: KeyboardEvent) => {
      const e = engineRef.current;
      const stage = stageRef.current;
      if (!e || !stage) return;
      const active = document.activeElement;
      const inStage =
        hoveringRef.current || (active instanceof Node && stage.contains(active));
      if (!inStage) return;

      if (event.code === "Space") {
        event.preventDefault();
        e.interact();
      } else if (event.key === "Enter" && active === stage) {
        event.preventDefault();
        e.tap();
      }
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("keydown", onKey);
      engineRef.current = null;
    };
  }, [localPoint]);

  useEffect(() => {
    const tick = () => {
      setClock(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    const target = event.target as HTMLElement;
    if (target.closest("button, a")) return;
    const e = engineRef.current;
    if (!e) return;
    const p = localPoint(event.clientX, event.clientY);
    if (!p || !e.hit(p.x, p.y)) return;
    event.preventDefault();
    downRef.current = {
      x: p.x,
      y: p.y,
      time: performance.now(),
      dragging: false,
      id: event.pointerId,
    };
    samplesRef.current = [{ x: p.x, y: p.y, t: performance.now() }];
  };

  const hop = () => engineRef.current?.tap();
  const run = () => {
    const e = engineRef.current;
    if (!e) return;
    e.runTo(e.width - e.size * 0.5);
  };
  const happy = () => engineRef.current?.doubleTap();
  const rest = () => engineRef.current?.toggleSleep();

  return (
    <div className={styles.wrap}>
      <div
        ref={stageRef}
        className={styles.stage}
        data-hovering={hovering || undefined}
        role="group"
        aria-label="Play with Thea, a live pixel pet"
        aria-describedby="pet-instructions"
        tabIndex={0}
        onPointerDown={onPointerDown}
      >
        <div className={styles.desktop}>
          <div className={styles.live}>
            <span className={styles.liveDot} aria-hidden />
            Live
          </div>
          <div className={styles.dims} aria-hidden>
            40 × 40 px
          </div>

          <div className={styles.note} aria-hidden>
            <div className={styles.noteBar}>
              <span>notes.txt</span>
              <span className={styles.noteDots}>
                <i />
                <i />
                <i />
              </span>
            </div>
            <div className={styles.noteBody}>
              <p>day one.</p>
              <p>there is a small creature on my desktop.</p>
              <p>she has a sprout. i think she is happy.</p>
              <p className={styles.caret}>_</p>
            </div>
          </div>

          <div ref={deskRef} className={styles.desk}>
            <canvas ref={canvasRef} className={styles.canvas} aria-hidden />
          </div>

          <div className={styles.taskbar} aria-hidden>
            <span className={styles.winMark}>
              <i />
              <i />
              <i />
              <i />
            </span>
            <span className={styles.tbApp}>
              <Image
                src="/art/thea-320.png"
                alt=""
                width={22}
                height={22}
                unoptimized
                className={styles.tbIcon}
              />
              Thea
            </span>
            <span className={styles.tray}>{clock || "—:—"}</span>
          </div>

          <div className={styles.edgeNote} aria-hidden>
            drag her up to feed
          </div>
        </div>

        <div className={styles.footer}>
          <p className={styles.status} aria-live="polite">
            <span className={styles.statusDot} aria-hidden />
            {COPY[state]}
          </p>
          <div className={styles.actions}>
            <button type="button" className={styles.action} onClick={hop}>
              Hop
            </button>
            <button type="button" className={styles.action} onClick={run}>
              Run
            </button>
            <button type="button" className={styles.action} onClick={happy}>
              Happy
            </button>
            <button type="button" className={styles.action} onClick={rest}>
              {state === "sleep" ? "Wake" : "Sleep"}
            </button>
          </div>
        </div>
      </div>

      <p id="pet-instructions" className="sr-only">
        Thea is a live pixel pet. Move your pointer and her eyes will follow it.
        Click her to hop, double-click for a happy face, drag her to pick her up,
        drop her in the top of the stage to feed her, and press Space while she is
        hovered or focused to make her run. The buttons below the stage do the
        same things.
      </p>

      <div className={styles.hints} aria-hidden>
        <span>
          <i>Move</i> her eyes follow you
        </span>
        <span>
          <i>Click</i> hop
        </span>
        <span>
          <i>Double-click</i> joy
        </span>
        <span>
          <i>Space</i> run
        </span>
      </div>
    </div>
  );
}
