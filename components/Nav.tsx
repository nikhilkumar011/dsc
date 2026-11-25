"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll } from "motion/react";
import { SITE } from "@/lib/data";

const links = [["#about", "About"], ["#domains", "Domains"], ["#events", "Events"], ["#team", "Team"], ["#contact", "Contact"]];

function ThemeToggle() {
  const flip = () => {
    const root = document.documentElement;
    const apply = () => {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch {}
    };
    if ("startViewTransition" in document && !matchMedia("(prefers-reduced-motion: reduce)").matches) document.startViewTransition(apply);
    else apply();
  };
  return (
    <button className="icon-btn" onClick={flip} aria-label="Switch between light and dark theme">
      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M10 2a8 8 0 0 1 0 16z" fill="currentColor" />
      </svg>
    </button>
  );
}

export default function Nav() {
  const { scrollYProgress } = useScroll();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    addEventListener("keydown", esc);
    return () => {
      document.body.style.overflow = "";
      removeEventListener("keydown", esc);
    };
  }, [open]);
  return (
    <>
      <div className="tug" aria-hidden="true">
        <motion.i style={{ scaleX: scrollYProgress }} />
        <motion.i style={{ scaleX: scrollYProgress }} />
      </div>
      <header className="nav">
        <a href="#top" className="brand" onClick={() => setOpen(false)}>
          <img src="/DSClogo.png" alt="" width="38" height="40" className="logo" />
          <span>Data Science Club<small>VIT Bhopal</small></span>
        </a>
        <nav className="nav-links" aria-label="Main">
          {links.map(([h, l]) => <a key={h} href={h}>{l}</a>)}
        </nav>
        <div className="nav-end">
          <a className="nav-cta" href="#rounds">Humans vs AI</a>
          <ThemeToggle />
          <button className="icon-btn menu-btn" aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
            <svg width="20" height="20" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d={open ? "M4 4l12 12M16 4L4 16" : "M2 7h16M2 13h16"} /></svg>
          </button>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.nav key="menu" className="menu" aria-label="Mobile" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.2 }}>
            {[["#rounds", "Humans vs AI"], ...links, [`${SITE}/register`, "Register"], [`${SITE}/join`, "Join us"]].map(([h, l]) => <a key={l} href={h} onClick={() => setOpen(false)}>{l}</a>)}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
