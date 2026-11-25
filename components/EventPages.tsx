"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useTransform } from "motion/react";
import { gallery, rounds, sessions } from "@/lib/events";
import { EventRow } from "./Club";
import { Portrait } from "./Fields";

export function EventList() {
  const [past, setPast] = useState(false);
  return (
    <>
      <div className="filters" role="group" aria-label="Filter events">
        {[false, true].map((p) => <button key={String(p)} className={`chip ${p === past ? "is-on" : ""}`} aria-pressed={p === past} onClick={() => setPast(p)}>{p ? "Past" : "Upcoming"} {sessions.filter((s) => s.past === p).length}</button>)}
      </div>
      <div className="event-list">{sessions.filter((s) => s.past === past).map((e) => <EventRow key={e.slug} e={e} />)}</div>
    </>
  );
}

function RoundRow({ r, i }: { r: string[]; i: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center 0.6"] });
  const x = useTransform(scrollYProgress, [0, 1], [i % 2 ? 48 : -48, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [0, 1]);
  return <motion.li ref={ref} style={{ opacity }}><motion.h3 style={{ x }}>{r[0]}</motion.h3><p>{r[1]}</p><span>{r[2]}</span></motion.li>;
}

export function VersusPage() {
  const split = useMotionValue(1);
  const edge = useMotionValue(50);
  return (
    <>
      <h1 className="sr">AI vs Human: can humans beat AI?</h1>
      <section className="vs-top">
        <Portrait split={split} leftEdge={edge} rightEdge={edge} />
        {[
          { f: "hand", w: "Human", t: "You bring instinct, humour, taste and a hunch you can't explain.", d: -80 },
          { f: "dots", w: "AI", t: "It brings everything it has ever read, and no idea why a joke is funny.", d: 80 },
        ].map((s) => (
          <div key={s.w}>
            <motion.span className={`vs-word ${s.f}`} aria-hidden="true" initial={{ x: s.d, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", visualDuration: 0.7, bounce: 0.25, delay: 0.35 }}>{s.w}</motion.span>
            <p className="lede">{s.t}</p>
          </div>
        ))}
      </section>
      <section className="wrap vs-rounds">
        <div className="head"><h2>Can humans beat AI?</h2><p>A fun, interactive tech competition where participants challenge AI through rounds of creativity, logical thinking, observation and problem solving.</p></div>
        <ul>{rounds.map((r, i) => <RoundRow key={r[0]} r={r} i={i} />)}</ul>
      </section>
      <section className="vs-end"><div className="wrap">
        <h2>Take its place or take its side</h2>
        <p className="lede">There are more rounds on the day. Date, venue and entry details will be announced soon.</p>
        <div className="btn-row"><Link className="btn" href="/register?event=ai-vs-human">Register</Link><Link className="btn alt" href="/#rounds">Try the rounds</Link></div>
      </div></section>
    </>
  );
}

export function Gallery() {
  const box = useRef<HTMLDialogElement>(null);
  const [i, setI] = useState(0);
  const kinds = ["All", ...new Set(gallery.map((g) => g[2]))];
  const [kind, setKind] = useState("All");
  const shown = gallery.filter((g) => kind === "All" || g[2] === kind);
  const cur = shown[i] ?? shown[0];
  const move = (d: number) => setI((i + d + shown.length) % shown.length);
  return (
    <>
      <div className="filters" role="group" aria-label="Filter photos">{kinds.map((k) => <button key={k} className={`chip ${k === kind ? "is-on" : ""}`} aria-pressed={k === kind} onClick={() => { setKind(k); setI(0); }}>{k}</button>)}</div>
      <div className="gallery">
        {shown.map(([src, title, k], n) => (
          <motion.button key={title} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -5% 0px" }} transition={{ type: "spring", visualDuration: 0.5, bounce: 0.1 }} onClick={() => { setI(n); box.current!.showModal(); }}>
            <div className="shot"><img src={src} alt="" width="1024" height="768" loading="lazy" /></div>
            <strong>{title}</strong><span className="meta">{k}</span>
          </motion.button>
        ))}
      </div>
      <dialog ref={box} className="box" aria-label={cur[1]} onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()} onKeyDown={(e) => { if (e.key === "ArrowRight") move(1); if (e.key === "ArrowLeft") move(-1); }}>
        <img src={cur[0]} alt={cur[1]} width="1024" height="768" />
        <div className="demo-row">
          <strong>{cur[1]}</strong>
          <div className="options">
            {shown.length > 1 && <><button className="chip" onClick={() => move(-1)}>Previous</button><button className="chip" onClick={() => move(1)}>Next</button></>}
            <button className="chip" onClick={() => box.current!.close()}>Close</button>
          </div>
        </div>
      </dialog>
    </>
  );
}
