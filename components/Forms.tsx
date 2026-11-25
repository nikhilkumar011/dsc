"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EMAIL } from "@/lib/data";
import { branches, desk, openTeams, schools, years } from "@/lib/events";

function Select({ label, options, required = true }: { label: string; options: string[]; required?: boolean }) {
  return (
    <label>{label}
      <select name={label} required={required} defaultValue="">
        <option value="" disabled={required}>{required ? "Select" : "None"}</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}

function Identity({ extra }: { extra?: React.ReactNode }) {
  return (
    <>
      <label>Full name<input name="name" required autoComplete="name" /></label>
      <label>Registration / roll no.<input name="roll" required /></label>
      <label>University email<input name="email" type="email" required autoComplete="email" /></label>
      <label>Phone / WhatsApp<input name="phone" type="tel" required autoComplete="tel" /></label>
      <Select label="Branch / degree" options={branches} />
      <Select label="Academic year" options={years} />
      {extra}
    </>
  );
}

function Submit({ label, sent }: { label: string; sent: boolean }) {
  return (
    <div className="full demo-row">
      <button className="btn">{label}</button>
      <p role="status">{sent && <>This form isn&apos;t connected yet, so nothing was sent. Please email <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</>}</p>
    </div>
  );
}

export function RegisterDesk() {
  const params = useSearchParams();
  const [slug, setSlug] = useState(() => desk.find((d) => d.slug === params.get("event"))?.slug ?? desk[0].slug);
  const [group, setGroup] = useState(false);
  const [mates, setMates] = useState<number[]>([1]);
  const [sent, setSent] = useState(false);
  const e = desk.find((d) => d.slug === slug)!;
  return (
    <>
      <div className="picker" role="group" aria-label="Choose an event">
        {desk.map((d) => (
          <button key={d.slug} aria-pressed={d.slug === slug} onClick={() => { setSlug(d.slug); setSent(false); }}>
            <strong>{d.title}</strong><span>{d.open ? d.tag : "Closed"}</span>
          </button>
        ))}
      </div>
      <div className="split">
        <aside className="aside">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={slug} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
              <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", marginBottom: 24 }}>{e.title}</h2>
              <dl className="specs">
                <div><dt>Type</dt><dd>{e.tag}</dd></div>
                <div><dt>When</dt><dd>{e.when}</dd></div>
                <div><dt>Where</dt><dd>{e.where}</dd></div>
                <div><dt>Entry</dt><dd>{e.fee}</dd></div>
              </dl>
              <Link className="link" href={`/events/${slug}`}>About this event</Link>
            </motion.div>
          </AnimatePresence>
        </aside>
        {!e.open ? (
          <div className="closed">
            <h2>Registration is closed</h2>
            <p className="lede">The deadline for {e.title} has passed.</p>
            <button className="btn" onClick={() => setSlug(desk[0].slug)}>Take on the AI instead</button>
          </div>
        ) : (
          <form className="form" onSubmit={(ev) => { ev.preventDefault(); setSent(true); }}>
            <div className="set">
              <h3>How are you entering?</h3>
              <div className="full options">
                <button type="button" className={`chip ${group ? "" : "is-on"}`} aria-pressed={!group} onClick={() => setGroup(false)}>On my own</button>
                <button type="button" className={`chip ${group ? "is-on" : ""}`} aria-pressed={group} onClick={() => setGroup(true)}>As a team</button>
              </div>
            </div>
            {group && (
              <div className="set">
                <h3>Your team</h3>
                <label className="full">Team name<input name="team" required /></label>
                {mates.map((id, i) => (
                  <div key={id} className="member">
                    <label>Member {i + 2} name<input name={`mate-${id}`} required /></label>
                    <label>Member {i + 2} roll no.<input name={`mate-roll-${id}`} required /></label>
                    <button type="button" className="chip" disabled={mates.length === 1} onClick={() => setMates(mates.filter((x) => x !== id))} aria-label={`Remove member ${i + 2}`}>Remove</button>
                  </div>
                ))}
                <div className="full"><button type="button" className="chip" disabled={mates.length >= 3} onClick={() => setMates([...mates, Math.max(...mates) + 1])}>Add a member</button></div>
              </div>
            )}
            <div className="set">
              <h3>{group ? "Team leader" : "About you"}</h3>
              <Identity extra={<><Select label="School / department" options={schools} required={false} /><Select label="Residence" options={["Hosteller", "Day scholar"]} /></>} />
            </div>
            <Submit label="Register" sent={sent} />
          </form>
        )}
      </div>
    </>
  );
}

export function JoinForm() {
  const [i, setI] = useState(0);
  const [sent, setSent] = useState(false);
  const t = openTeams[i];
  return (
    <>
      <div className="picker five" role="group" aria-label="Choose your first-choice team">
        {openTeams.map((x, k) => <button key={x.name} aria-pressed={k === i} onClick={() => setI(k)}><strong>{x.name}</strong></button>)}
      </div>
      <div className="split">
        <aside className="aside">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={t.name} style={{ display: "grid", gap: 16 }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
              <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)" }}>{t.name}</h2>
              <p className="lede">{t.short}</p>
              <p>{t.text}</p>
              <p className="tools">{t.tools}</p>
            </motion.div>
          </AnimatePresence>
        </aside>
        <form className="form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <div className="set"><h3>About you</h3><Identity /></div>
          <div className="set">
            <h3>Your teams</h3>
            <label>First choice
              <select value={t.name} onChange={(e) => setI(openTeams.findIndex((x) => x.name === e.target.value))}>{openTeams.map((x) => <option key={x.name}>{x.name}</option>)}</select>
            </label>
            <Select key={t.name} label="Second choice (optional)" options={openTeams.filter((x) => x.name !== t.name).map((x) => x.name)} required={false} />
          </div>
          <div className="set" key={t.name}>
            <h3>{t.name} questions</h3>
            {t.qs.map((q) => (
              <label key={q.label} className="full">{q.label}{q.long ? <textarea name={q.label} rows={4} required={q.required} /> : <input name={q.label} type="url" placeholder="https://" required={q.required} />}</label>
            ))}
          </div>
          <div className="set">
            <h3>Why you</h3>
            <label className="full">Why do you want to join the Data Science Club?<textarea name="why" rows={4} required /></label>
            <label>GitHub (optional)<input name="github" type="url" placeholder="https://" /></label>
            <label>LinkedIn (optional)<input name="linkedin" type="url" placeholder="https://" /></label>
            <label>Portfolio (optional)<input name="portfolio" type="url" placeholder="https://" /></label>
            <label>Resume PDF (optional, max 5MB)<input name="resume" type="file" accept="application/pdf" /></label>
          </div>
          <Submit label="Submit application" sent={sent} />
        </form>
      </div>
    </>
  );
}
