"use client";

import { useEffect, useRef } from "react";

const ORBS = [
  { nx: 0.14, ny: 0.28, nr: 0.55, r: 52, g: 32, b: 190, fx: 0.00018, fy: 0.00024, px: 0.0, py: 1.0 },
  { nx: 0.78, ny: 0.17, nr: 0.45, r: 158, g: 22, b: 118, fx: 0.00022, fy: 0.00019, px: 2.1, py: 0.5 },
  { nx: 0.84, ny: 0.78, nr: 0.52, r: 14, g: 52, b: 188, fx: 0.00015, fy: 0.00021, px: 4.0, py: 3.0 },
  { nx: 0.22, ny: 0.82, nr: 0.40, r: 72, g: 16, b: 168, fx: 0.00020, fy: 0.00016, px: 1.0, py: 5.0 },
  { nx: 0.50, ny: 0.50, nr: 0.34, r: 138, g: 16, b: 98, fx: 0.00017, fy: 0.00025, px: 3.0, py: 2.0 },
] as const;

export function GlassBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Explicit typed aliases so TypeScript doesn't lose narrowing in closures
    const cvs: HTMLCanvasElement = canvas;
    const c: CanvasRenderingContext2D = ctx;

    let rafId: number;
    let W = 0;
    let H = 0;

    interface Star { nx: number; ny: number; radius: number; baseAlpha: number; phase: number }
    let stars: Star[] = [];

    function buildStars() {
      stars = [];
      for (let i = 0; i < 130; i++) {
        stars.push({
          nx: Math.random(),
          ny: Math.random(),
          radius: Math.random() * 0.85 + 0.25,
          baseAlpha: Math.random() * 0.20 + 0.04,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    function resize() {
      W = cvs.width = window.innerWidth;
      H = cvs.height = window.innerHeight;
      buildStars();
    }

    resize();
    window.addEventListener("resize", resize);

    function draw(ts: number) {
      c.fillStyle = "hsl(240,40%,4%)";
      c.fillRect(0, 0, W, H);

      for (const s of stars) {
        const a = s.baseAlpha + 0.055 * Math.sin(ts * 0.00072 + s.phase);
        c.beginPath();
        c.arc(s.nx * W, s.ny * H, s.radius, 0, Math.PI * 2);
        c.fillStyle = `rgba(210,205,255,${a.toFixed(3)})`;
        c.fill();
      }

      const prevOp = c.globalCompositeOperation;
      c.globalCompositeOperation = "screen";

      for (const o of ORBS) {
        const cx = (o.nx + Math.sin(ts * o.fx + o.px) * 0.10) * W;
        const cy = (o.ny + Math.cos(ts * o.fy + o.py) * 0.10) * H;
        const radius = o.nr * Math.min(W, H);

        const grad = c.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grad.addColorStop(0, `rgba(${o.r},${o.g},${o.b},0.68)`);
        grad.addColorStop(0.42, `rgba(${o.r},${o.g},${o.b},0.18)`);
        grad.addColorStop(1, `rgba(${o.r},${o.g},${o.b},0)`);

        c.fillStyle = grad;
        c.beginPath();
        c.arc(cx, cy, radius, 0, Math.PI * 2);
        c.fill();
      }

      c.globalCompositeOperation = prevOp;
      rafId = requestAnimationFrame(draw);
    }

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none hidden dark:block"
      aria-hidden="true"
    />
  );
}
