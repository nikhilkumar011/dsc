"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { DomainField } from "./Fields";
import { EMAIL, domains, inquiries, schedule, socials, venue } from "@/lib/data";
import { sessions, type Session } from "@/lib/events";
import { teams } from "@/lib/members";

function Word({ p, i, n, children }: { p: MotionValue<number>; i: number; n: number; children: string }) {
  const opacity = useTransform(p, [i / n, (i + 1) / n], [0.14, 1]);
  return <motion.span style={{ opacity }}>{children} </motion.span>;
}

export function About() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = "DSC VIT Bhopal combines intelligence and engineering in a true technological experiment.".split(" ");
  return (
    <section id="about" className="about wrap">
      <h2 ref={ref} className="statement">{words.map((w, i) => <Word key={i} p={scrollYProgress} i={i} n={words.length}>{w}</Word>)}</h2>
      <div className="about-grid">
        <p className="since"><span>2019</span>Established at VIT Bhopal</p>
        <div>
          <p className="lede">The Data Science Club began with a bold mission: to bridge the divide between theoretical textbook algorithms and real-world, production-grade computational software. Today, we stand as a 1,500+ student ecosystem pushing the frontiers of neural networks, high-throughput distributed systems, and open-source technology.</p>
          <dl className="facts">
            <div><dt>Community builders</dt><dd>1,500+</dd></div>
            <div><dt>Labs & sprints hosted</dt><dd>45+</dd></div>
            <div><dt>Bounties & hackathon prizes</dt><dd>₹2.5L+</dd></div>
          </dl>
        </div>
      </div>
    </section>
  );
}

export function Domains() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [i, setI] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setI(Math.min(3, Math.max(0, Math.floor(v * 4)))));
  const go = (k: number) => {
    const el = ref.current!;
    const top = el.getBoundingClientRect().top + scrollY;
    scrollTo({ top: top + ((k + 0.5) / 4) * (el.offsetHeight - innerHeight) });
  };
  const d = domains[i];
  return (
    <section ref={ref} id="domains" className="track domains">
      <div className="pin"><div className="domains-pin wrap">
        <div>
          <h2>Four domains</h2>
          <div className="domain-tabs">
            {domains.map((x, k) => (
              <button key={x.name} aria-current={k === i} onClick={() => go(k)}>
                {k === i && <motion.i layoutId="domain-mark" />}
                {x.name}
              </button>
            ))}
          </div>
          <div className="domain-body">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={d.name} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.18 }}>
                <h3>{d.sub}</h3>
                <p>{d.text}</p>
                <p className="tools">{d.tools.join(", ")}</p>
                <Link className="link" href="/join">Apply to {d.name}</Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <DomainField progress={scrollYProgress} />
      </div></div>
    </section>
  );
}

export function EventRow({ e }: { e: Session }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const clipPath = useTransform(scrollYProgress, [0.05, 0.4], ["inset(0% 45% 0% 45%)", "inset(0% 0% 0% 0%)"]);
  return (
    <article ref={ref} className="event">
      <motion.div className="event-img" style={{ clipPath }}>
        <motion.img src={e.img} alt="" width="1024" height="768" loading="lazy" style={{ y, scale: 1.18 }} />
      </motion.div>
      <div className="event-text">
        <p className="meta">{e.kind}</p>
        <h3>{e.title}</h3>
        <p>{e.text}</p>
        <p className="meta">{e.host}<br />{e.date}, {e.where}</p>
        <Link className="link" href={`/events/${e.slug}`}>View session details</Link>
      </div>
    </article>
  );
}

export function Events() {
  return (
    <section id="events" className="wrap events">
      <div className="head"><h2>Sessions at DSC</h2><p>Flagship bootcamps, 36-hour hackathons, and technical deep-dives.</p></div>
      {sessions.slice(0, 3).map((e) => <EventRow key={e.title} e={e} />)}
      <Schedule />
    </section>
  );
}

export function Schedule({ link = true }: { link?: boolean }) {
  return (
    <>
      <div className="head sched-head"><h2>Tracks & sprints</h2>{link && <Link className="link" href="/events">All events</Link>}</div>
      <ul className="sched">
        {schedule.map(([date, title, who, kind], i) => (
          <motion.li key={title} initial={{ opacity: 0, x: i % 2 ? 60 : -60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-8% 0px" }} transition={{ type: "spring", visualDuration: 0.5, bounce: 0.1 }}>
            <div className="sched-row"><time>{date}</time><strong>{title}</strong><span>{who}</span><span>{kind}</span></div>
          </motion.li>
        ))}
      </ul>
    </>
  );
}

export function Venue() {
  const [i, setI] = useState(0);
  const [, title, main, extra] = venue[i];
  return (
    <section id="visit" className="wrap venue">
      <div className="head"><h2>Getting here</h2><p>Navigation, hardware policies, transit and accommodation for hackathons at VIT Bhopal.</p></div>
      <div className="venue-grid">
        <div className="venue-tabs">
          {venue.map((v, k) => <button key={v[0]} aria-pressed={k === i} onClick={() => setI(k)}>{v[0]}</button>)}
        </div>
        <div className="venue-body" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }} transition={{ duration: 0.18 }}>
              <h3>{title}</h3>
              <p className="lede">{main}</p>
              <p>{extra}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export function Team() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const a = useTransform(scrollYProgress, [0, 1], ["-30%", "0%"]);
  const b = useTransform(scrollYProgress, [0, 1], ["30%", "0%"]);
  return (
    <section ref={ref} id="team" className="team">
      <motion.div className="team-l" style={{ x: a }}>
        <h2>Meet the team</h2>
        <ul>{teams[0].people.map(([n, r]) => <li key={n}><strong>{n}</strong><span>{r}</span></li>)}</ul>
        <Link className="btn" href="/members">See all members</Link>
      </motion.div>
      <motion.div className="team-r" style={{ x: b }}>
        <h2>Join the core team</h2>
        <p className="lede">Ready to shape AI/ML culture at VIT Bhopal? Submit your application for interview rounds across technical development, research, design, and operations.</p>
        <Link className="btn" href="/join">Apply now</Link>
      </motion.div>
    </section>
  );
}

export function Contact() {
  const [kind, setKind] = useState(0);
  const [sent, setSent] = useState(false);
  return (
    <section id="contact" className="wrap contact">
      <div className="head"><h2>Contact us</h2><p>We collaborate with collegiate builders, guest researchers, industry speakers, and community sponsors.</p></div>
      <form className="form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
        <fieldset>
          <legend>What is it about?</legend>
          <div className="options">{inquiries.map((q, k) => <button type="button" key={q} className={`chip ${k === kind ? "is-on" : ""}`} aria-pressed={k === kind} onClick={() => setKind(k)}>{q}</button>)}</div>
        </fieldset>
        <label>Full name<input name="name" required autoComplete="name" /></label>
        <label>Email<input name="email" type="email" required autoComplete="email" /></label>
        <label className="full">Details<textarea name="details" rows={5} required /></label>
        <div className="full demo-row">
          <button className="btn">Send inquiry</button>
          <p aria-live="polite">{sent && <>This form isn&apos;t connected yet. Please email <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</>}</p>
        </div>
      </form>
    </section>
  );
}

const here = [["/#about", "About"], ["/#domains", "Domains"], ["/#visit", "Campus logistics"], ["/#contact", "Contact"]];
const pages = [["/events", "Events"], ["/register", "Register"], ["/members", "Team"], ["/join", "Join us"], ["/gallery", "Gallery"]];

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <img src="/DSClogo.png" alt="DSC logo" width="76" height="80" className="logo" />
          <p>Official Data Science Club of VIT Bhopal University.</p>
          <p><a href={`mailto:${EMAIL}`}>{EMAIL}</a><br />Bhopal-Indore Highway, Kothri Kalan, Sehore, MP 466114</p>
        </div>
        <nav aria-label="Footer">{here.map(([h, l]) => <Link key={l} href={h}>{l}</Link>)}</nav>
        <nav aria-label="Club pages">{pages.map(([h, l]) => <Link key={l} href={h}>{l}</Link>)}</nav>
        <nav aria-label="Social">{socials.map(([l, h]) => <a key={l} href={h}>{l}</a>)}</nav>
      </div>
      <p className="wrap fine">© 2026 Data Science Club VIT Bhopal. All rights reserved.</p>
    </footer>
  );
}
