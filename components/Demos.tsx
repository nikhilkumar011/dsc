"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type Report = { onResult: (id: string, won: boolean) => void };

function Hand({ fingers }: { fingers: number }) {
  const gap = 84 / (fingers - 1);
  return (
    <svg viewBox="0 0 200 220" aria-hidden="true">
      <g stroke="currentColor" strokeLinecap="round" fill="none">
        {Array.from({ length: fingers }, (_, i) => {
          const u = i / (fingers - 1) - 0.5;
          return <path key={i} strokeWidth={fingers > 4 ? 16 : 20} d={`M${62 + i * gap} 130 L${62 + i * gap + u * 38} ${40 + Math.abs(u + 0.1) * 60}`} />;
        })}
        <path strokeWidth="21" d="M68 168 L26 124" />
      </g>
      <path fill="currentColor" d="M50 124 Q104 108 158 124 L152 176 Q146 196 134 220 L78 220 Q72 196 54 176 Z" />
    </svg>
  );
}

export function SpotDemo({ onResult }: Report) {
  const [pick, setPick] = useState<number | null>(null);
  return (
    <div className="demo">
      <p className="demo-q">One of these hands is a machine&apos;s mistake. Which?</p>
      <div className="hands">
        {[4, 5].map((f, i) => (
          <motion.button key={f} whileTap={{ scale: 0.97 }} className={pick === null ? "" : i === 1 ? "is-right" : "is-dim"} aria-label={`Hand with ${f} fingers and a thumb`} disabled={pick !== null} onClick={() => { setPick(i); onResult("spot", i === 1); }}>
            <Hand fingers={f} />
          </motion.button>
        ))}
      </div>
      <p className="demo-out" aria-live="polite">{pick === null ? "Tap the fake." : pick === 1 ? "Got it. Four fingers and a thumb is human. That one has an extra." : "Fooled. The other one has an extra finger."}</p>
    </div>
  );
}

const NOTES = [329.6, 329.6, 349.2, 392, 392, 349.2, 329.6, 293.7, 261.6, 261.6, 293.7, 329.6, 329.6, 293.7, 293.7];
const SONGS = ["Für Elise", "Ode to Joy", "Twinkle Twinkle"];

export function SongDemo({ onResult }: Report) {
  const [playing, setPlaying] = useState(false);
  const [note, setNote] = useState(-1);
  const [pick, setPick] = useState<string | null>(null);
  const audio = useRef<AudioContext | null>(null);
  const timers = useRef<number[]>([]);
  const stop = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    audio.current?.close();
    audio.current = null;
    setPlaying(false);
    setNote(-1);
  };
  useEffect(() => () => {
    timers.current.forEach(clearTimeout);
    audio.current?.close();
  }, []);
  const play = () => {
    if (playing) return stop();
    const ctx = new AudioContext();
    audio.current = ctx;
    setPlaying(true);
    NOTES.forEach((f, i) => {
      const at = ctx.currentTime + 0.05 + i * 0.33;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "triangle";
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(0.2, at + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, at + 0.32);
      o.connect(g).connect(ctx.destination);
      o.start(at);
      o.stop(at + 0.33);
      timers.current.push(window.setTimeout(() => setNote(i), 50 + i * 330));
    });
    timers.current.push(window.setTimeout(stop, 400 + NOTES.length * 330));
  };
  return (
    <div className="demo">
      <div className="bars" aria-hidden="true">
        {NOTES.map((f, i) => <motion.i key={i} style={{ height: `${(f - 200) / 2.4}%` }} initial={false} animate={{ scaleY: note === i ? 1.22 : 1, opacity: playing && note < i ? 0.35 : 1 }} transition={{ type: "spring", visualDuration: 0.2, bounce: 0.4 }} />)}
      </div>
      <button className="btn" onClick={play}>{playing ? "Stop" : "Play the tune"}</button>
      <div className="options">
        {SONGS.map((s) => <button key={s} className={`chip ${pick && s === SONGS[1] ? "is-on" : ""}`} disabled={!!pick} onClick={() => { setPick(s); onResult("song", s === SONGS[1]); }}>{s}</button>)}
      </div>
      <p className="demo-out" aria-live="polite">{!pick ? "Name it before the machine does." : pick === SONGS[1] ? "Correct. Beethoven would be proud." : "Not quite. That was Ode to Joy."}</p>
    </div>
  );
}

type Pt = { x: number; y: number };

export function DrawDemo() {
  const mine = useRef<HTMLCanvasElement>(null);
  const theirs = useRef<HTMLCanvasElement>(null);
  const last = useRef<Pt | null>(null);
  const [used, setUsed] = useState(false);
  const pos = (e: React.PointerEvent<HTMLCanvasElement>): Pt => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * 480, y: ((e.clientY - r.top) / r.height) * 480 };
  };
  const line = (a: Pt, b: Pt) => {
    const m = mine.current!.getContext("2d")!, t = theirs.current!.getContext("2d")!;
    m.lineWidth = 9;
    m.lineCap = "round";
    m.strokeStyle = "#16122a";
    m.beginPath();
    m.moveTo(a.x, a.y);
    m.lineTo(b.x, b.y);
    m.stroke();
    t.fillStyle = "#fff";
    const n = Math.max(1, Math.hypot(b.x - a.x, b.y - a.y) / 8);
    for (let i = 0; i <= n; i++) {
      const x = Math.floor((a.x + ((b.x - a.x) * i) / n) / 24) * 24, y = Math.floor((a.y + ((b.y - a.y) * i) / n) / 24) * 24;
      t.fillRect(x + 2, y + 2, 20, 20);
    }
  };
  const clear = () => {
    for (const c of [mine.current!, theirs.current!]) c.getContext("2d")!.clearRect(0, 0, 480, 480);
    setUsed(false);
  };
  return (
    <div className="demo">
      <div className="boards">
        <figure className="board-human">
          <div className="board">
            <canvas ref={mine} width="480" height="480" aria-label="Drawing board"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                last.current = pos(e);
                line(last.current, last.current);
                setUsed(true);
              }}
              onPointerMove={(e) => {
                if (!last.current) return;
                const p = pos(e);
                line(last.current, p);
                last.current = p;
              }}
              onPointerUp={() => { last.current = null; }}
              onPointerCancel={() => { last.current = null; }} />
            {!used && <span className="hint">Draw a cat here</span>}
          </div>
          <figcaption>You</figcaption>
        </figure>
        <figure className="board-ai">
          <div className="board"><canvas ref={theirs} width="480" height="480" aria-hidden="true" /></div>
          <figcaption>The machine</figcaption>
        </figure>
      </div>
      <div className="demo-row">
        <p className="demo-out">{used ? "It copies. You invent." : "Draw with your mouse or finger."}</p>
        <button className="chip" onClick={clear} disabled={!used}>Clear boards</button>
      </div>
    </div>
  );
}

const PROMPT = [["circles", "squares", "stars"], ["one", "a crowd"], ["calm", "chaotic"]];
const SHAPES = ["M0-40A40 40 0 1 1 0 40A40 40 0 1 1 0-40Z", "M-36-36H36V36H-36Z", "M0-48L13-15L48-13L21 9L30 43L0 24L-30 43L-21 9L-48-13L-13-15Z"];

export function PromptDemo() {
  const [c, setC] = useState([2, 1, 1]);
  const n = c[1] ? 16 : 1;
  const wild = c[2];
  const slot = (i: number) => (
    <button onClick={() => setC(c.map((v, j) => (j === i ? (v + 1) % PROMPT[i].length : v)))} aria-label={`Change ${PROMPT[i][c[i]]}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={PROMPT[i][c[i]]} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.12 }}>{PROMPT[i][c[i]]}</motion.span>
      </AnimatePresence>
    </button>
  );
  return (
    <div className="demo">
      <p className="prompt">Draw {slot(0)} as {slot(1)}, make it {slot(2)}</p>
      <svg className="prompt-out" viewBox="0 0 400 240" role="img" aria-label={`${PROMPT[0][c[0]]}, ${PROMPT[1][c[1]]}, ${PROMPT[2][c[2]]}`}>
        {Array.from({ length: n }, (_, i) => {
          const r = (i * 0.618 + 0.21) % 1, r2 = (i * 0.383 + 0.5) % 1;
          const x = n === 1 ? 200 : 50 + (i % 8) * 43 + wild * (r - 0.5) * 60;
          const y = n === 1 ? 120 : 78 + Math.floor(i / 8) * 86 + wild * (r2 - 0.5) * 110;
          return (
            <motion.g key={i} initial={false} animate={{ x, y, rotate: wild ? (r - 0.5) * 220 : 0, scale: n === 1 ? (wild ? 2.1 : 1.6) : wild ? 0.25 + r2 * 0.8 : 0.42 }} transition={{ type: "spring", visualDuration: 0.5, bounce: 0.35 }}>
              <path d={SHAPES[c[0]]} fill={i % 3 === 0 ? "#ff5a2a" : i % 3 === 1 ? "#fff" : "#16122a"} />
            </motion.g>
          );
        })}
      </svg>
      <p className="demo-out">Tap an underlined word to rewrite the prompt.</p>
    </div>
  );
}

const RAPID: { q: string; a: string[]; right: number }[] = [
  { q: "9 × 17", a: ["143", "153", "163"], right: 1 },
  { q: "2, 3, 5, 7, 11, …", a: ["12", "13", "15"], right: 1 },
  { q: "1010 in binary", a: ["10", "8", "12"], right: 0 },
];

export function RapidDemo({ onResult }: Report) {
  const [i, setI] = useState(-1);
  const [score, setScore] = useState(0);
  const done = i >= RAPID.length;
  const next = (ok: boolean) => {
    const s = score + (ok ? 1 : 0);
    setScore(s);
    if (i === RAPID.length - 1) onResult("rapid", s === RAPID.length);
    setI(i + 1);
  };
  const nextRef = useRef(next);
  useEffect(() => {
    nextRef.current = next;
  });
  useEffect(() => {
    if (i < 0 || i >= RAPID.length) return;
    const id = setTimeout(() => nextRef.current(false), 5000);
    return () => clearTimeout(id);
  }, [i]);
  if (i < 0 || done)
    return (
      <div className="demo rapid-start">
        <p className="demo-q" aria-live="polite">{done ? `${score} of ${RAPID.length}. ${score === RAPID.length ? "Flawless." : "The machine got all three."}` : "Three questions. Five seconds each."}</p>
        <button className="btn" onClick={() => { setScore(0); setI(0); }}>{done ? "Go again" : "Start the clock"}</button>
      </div>
    );
  return (
    <div className="demo">
      <div className="clock" aria-hidden="true"><i key={i} /></div>
      <p className="rapid-q" aria-live="polite">{RAPID[i].q}</p>
      <div className="options">{RAPID[i].a.map((o, j) => <button key={o} className="chip" onClick={() => next(j === RAPID[i].right)}>{o}</button>)}</div>
    </div>
  );
}
