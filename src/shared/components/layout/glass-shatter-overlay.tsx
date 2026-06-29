"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function triggerGlassShatter(href: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("glass-shatter", { detail: { href } }));
}

interface CrackPath {
  points: [number, number][];
}

interface ShardData {
  verts: [number, number][];
  cx: number;
  cy: number;
  vx: number;
  vy: number;
  rotSpeed: number;
  delay: number;
  colorA: string;
  colorB: string;
  depthSize: number;
}

// ── Web Audio glass-break sound ──────────────────────────────────────────────

function playGlassBreakSound() {
  try {
    const ac = new AudioContext();
    const now = ac.currentTime;

    // Helper: burst of filtered noise
    function noiseBurst(
      startTime: number,
      duration: number,
      hpFreq: number,
      gainAmt: number,
      decay: number,
    ) {
      const bufSize = Math.ceil(ac.sampleRate * duration);
      const buf = ac.createBuffer(1, bufSize, ac.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-(i / ac.sampleRate) * decay);
      }
      const src = ac.createBufferSource();
      src.buffer = buf;
      const hp = ac.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = hpFreq;
      const g = ac.createGain();
      g.gain.value = gainAmt;
      src.connect(hp);
      hp.connect(g);
      g.connect(ac.destination);
      src.start(startTime);
    }

    // Helper: glassy ringing tone
    function ringTone(startTime: number, freq: number, gainAmt: number, duration: number) {
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.frequency.value = freq;
      osc.type = "sine";
      g.gain.setValueAtTime(gainAmt, startTime);
      g.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      osc.connect(g);
      g.connect(ac.destination);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    }

    // Impact crack
    noiseBurst(now, 0.06, 1400, 0.75, 18);
    // Main shatter cascade
    noiseBurst(now + 0.018, 1.0, 700, 0.50, 6);
    // Secondary rumble
    noiseBurst(now + 0.07, 0.7, 1100, 0.32, 9);
    // Tinkle overtones — ringing glass fragments
    const TINKLE = [1200, 1850, 2600, 3400, 4500, 5900, 7800, 9500, 11200];
    TINKLE.forEach((freq, i) => {
      const t = now + 0.03 + i * 0.045 + Math.random() * 0.09;
      ringTone(t, freq + (Math.random() - 0.5) * 200, 0.06 + Math.random() * 0.07, 0.18 + Math.random() * 0.55);
    });

    setTimeout(() => ac.close(), 4000);
  } catch {
    // Audio blocked or not supported — silent fail
  }
}

// ── Crack geometry ───────────────────────────────────────────────────────────

function buildCracks(W: number, H: number, ox: number, oy: number): CrackPath[] {
  const cracks: CrackPath[] = [];
  const count = 16;
  const diag = Math.sqrt(W * W + H * H);

  for (let i = 0; i < count; i++) {
    const baseAngle = (i / count) * Math.PI * 2;
    const angle = baseAngle + (Math.random() - 0.5) * 0.5;
    const len = diag * (0.42 + Math.random() * 0.48);
    const steps = 14;
    const points: [number, number][] = [[ox, oy]];
    let curAngle = angle;

    for (let s = 1; s <= steps; s++) {
      curAngle += (Math.random() - 0.5) * 0.22;
      const p = s / steps;
      points.push([
        ox + Math.cos(curAngle) * len * p,
        oy + Math.sin(curAngle) * len * p,
      ]);

      // Secondary branch at ~1/3 length
      if (s === 5 && Math.random() > 0.38) {
        const ba = curAngle + (Math.random() - 0.5) * 1.3;
        const blen = len * (0.22 + Math.random() * 0.28);
        const bpts: [number, number][] = [[points[s][0], points[s][1]]];
        let bAngle = ba;
        for (let b = 1; b <= 6; b++) {
          bAngle += (Math.random() - 0.5) * 0.2;
          bpts.push([
            points[s][0] + Math.cos(bAngle) * blen * (b / 6),
            points[s][1] + Math.sin(bAngle) * blen * (b / 6),
          ]);
        }
        cracks.push({ points: bpts });
      }
    }
    cracks.push({ points });
  }
  return cracks;
}

// ── Big glass cube shards ────────────────────────────────────────────────────

function buildShards(W: number, H: number, ox: number, oy: number): ShardData[] {
  const shards: ShardData[] = [];

  const COLOR_PAIRS: [string, string][] = [
    ["rgba(185,172,255,0.55)", "rgba(105,92,228,0.38)"],
    ["rgba(255,182,244,0.46)", "rgba(162,102,228,0.32)"],
    ["rgba(162,205,255,0.50)", "rgba(80,122,245,0.35)"],
    ["rgba(205,182,255,0.56)", "rgba(144,112,235,0.38)"],
    ["rgba(255,202,225,0.42)", "rgba(182,82,182,0.30)"],
    ["rgba(142,222,255,0.48)", "rgba(62,142,255,0.32)"],
  ];

  // Ring config: [innerFraction, outerFraction, sliceCount, depthPx]
  // Fewer slices on inner rings = large cube-like chunks
  const RINGS: [number, number, number, number][] = [
    [0.00, 0.28, 4,  22],   // 4 very large inner chunks
    [0.22, 0.50, 7,  17],   // 7 large middle pieces
    [0.44, 0.72, 11, 12],   // 11 medium pieces
    [0.65, 0.96, 15,  8],   // 15 smaller outer shards
  ];

  const maxR = Math.max(W, H);

  RINGS.forEach(([rIF, rOF, slices, depthSize], ring) => {
    for (let s = 0; s < slices; s++) {
      const rotOffset = ring % 2 === 0 ? 0 : Math.PI / slices;
      const a1 = (s / slices) * Math.PI * 2 + rotOffset;
      const a2 = ((s + 1) / slices) * Math.PI * 2 + rotOffset;

      const jR = () => 0.78 + Math.random() * 0.44;
      const jA = () => (Math.random() - 0.5) * 0.28;

      const ri1 = rIF * maxR * jR();
      const ri2 = rIF * maxR * jR();
      const ro1 = rOF * maxR * jR();
      const ro2 = rOF * maxR * jR();

      const verts: [number, number][] = [
        [ox + ri1 * Math.cos(a1 + jA()), oy + ri1 * Math.sin(a1 + jA())],
        [ox + ri2 * Math.cos(a2 + jA()), oy + ri2 * Math.sin(a2 + jA())],
        [ox + ro2 * Math.cos(a2 + jA()), oy + ro2 * Math.sin(a2 + jA())],
        [ox + ro1 * Math.cos(a1 + jA()), oy + ro1 * Math.sin(a1 + jA())],
      ];

      const cx = (verts[0][0] + verts[1][0] + verts[2][0] + verts[3][0]) / 4;
      const cy = (verts[0][1] + verts[1][1] + verts[2][1] + verts[3][1]) / 4;
      const dx = cx - ox;
      const dy = cy - oy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;

      // Inner chunks fly slower (heavier); outer faster
      const speed = 2.5 + ring * 1.8 + Math.random() * 4.0;
      const colorPair = COLOR_PAIRS[(ring * slices + s) % COLOR_PAIRS.length];

      shards.push({
        verts,
        cx, cy,
        vx: (dx / dist) * speed,
        vy: (dy / dist) * speed,
        rotSpeed: (Math.random() - 0.5) * (0.04 + ring * 0.015),
        delay: ring * 32 + Math.random() * 50,
        colorA: colorPair[0],
        colorB: colorPair[1],
        depthSize,
      });
    }
  });

  return shards;
}

// ── Component ────────────────────────────────────────────────────────────────

export function GlassShatterOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onShatter = (evt: Event) => {
      const { href } = (evt as CustomEvent<{ href: string }>).detail;

      if (!document.documentElement.classList.contains("dark")) {
        router.push(href);
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        router.push(href);
        return;
      }

      const cvs: HTMLCanvasElement = canvas;
      const c: CanvasRenderingContext2D = ctx;

      const W = (cvs.width = window.innerWidth);
      const H = (cvs.height = window.innerHeight);
      cvs.style.display = "block";

      // Random break origin — anywhere on screen (not near edges)
      const ox = W * (0.15 + Math.random() * 0.70);
      const oy = H * (0.15 + Math.random() * 0.70);

      playGlassBreakSound();

      const cracks = buildCracks(W, H, ox, oy);
      const shards = buildShards(W, H, ox, oy);

      const START = performance.now();
      const CRACK_END = 130;
      const TOTAL = 900;
      let navigated = false;

      cancelAnimationFrame(rafRef.current);

      function frame(now: number) {
        const t = now - START;
        c.clearRect(0, 0, W, H);

        // ── Origin burst flash ──────────────────────────────────────
        if (t < CRACK_END * 1.6) {
          const fp = Math.min(1, t / (CRACK_END * 1.6));
          const flashA = 0.90 * (1 - fp);
          const flashR = 160 * Math.sqrt(fp);
          const fg = c.createRadialGradient(ox, oy, 0, ox, oy, flashR);
          fg.addColorStop(0, `rgba(228,220,255,${flashA.toFixed(3)})`);
          fg.addColorStop(0.45, `rgba(168,148,255,${(flashA * 0.38).toFixed(3)})`);
          fg.addColorStop(1, "rgba(168,148,255,0)");
          c.fillStyle = fg;
          c.beginPath();
          c.arc(ox, oy, flashR, 0, Math.PI * 2);
          c.fill();
        }

        // ── Cracks growing outward ──────────────────────────────────
        if (t < CRACK_END + 100) {
          const crackP = Math.min(1, t / CRACK_END);
          const fadeOut = t < CRACK_END ? 1.0 : 1 - (t - CRACK_END) / 100;

          for (const crack of cracks) {
            const pts = crack.points;
            const vis = Math.max(2, Math.ceil(pts.length * crackP));
            const end = Math.min(vis, pts.length);

            // Soft glow
            c.beginPath();
            c.moveTo(pts[0][0], pts[0][1]);
            for (let i = 1; i < end; i++) c.lineTo(pts[i][0], pts[i][1]);
            c.strokeStyle = `rgba(195,178,255,${(0.40 * fadeOut).toFixed(3)})`;
            c.lineWidth = 4;
            c.stroke();

            // Sharp white core
            c.beginPath();
            c.moveTo(pts[0][0], pts[0][1]);
            for (let i = 1; i < end; i++) c.lineTo(pts[i][0], pts[i][1]);
            c.strokeStyle = `rgba(255,255,255,${(0.92 * fadeOut).toFixed(3)})`;
            c.lineWidth = 0.9;
            c.stroke();
          }
        }

        // ── Glass cube shards flying ────────────────────────────────
        const shardStart = CRACK_END * 0.52;
        if (t > shardStart) {
          const st = t - shardStart;

          for (const shard of shards) {
            if (st < shard.delay) continue;

            const duration = TOTAL * 0.88 - shardStart;
            const lt = Math.min(1, (st - shard.delay) / duration);
            const eased = 1 - Math.pow(1 - lt, 3);
            const px = shard.vx * eased * 440;
            const py = shard.vy * eased * 440 + eased * eased * 65;
            const rot = shard.rotSpeed * lt * Math.PI * 3.0;
            const alpha = Math.max(0, 1 - lt * 1.15);

            if (alpha <= 0.01) continue;

            c.save();
            c.globalAlpha = alpha;
            c.translate(shard.cx + px, shard.cy + py);
            c.rotate(rot);
            c.translate(-shard.cx, -shard.cy);

            const v = shard.verts;
            const d = shard.depthSize;
            // Depth direction: fixed light source from upper-left
            const dx = d * 0.72;
            const dy = d * 0.52;

            // ── Back face (thickness shadow) ──
            c.beginPath();
            c.moveTo(v[0][0] + dx, v[0][1] + dy);
            c.lineTo(v[1][0] + dx, v[1][1] + dy);
            c.lineTo(v[2][0] + dx, v[2][1] + dy);
            c.lineTo(v[3][0] + dx, v[3][1] + dy);
            c.closePath();
            c.fillStyle = `rgba(28,20,90,${0.60})`;
            c.fill();

            // ── Side faces (connecting front to back) ──
            // Bottom side (v3 → v2)
            c.beginPath();
            c.moveTo(v[3][0], v[3][1]);
            c.lineTo(v[2][0], v[2][1]);
            c.lineTo(v[2][0] + dx, v[2][1] + dy);
            c.lineTo(v[3][0] + dx, v[3][1] + dy);
            c.closePath();
            c.fillStyle = `rgba(90,75,200,0.45)`;
            c.fill();
            c.strokeStyle = `rgba(180,168,255,0.30)`;
            c.lineWidth = 0.5;
            c.stroke();

            // Right side (v1 → v2)
            c.beginPath();
            c.moveTo(v[1][0], v[1][1]);
            c.lineTo(v[2][0], v[2][1]);
            c.lineTo(v[2][0] + dx, v[2][1] + dy);
            c.lineTo(v[1][0] + dx, v[1][1] + dy);
            c.closePath();
            c.fillStyle = `rgba(60,50,170,0.38)`;
            c.fill();
            c.strokeStyle = `rgba(160,148,255,0.25)`;
            c.lineWidth = 0.5;
            c.stroke();

            // ── Front glass face ──
            c.beginPath();
            c.moveTo(v[0][0], v[0][1]);
            c.lineTo(v[1][0], v[1][1]);
            c.lineTo(v[2][0], v[2][1]);
            c.lineTo(v[3][0], v[3][1]);
            c.closePath();

            try {
              const grad = c.createLinearGradient(v[0][0], v[0][1], v[2][0], v[2][1]);
              grad.addColorStop(0, shard.colorA);
              grad.addColorStop(0.45, "rgba(255,255,255,0.14)");
              grad.addColorStop(1, shard.colorB);
              c.fillStyle = grad;
            } catch {
              c.fillStyle = shard.colorA;
            }
            c.fill();

            // Front face border
            c.strokeStyle = `rgba(255,255,255,${(0.80).toFixed(3)})`;
            c.lineWidth = 0.9;
            c.stroke();

            // ── Specular glint (top-left edge) ──
            c.beginPath();
            c.moveTo(v[0][0], v[0][1]);
            c.lineTo(v[1][0], v[1][1]);
            c.strokeStyle = `rgba(235,228,255,0.55)`;
            c.lineWidth = 2.5;
            c.stroke();

            // ── Interior reflection streak ──
            const midX = (v[0][0] + v[2][0]) / 2;
            const midY = (v[0][1] + v[2][1]) / 2;
            const refGrad = c.createLinearGradient(v[0][0], v[0][1], midX, midY);
            refGrad.addColorStop(0, "rgba(255,255,255,0.18)");
            refGrad.addColorStop(0.5, "rgba(255,255,255,0.06)");
            refGrad.addColorStop(1, "rgba(255,255,255,0)");
            c.beginPath();
            c.moveTo(v[0][0] + (v[1][0] - v[0][0]) * 0.2, v[0][1] + (v[1][1] - v[0][1]) * 0.2);
            c.lineTo(midX, midY);
            c.strokeStyle = refGrad;
            c.lineWidth = shard.depthSize * 0.5;
            c.stroke();

            c.restore();
          }
        }

        // Navigate while animation plays
        if (t > 160 && !navigated) {
          navigated = true;
          router.push(href);
        }

        if (t < TOTAL) {
          rafRef.current = requestAnimationFrame(frame);
        } else {
          cvs.style.display = "none";
          c.clearRect(0, 0, W, H);
        }
      }

      rafRef.current = requestAnimationFrame(frame);
    };

    window.addEventListener("glass-shatter", onShatter as EventListener);
    return () => {
      window.removeEventListener("glass-shatter", onShatter as EventListener);
      cancelAnimationFrame(rafRef.current);
    };
  }, [router]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ display: "none", zIndex: 9999 }}
      aria-hidden="true"
    />
  );
}
