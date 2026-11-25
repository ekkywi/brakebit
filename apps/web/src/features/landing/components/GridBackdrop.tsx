"use client";

import { useEffect, useRef } from "react";

const GAP = 4;
const FRAME_MS = 33;
const MIN_BLINKS = 5;

type Blink = {
  col: number;
  row: number;
  start: number;
  duration: number;
  peak: number;
};

type Colors = { cell: string; lit: string; peak: number };

function readColors(el: HTMLElement): Colors {
  const style = getComputedStyle(el);
  const peak = Number.parseFloat(style.getPropertyValue("--grid-peak"));
  return {
    cell: style.getPropertyValue("--grid-cell").trim() || "rgba(128,128,128,0.05)",
    lit: style.getPropertyValue("--accent").trim() || "#0b7285",
    peak: Number.isFinite(peak) ? peak : 0.14,
  };
}

/** Fast rise, slow fade. t is 0..1. */
function envelope(t: number): number {
  if (t < 0.1) return t / 0.1;
  return (1 - (t - 0.1) / 0.9) ** 2;
}

/**
 * Hero backdrop: a sparse square grid where a few squares light up at random.
 * Purpose: a check reads many values, so the field shows many small readings
 * changing out of order. Pauses off screen and in hidden tabs; static under
 * prefers-reduced-motion.
 */
export function GridBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    const base = document.createElement("canvas");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    let colors = readColors(canvas);
    let width = 0;
    let height = 0;
    let step = 36;
    let cols = 0;
    let rows = 0;
    let blinks: Blink[] = [];
    let raf = 0;
    let lastFrame = 0;
    let onScreen = true;

    function drawBase() {
      const baseCtx = base.getContext("2d");
      if (!baseCtx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      base.width = Math.round(width * dpr);
      base.height = Math.round(height * dpr);
      baseCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      baseCtx.clearRect(0, 0, width, height);
      baseCtx.fillStyle = colors.cell;
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          baseCtx.fillRect(c * step, r * step, step - GAP, step - GAP);
        }
      }
    }

    function drawFrame(now: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(base, 0, 0, width, height);
      ctx.fillStyle = colors.lit;
      blinks = blinks.filter((b) => now - b.start < b.duration);
      for (const b of blinks) {
        const t = (now - b.start) / b.duration;
        ctx.globalAlpha = b.peak * envelope(t);
        ctx.fillRect(b.col * step, b.row * step, step - GAP, step - GAP);
      }
      ctx.globalAlpha = 1;
    }

    /** Fixed pattern for reduced motion: same squares every load. */
    function drawStatic() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(base, 0, 0, width, height);
      ctx.fillStyle = colors.lit;
      ctx.globalAlpha = colors.peak * 0.6;
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          const hash = (c * 73856093) ^ (r * 19349663);
          if (Math.abs(hash) % 23 === 0) {
            ctx.fillRect(c * step, r * step, step - GAP, step - GAP);
          }
        }
      }
      ctx.globalAlpha = 1;
    }

    function spawn(now: number) {
      blinks.push({
        col: Math.floor(Math.random() * cols),
        row: Math.floor(Math.random() * rows),
        start: now,
        duration: 1600 + Math.random() * 1800,
        peak: colors.peak * (0.45 + Math.random() * 0.55),
      });
    }

    function tick(now: number) {
      raf = requestAnimationFrame(tick);
      if (now - lastFrame < FRAME_MS) return;
      lastFrame = now;
      const target = Math.max(MIN_BLINKS, Math.round(cols * rows * 0.012));
      if (blinks.length < target && Math.random() < 0.45) spawn(now);
      drawFrame(now);
    }

    function sync() {
      const shouldRun =
        onScreen && !document.hidden && !reduce.matches;
      if (shouldRun && !raf) {
        raf = requestAnimationFrame(tick);
      } else if (!shouldRun && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      if (reduce.matches) drawStatic();
    }

    function layout() {
      if (!canvas || !ctx || !host) return;
      const rect = host.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width === 0 || height === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      step = width < 640 ? 28 : 36;
      cols = Math.ceil(width / step);
      rows = Math.ceil(height / step);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      blinks = [];
      drawBase();
      if (reduce.matches) drawStatic();
      else drawFrame(performance.now());
    }

    layout();
    sync();

    const resizeObserver = new ResizeObserver(layout);
    resizeObserver.observe(host);

    const intersection = new IntersectionObserver(([entry]) => {
      onScreen = entry?.isIntersecting ?? true;
      sync();
    });
    intersection.observe(host);

    const themeObserver = new MutationObserver(() => {
      colors = readColors(canvas);
      layout();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    document.addEventListener("visibilitychange", sync);
    reduce.addEventListener("change", sync);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersection.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reduce.removeEventListener("change", sync);
    };
  }, []);

  return (
    <div className="hero-backdrop" aria-hidden>
      <canvas ref={canvasRef} />
    </div>
  );
}
