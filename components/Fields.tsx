"use client";
import { useEffect, useRef } from "react";
import type { MotionValue } from "motion/react";
import { domainShapes, portrait } from "@/lib/portrait";

type Colors = { human: string; ai: string; dark: boolean };
type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, c: Colors, still: boolean) => void;

export const readColors = (): Colors => {
  const c = getComputedStyle(document.documentElement);
  return { human: c.getPropertyValue("--human").trim(), ai: c.getPropertyValue("--ai-mark").trim(), dark: document.documentElement.dataset.theme === "dark" };
};

export function useCanvas(ref: React.RefObject<HTMLCanvasElement | null>, setup: () => Draw) {
  useEffect(() => {
    const el = ref.current!;
    const ctx = el.getContext("2d")!;
    const draw = setup();
    let w = 0, h = 0, raf = 0, visible = false, colors = readColors();
    const start = performance.now();
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const size = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      w = el.clientWidth;
      h = el.clientHeight;
      el.width = w * dpr;
      el.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const loop = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      draw(ctx, w, h, (now - start) / 1000, colors, mq.matches);
      raf = visible ? requestAnimationFrame(loop) : 0;
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });
    const ro = new ResizeObserver(size);
    const mo = new MutationObserver(() => {
      colors = readColors();
    });
    size();
    io.observe(el);
    ro.observe(el);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => {
      visible = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export function Portrait({ split, leftEdge, rightEdge }: Record<"split" | "leftEdge" | "rightEdge", MotionValue<number>>) {
  const ref = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0, y: 0, sx: 0, sy: 0 });
  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.current.x = e.clientX / innerWidth - 0.5;
      pointer.current.y = e.clientY / innerHeight - 0.5;
    };
    addEventListener("pointermove", move);
    return () => removeEventListener("pointermove", move);
  }, []);
  useCanvas(ref, () => {
    const step = innerWidth < 760 ? 0.042 : 0.03;
    const { human, machine } = portrait(step);
    return (ctx, w, h, t, c, still) => {
      const p = pointer.current;
      p.sx += (p.x - p.sx) * 0.07;
      p.sy += (p.y - p.sy) * 0.07;
      const mx = still ? 0 : p.sx, my = still ? 0 : p.sy;
      const fixed = split.get() === 1 && leftEdge.get() === 50 && rightEdge.get() === 50;
      const q = still && !fixed ? 0 : split.get();
      const small = w < 760;
      const s = small ? Math.min(h * 0.235, w * 0.5) : Math.min(h * 0.43, w * 0.31);
      const cx = w / 2, cy = small ? h * 0.33 : h * (0.49 - q * 0.03);
      const shift = q * (w / 4 - s * 0.05);
      const crop = small ? 1 : q;
      for (let side = 0; side < 2; side++) {
        const list = side ? machine : human;
        const dx = side ? shift - q * s * 0.3 : -shift + q * s * 0.3;
        const edge = ((side ? rightEdge : leftEdge).get() / 100) * w;
        const path = new Path2D();
        for (let i = 0; i < list.length; i++) {
          const m = list[i];
          const raw = still ? 1 : Math.min(1, Math.max(0, (t - m.delay) / 1.3));
          const k = 1 - Math.pow(1 - raw, 4);
          const l = Math.min(1, Math.max(0, (m.lit - 0.3) / 0.66));
          const dim = 1 - crop * Math.min(1, Math.max(0, (-0.5 - m.y) / 0.3));
          const fx = cx + dx + m.x * s;
          const flooded = (!still || fixed) && (side ? fx > edge : fx < edge);
          const bright = flooded ? side : c.dark ? 1 : 0;
          const tone = (bright * Math.pow(l, 1.4) + (1 - bright) * (0.1 + Math.pow(1 - l, 0.85) * 0.9)) * m.fade * k * dim;
          if (tone < (side ? 0.06 : 0.12 + m.delay * 0.9)) continue;
          const x = cx + dx + (m.x + m.z * mx * 0.28 + m.ox * (1 - k)) * s;
          const y = cy - (m.y - m.z * my * 0.16 + m.oy * (1 - k)) * s;
          if (side) {
            const z = step * s * (0.2 + tone * 0.85);
            path.rect(x - z / 2, y - z / 2, z, z);
          } else {
            const len = step * s * (0.25 + tone * 1.5);
            const a = m.angle + (still ? 0 : Math.sin(t * 1.4 + m.y * 5) * 0.06);
            const lx = Math.cos(a) * len * 0.5, ly = Math.sin(a) * len * 0.5;
            path.moveTo(x - lx, y - ly);
            path.lineTo(x + lx, y + ly);
          }
        }
        if (side) {
          ctx.fillStyle = c.ai;
          ctx.fill(path);
        } else {
          ctx.lineCap = "round";
          ctx.lineWidth = step * s * 0.36;
          ctx.strokeStyle = c.human;
          ctx.stroke(path);
        }
        if (still && !fixed) continue;
        if (side ? edge >= w : edge <= 0) continue;
        ctx.save();
        ctx.beginPath();
        ctx.rect(side ? edge : 0, 0, side ? w - edge : edge, h);
        ctx.clip();
        if (side) {
          ctx.fillStyle = "#fff";
          ctx.fill(path);
        } else {
          ctx.strokeStyle = "#16122a";
          ctx.stroke(path);
        }
        ctx.restore();
      }
    };
  });
  return <canvas ref={ref} className="portrait" role="img" aria-label="A face drawn half in pen strokes and half in pixels" />;
}

export function DomainField({ progress }: { progress: MotionValue<number> }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useCanvas(ref, () => {
    const n = innerWidth < 760 ? 900 : 1600;
    const shapes = domainShapes(n);
    const seed = Float32Array.from({ length: n }, Math.random);
    return (ctx, w, h, t, c, still) => {
      const p = Math.min(2.999, Math.max(0, progress.get() * 4 - 0.5));
      const a = Math.floor(p), f = p - a;
      const s = Math.min(w / 2.15, h / 1.7);
      const from = shapes[a], to = shapes[a + 1];
      for (let side = 0; side < 2; side++) {
        ctx.beginPath();
        for (let i = side; i < n; i += 2) {
          const local = Math.min(1, Math.max(0, (f - 0.25 - seed[i] * 0.2) / 0.3));
          const k = local * local * (3 - 2 * local);
          const arc = Math.sin(k * Math.PI) * 0.35 * (seed[i] - 0.5);
          const d = still ? 0 : Math.sin(t * 1.1 + seed[i] * 40) * 0.006;
          const x = w / 2 + (from[i * 2] + (to[i * 2] - from[i * 2]) * k + arc + d) * s;
          const y = h / 2 + (from[i * 2 + 1] + (to[i * 2 + 1] - from[i * 2 + 1]) * k + arc * 1.4 + d) * s;
          const z = Math.max(1.5, s * 0.0085);
          if (side) ctx.rect(x - z, y - z, z * 2, z * 2);
          else {
            ctx.moveTo(x + z * 1.1, y);
            ctx.arc(x, y, z * 1.1, 0, 6.29);
          }
        }
        ctx.fillStyle = side ? c.ai : c.human;
        ctx.fill();
      }
    };
  });
  return <canvas ref={ref} className="domain-canvas" aria-hidden="true" />;
}
