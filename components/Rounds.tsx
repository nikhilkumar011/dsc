"use client";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { fest } from "@/lib/events";
import { DrawDemo, PromptDemo, RapidDemo, SongDemo, SpotDemo } from "./Demos";

function Round({ tone, skill, title, text, children }: { tone: string; skill: string; title: string; text: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const x = useTransform(scrollYProgress, [0.2, 0.9], ["16%", "0%"]);
  const rotate = useTransform(scrollYProgress, [0.2, 0.9], [4, 0]);
  return (
    <div className="round-slot">
      <div ref={ref} className="round-mark" />
      <article className={`round ${tone}`}>
        <div className="round-text">
          <p className="skill">{skill}</p>
          <h3>{title}</h3>
          <p>{text}</p>
        </div>
        <motion.div className="round-demo" style={{ x, rotate }}>{children}</motion.div>
      </article>
    </div>
  );
}

export default function Rounds() {
  const [results, setResults] = useState<Record<string, boolean>>({});
  const onResult = (id: string, won: boolean) => setResults((r) => ({ ...r, [id]: won }));
  const all = Object.values(results);
  const you = all.filter(Boolean).length;
  const ai = all.length - you;
  return (
    <section id="rounds" className="rounds">
      <div className="wrap rounds-intro">
        <h2>Warm up before you face it</h2>
        <p className="lede">A taste of the rounds. Everything here is playable, right on the page.</p>
      </div>
      <Round tone="t-human" skill="Observation" title="Real or generated" text="Identify the AI-generated image before it fools you. The tell is always there.">
        <SpotDemo onResult={onResult} />
      </Round>
      <Round tone="t-ink" skill="Memory" title="Guess the song" text="A few notes, no lyrics. Your ear against its index.">
        <SongDemo onResult={onResult} />
      </Round>
      <Round tone="t-ai" skill="Creativity" title="Drawing battle" text="You draw it by hand. It answers in pixels. Who drew it better?">
        <DrawDemo />
      </Round>
      <Round tone="t-ink" skill="Problem solving" title="Prompt engineering" text="The machine does what you say. Find the words that make it do what you mean.">
        <PromptDemo />
      </Round>
      <Round tone="t-human" skill="Logical thinking" title="Rapid fire" text="No time to look it up. Answer faster than you can doubt yourself.">
        <RapidDemo onResult={onResult} />
      </Round>
      <div className="final">
        <div className="score" role="group" aria-label="Warm-up score">
          <span className="s-you"><b>{you}</b>You</span>
          <span className="s-ai"><b>{ai}</b>AI</span>
        </div>
        <div className="wrap final-text">
          <h2>{all.length === 0 ? "Who takes it?" : you > ai ? "Humans lead." : you < ai ? "The machine leads." : "Dead even."}</h2>
          <p className="lede">Settle it at {fest.name}, {fest.dates}, VIT Bhopal. There are more rounds at the event.</p>
          <Link className="btn" href="/events/ai-vs-human">See the event</Link>
        </div>
      </div>
    </section>
  );
}
