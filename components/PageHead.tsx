"use client";
import { useRef } from "react";
import { useScroll } from "motion/react";
import { useCanvas } from "./Fields";

type Dot = { x: number; y: number; ox: number; oy: number; a: number; delay: number };

export default function PageHead({ word, children }: { word: string; children: React.ReactNode }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: box, offset: ["start start", "end start"] });
  const mouse = useRef({ x: -999, y: -999, f: 0, on: false });

  useCanvas(ref, () => {
    let dots: Dot[] = [], builtW = 0, builtH = 0, cell = 8, ready = false, start = -1;
    const family = getComputedStyle(document.documentElement).getPropertyValue("--f-display");
    document.fonts.load(`800 100px ${family}`, word).finally(() => { ready = true; });

    const build = (w: number, h: number) => {
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const c = off.getContext("2d", { willReadFrequently: true })!;
      const gut = Math.min(64, Math.max(16, w * 0.04));
      let size = 200;
      c.font = `800 ${size}px ${family}`;
      size = Math.min((size * (w - gut * 2)) / c.measureText(word).width, h * 0.92);
      c.font = `800 ${size}px ${family}`;
      c.textBaseline = "middle";
      c.fillText(word, gut, h * 0.54);
      const data = c.getImageData(0, 0, w, h).data;
      cell = Math.max(3.5, size / 34);
      dots = [];
      for (let y = cell / 2; y < h; y += cell)
        for (let x = cell / 2; x < w; x += cell)
          if (data[(Math.floor(y) * w + Math.floor(x)) * 4 + 3] > 120)
            dots.push({ x, y, ox: (Math.random() - 0.5) * w * 0.7, oy: (Math.random() - 0.5) * h * 1.6, a: Math.sin(x * 0.012 + y * 0.02) * 0.8 + 0.6 + (Math.random() - 0.5) * 0.5, delay: Math.random() * 0.35 });
      builtW = w;
      builtH = h;
    };

    return (ctx, w, h, t, colors, still) => {
      if (!ready || !w || !h) return;
      if (w !== builtW || h !== builtH) build(w, h);
      if (start < 0) start = t;
      const m = mouse.current;
      m.f += ((m.on && !still ? 1 : 0) - m.f) * 0.1;
      const out = still ? 0 : Math.pow(scrollYProgress.get(), 1.6) * 0.8;
      let maxX = 0, minX = w;
      for (let i = 0; i < dots.length; i++) {
        if (dots[i].x > maxX) maxX = dots[i].x;
        if (dots[i].x < minX) minX = dots[i].x;
      }
      const mid = (minX + maxX) / 2;
      const r = Math.max(70, w * 0.07);
      const pen = new Path2D(), pix = new Path2D();
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const raw = still ? 1 : Math.min(1, Math.max(0, (t - start - 0.15 - d.delay) / 0.9));
        const k = 1 - Math.pow(1 - raw, 4);
        let x = d.x + d.ox * (1 - k + out), y = d.y + d.oy * (1 - k + out);
        const dx = x - m.x, dy = y - m.y, dist = Math.hypot(dx, dy);
        if (dist < r && dist > 0) {
          const push = ((1 - dist / r) * r * 0.6 * m.f) / dist;
          x += dx * push;
          y += dy * push;
        }
        if (d.x < mid) {
          const a = d.a + (still ? 0 : Math.sin(t * 1.3 + d.x * 0.02) * 0.12);
          const lx = Math.cos(a) * cell * 0.62, ly = Math.sin(a) * cell * 0.62;
          pen.moveTo(x - lx, y - ly);
          pen.lineTo(x + lx, y + ly);
        } else pix.rect(x - cell * 0.4, y - cell * 0.4, cell * 0.8, cell * 0.8);
      }
      ctx.lineCap = "round";
      ctx.lineWidth = cell * 0.5;
      ctx.strokeStyle = colors.human;
      ctx.stroke(pen);
      ctx.fillStyle = colors.ai;
      ctx.fill(pix);
    };
  });

  return (
    <div ref={box} className="page-head">
      <h1 className="sr">{word}</h1>
      <canvas ref={ref} className="word" aria-hidden="true"
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const b = e.currentTarget.getBoundingClientRect();
          mouse.current.x = e.clientX - b.left;
          mouse.current.y = e.clientY - b.top;
          mouse.current.on = true;
        }}
        onPointerLeave={() => { mouse.current.on = false; }} />
      <div className="wrap"><p className="lede">{children}</p></div>
    </div>
  );
}
