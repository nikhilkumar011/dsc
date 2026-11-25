"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { teams } from "@/lib/members";

const total = teams.reduce((n, t) => n + t.people.length, 0);

export default function Roster() {
  const [team, setTeam] = useState("Everyone");
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();
  const shown = teams
    .filter((t) => team === "Everyone" || t.team === team)
    .map((t) => ({ ...t, people: t.people.filter(([n]) => n.toLowerCase().includes(needle)) }))
    .filter((t) => t.people.length);
  return (
    <>
      <label className="find">Find someone<input type="search" value={q} onChange={(e) => setQ(e.target.value)} /></label>
      <div className="filters" role="group" aria-label="Filter by team">
        {["Everyone", ...teams.map((t) => t.team)].map((t) => (
          <button key={t} className={`chip ${t === team ? "is-on" : ""}`} aria-pressed={t === team} onClick={() => setTeam(t)}>
            {t} {t === "Everyone" ? total : teams.find((x) => x.team === t)!.people.length}
          </button>
        ))}
      </div>
      <div aria-live="polite">{!shown.length && <p className="lede">No one by that name{team !== "Everyone" ? ` in ${team}. Try Everyone.` : "."}</p>}</div>
      {shown.map((t) => (
        <section key={t.team} className="team-block">
          <h2>{t.team}</h2>
          <ul className={`cards ${t.team === "Panel" ? "big" : ""}`}>
            {t.people.map(([name, role], i) => {
              const parts = name.split(" ");
              const b = parts.length > 1 ? parts[parts.length - 1][0] : name[1];
              return (
                <motion.li key={name + role} className="card" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -6% 0px" }} transition={{ type: "spring", visualDuration: 0.4, bounce: 0.15, delay: (i % 6) * 0.04 }}>
                  <div className="mono" aria-hidden="true"><span>{name[0].toUpperCase()}</span><span>{b.toUpperCase()}</span></div>
                  <strong>{name}</strong>
                  <small>{role}</small>
                </motion.li>
              );
            })}
          </ul>
        </section>
      ))}
    </>
  );
}
