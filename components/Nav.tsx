"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll } from "motion/react";

const links = [["/#about", "About"], ["/events", "Events"], ["/members", "Team"], ["/gallery", "Gallery"], ["/join", "Join us"], ["/register", "Register"]];

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
  const path = usePathname();
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
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <img src="/DSClogo.png" alt="" width="38" height="40" className="logo" />
          <span>Data Science Club<small>VIT Bhopal</small></span>
        </Link>
        <nav className="nav-links" aria-label="Main">
          {links.map(([h, l]) => <Link key={h} href={h} aria-current={path.startsWith(h) ? "page" : undefined}>{l}</Link>)}
        </nav>
        <div className="nav-end">
          <Link className="nav-cta" href="/events/ai-vs-human">Humans vs AI</Link>
          <ThemeToggle />
          <button className="icon-btn menu-btn" aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
            <svg width="20" height="20" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d={open ? "M4 4l12 12M16 4L4 16" : "M2 7h16M2 13h16"} /></svg>
          </button>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.nav key="menu" className="menu" aria-label="Mobile" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.2 }}>
            {[["/events/ai-vs-human", "Humans vs AI"], ...links, ["/#contact", "Contact"]].map(([h, l]) => <Link key={l} href={h} onClick={() => setOpen(false)}>{l}</Link>)}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
