const ell = (x: number, y: number, z: number, a: number, b: number, c: number) => {
  const k0 = Math.hypot(x / a, y / b, z / c);
  const k1 = Math.hypot(x / (a * a), y / (b * b), z / (c * c)) || 1e-6;
  return (k0 * (k0 - 1)) / k1;
};
const smin = (a: number, b: number, k: number) => {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
};

function head(px: number, y: number, z: number) {
  const x = Math.abs(px);
  let d = ell(x, y - 0.28, z, 0.52, 0.56, 0.6);
  d = smin(d, ell(x, y + 0.16, z - 0.12, 0.41, 0.56, 0.46), 0.14);
  d = smin(d, ell(x, y + 0.6, z - 0.34, 0.15, 0.13, 0.14), 0.16);
  d = smin(d, ell(x - 0.27, y + 0.1, z - 0.38, 0.14, 0.12, 0.14), 0.12);
  d = smin(d, ell(x, y + 0.95, z + 0.12, 0.25, 0.6, 0.25), 0.1);
  d = smin(d, ell(x, y + 1.5, z + 0.15, 0.82, 0.42, 0.36), 0.2);
  d = smin(d, ell(x - 0.18, y - 0.17, z - 0.5, 0.18, 0.05, 0.1), 0.1);
  d = -smin(-d, ell(x - 0.2, y - 0.04, z - 0.64, 0.14, 0.1, 0.15), 0.08);
  d = smin(d, ell(x - 0.2, y - 0.03, z - 0.45, 0.105, 0.075, 0.1), 0.02);
  d = smin(d, ell(x, y + 0.06, z - 0.57, 0.06, 0.2, 0.12), 0.08);
  d = smin(d, ell(x, y + 0.2, z - 0.65, 0.08, 0.07, 0.09), 0.06);
  d = smin(d, ell(x - 0.085, y + 0.22, z - 0.58, 0.05, 0.045, 0.06), 0.04);
  d = smin(d, ell(x, y + 0.375, z - 0.54, 0.15, 0.03, 0.07), 0.03);
  d = smin(d, ell(x, y + 0.45, z - 0.53, 0.12, 0.04, 0.07), 0.04);
  return smin(d, ell(x - 0.53, y - 0.02, z, 0.06, 0.17, 0.1), 0.05);
}

export type Mark = { x: number; y: number; z: number; lit: number; fade: number; angle: number; ox: number; oy: number; delay: number };

function probe(x: number, y: number): Mark | null {
  let z = 1.2;
  let hit = false;
  for (let i = 0; i < 48; i++) {
    const d = head(x, y, z);
    if (d < 0.004) {
      hit = true;
      break;
    }
    z -= d * 0.85;
    if (z < -0.9) break;
  }
  if (!hit) return null;
  const e = 0.012;
  const nx = head(x + e, y, z) - head(x - e, y, z);
  const ny = head(x, y + e, z) - head(x, y - e, z);
  const nz = head(x, y, z + e) - head(x, y, z - e);
  const l = Math.hypot(nx, ny, nz) || 1;
  return {
    x, y, z,
    lit: Math.min(1, Math.max(0, (Math.abs(nx) * -0.22 + ny * 0.52 + nz * 0.83) / l)),
    fade: Math.min(1, Math.max(0, (y + 1.4) / 0.35)),
    angle: Math.atan2(nx, -ny) + 0.5,
    ox: (Math.random() - 0.5) * 4,
    oy: (Math.random() - 0.5) * 3,
    delay: Math.random() * 0.5,
  };
}

export function portrait(step: number) {
  const human: Mark[] = [];
  const machine: Mark[] = [];
  for (let y = -1.38; y < 0.9; y += step) {
    for (let x = step / 2; x < 0.86; x += step) {
      const m = probe(x, y);
      if (m) machine.push(m);
    }
  }
  const fine = step * 0.8;
  for (let y = -1.38; y < 0.9; y += fine) {
    for (let x = fine / 2; x < 0.86; x += fine) {
      const h = probe(-x + (Math.random() - 0.5) * fine, y + (Math.random() - 0.5) * fine);
      if (h && h.x < 0) human.push(h);
    }
  }
  return { human, machine };
}

export function domainShapes(n: number): Float32Array[] {
  const shape = (f: (i: number) => [number, number]) => {
    const a = new Float32Array(n * 2);
    for (let i = 0; i < n; i++) {
      const [x, y] = f(i);
      a[i * 2] = x;
      a[i * 2 + 1] = y;
    }
    return a;
  };
  const r = Math.random;
  const layers = [4, 7, 7, 3].map((c, l) => Array.from({ length: c }, (_, i) => [-0.9 + l * 0.6, (i - (c - 1) / 2) * 0.22] as const));
  const nodes = layers.flat();
  const ml = shape((i) => {
    if (i % 3) {
      const c = nodes[i % nodes.length], a = r() * 6.28, q = Math.sqrt(r()) * 0.07;
      return [c[0] + Math.cos(a) * q, c[1] + Math.sin(a) * q];
    }
    const l = (r() * 3) | 0, a = layers[l][(r() * layers[l].length) | 0], b = layers[l + 1][(r() * layers[l + 1].length) | 0], t = r();
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  });
  const de = shape((i) => {
    const k = (i >> 1) % 6, x = r() * 2 - 1, s = 1 / (1 + Math.exp(-x * 7)), from = (k - 2.5) * 0.27, to = ((k % 2) - 0.5) * 0.32;
    return [x, from + (to - from) * s + (r() - 0.5) * 0.06];
  });
  const boxes = [[-0.95, -0.7, 1.9, 1.4], [-0.95, -0.7, 1.9, 0.18], [-0.83, -0.4, 0.4, 0.98], [-0.3, -0.4, 1.12, 0.46], [-0.3, 0.18, 0.5, 0.4], [0.32, 0.18, 0.5, 0.4]];
  const dev = shape(() => {
    let t = r() * boxes.reduce((s, b) => s + 2 * (b[2] + b[3]), 0);
    for (const [x, y, w, h] of boxes) {
      if (t > 2 * (w + h)) {
        t -= 2 * (w + h);
        continue;
      }
      if (t < w) return [x + t, y];
      if ((t -= w) < h) return [x + w, y + t];
      if ((t -= h) < w) return [x + t, y + h];
      return [x, y + t - w];
    }
    return [0, 0];
  });
  const ad = shape((i) => {
    if (i % 5 === 0) {
      const q = r() * 2 - 1;
      return [q, 0.7 - Math.exp(-q * q * 5) * 1.42 - 0.03];
    }
    let x = 0, y = 2;
    for (let k = 0; k < 40 && y > Math.exp(-x * x * 5) * 1.35; k++) {
      x = Math.round((r() * 2 - 1) * 12) / 12;
      y = r() * 1.35;
    }
    return [x * 0.96 + (r() - 0.5) * 0.045, 0.7 - Math.floor(Math.min(y, 1.35) * 24) / 24];
  });
  return [ml, de, dev, ad];
}
