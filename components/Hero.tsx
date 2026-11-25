"use client";
import { useRef } from "react";
import { motion, useMotionTemplate, useScroll, useTransform } from "motion/react";
import { Portrait } from "./Fields";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const textOut = useTransform(p, [0.04, 0.2], [1, 0]);
  const footVisibility = useTransform(p, [0, 0.19, 0.2], ["visible", "visible", "hidden"]);
  const leftX = useTransform(p, [0.04, 0.24], ["0vw", "-18vw"]);
  const rightX = useTransform(p, [0.04, 0.24], ["0vw", "18vw"]);
  const leftEdge = useTransform(p, [0.14, 0.36, 0.5, 0.62, 0.74], [0, 50, 57, 43, 50]);
  const rightEdge = useTransform(p, [0.14, 0.36, 0.5, 0.62, 0.74], [100, 50, 57, 43, 50]);
  const humanX = useMotionTemplate`calc(${leftEdge}vw - 100%)`;
  const aiX = useMotionTemplate`${rightEdge}vw`;
  const split = useTransform(p, [0.12, 0.36], [0, 1]);
  const names = useTransform(p, [0.3, 0.42], [0, 1]);
  const nameY = useTransform(p, [0.3, 0.42], [80, 0]);
  const brief = useTransform(p, [0.62, 0.64], [0, 1]);
  const briefY = useTransform(p, [0.62, 0.78], ["100%", "0%"]);

  return (
    <section ref={ref} id="top" className="track hero">
      <div className="pin">
        <motion.div className="flood flood-human" style={{ x: humanX }} />
        <motion.div className="flood flood-ai" style={{ x: aiX }} />
        <Portrait split={split} leftEdge={leftEdge} rightEdge={rightEdge} />
        <h1 className="hero-type">
          <motion.span className="h-human" style={{ opacity: textOut, x: leftX }}>Can humans</motion.span>{" "}
          <motion.span className="h-ai" style={{ opacity: textOut, x: rightX }}>beat AI?</motion.span>
        </h1>
        <motion.div className="hero-foot" style={{ opacity: textOut, visibility: footVisibility }}>
          <p>The next event from the Data Science Club of VIT Bhopal. A fun, interactive tech competition, and you are the challenger.</p>
          <a className="btn" href="#rounds">Try the rounds</a>
        </motion.div>
        <div className="versus" aria-hidden="true">
          <motion.span className="v-human" style={{ opacity: names, y: nameY }}>Human</motion.span>
          <motion.span className="v-ai" style={{ opacity: names, y: nameY }}>AI</motion.span>
        </div>
        <motion.div className="brief" style={{ opacity: brief, y: briefY }}>
          <p>Challenge AI through rounds of <b>creativity</b>, <b>logical thinking</b>, <b>observation</b> and <b>problem solving</b>.</p>
        </motion.div>
      </div>
    </section>
  );
}
