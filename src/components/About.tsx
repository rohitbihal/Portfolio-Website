"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { logStore } from "@/lib/logStore";

/* ──────────────────────────────────────────────
   Typewriter hook – reveals text char by char
   once the element enters the viewport.
────────────────────────────────────────────── */
function useTypewriter(text: string, active: boolean, speed = 18) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!active) return;
    setDisplayed("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, active, speed]);

  return displayed;
}

/* ──────────────────────────────────────────────
   Single stat / badge pill
────────────────────────────────────────────── */
const badgeVariant = {
  hidden: { opacity: 0, y: 8, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      className="inline-block px-3 py-1 text-xs text-[#4a9eff] border border-[#1e3a8a]/50 bg-[#0a1a2f]/50 rounded-none tracking-wider"
      style={{ fontFamily: "var(--font-mono)", fontWeight: 300 }}
      variants={badgeVariant}
    >
      {children}
    </motion.span>
  );
}

/* ──────────────────────────────────────────────
   A block of text that types itself in
────────────────────────────────────────────── */
function TypedBlock({
  text,
  active,
  speed = 12,
  className = "",
}: {
  text: string;
  active: boolean;
  speed?: number;
  className?: string;
}) {
  const out = useTypewriter(text, active, speed);
  return (
    <span className={className}>
      {out}
      {out.length < text.length && active && (
        <span className="inline-block w-[2px] h-[1em] bg-red-500 ml-[1px] align-middle animate-pulse" />
      )}
    </span>
  );
}

/* ──────────────────────────────────────────────
   Dossier data
────────────────────────────────────────────── */
const DOSSIER = {
  role: "AI-Augmented Developer | Cybersecurity Aspirant",
  mission:
    "Currently in my 2nd year of CSE, I'm developing a unique professional identity. On the creative side, I'm a Vibe Coder—using AI to bypass traditional syntax hurdles and focus on building functional, logic-driven projects. On the technical side, I'm an Aspiring Security Analyst deep-diving into the Google Cybersecurity Professional track. I'm currently building my 'creator' and 'defender' skillsets side-by-side.",
  operations: [
    {
      label: "THE VAULT",
      text: "Developed EduScheduler, a smart classroom and timetable ecosystem bridging legacy ERP systems and modern IoT-ready environments.",
    },
    {
      label: "SECURITY CLEARANCE",
      text: "Completing the Google Cybersecurity Professional Certificate with a deep-dive into network security, threat intelligence, and Python-driven automation.",
    },
    {
      label: "TACTICAL EXPERIENCE",
      text: "Deployed at the IIIT Delhi E-Summit Hackathon, solving architectural challenges under high-pressure conditions.",
    },
  ],
  stack: {
    devWorkflow: ["AI-Native Prototyping", "Gemini", "Claude", "GPT", "Prompt Engineering"],
    foundations: ["Linux CLI", "SQL", "System Architecture"],
    web: ["HTML5", "CSS3"],
    professional: ["Analytical Listening", "Requirement Gathering", "Rapid Problem Solving"],
  },
};

/* ──────────────────────────────────────────────
   Main component
────────────────────────────────────────────── */
export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-15%" });
  const [phase, setPhase] = useState(0); // 0=locked, 1=scanning, 2=revealed

  /* Stagger reveal phases & Active Log triggers */
  useEffect(() => {
    if (!isInView) return;
    logStore.addLog("[LOG]: Accessing Academic Dossier...");
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => {
      setPhase(2);
      logStore.addLog("[SYS]: Reading Bio Data... Success.");
    }, 1800);
    const t3 = setTimeout(() => logStore.addLog("[LOG]: Core Stack Decrypted."), 4000);
    const t4 = setTimeout(() => logStore.addLog("[SYS]: Dossier fully loaded."), 7000);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [isInView]);

  const revealed = phase >= 2;

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-24 px-6 md:px-16 lg:px-32"
      style={{
        background: `
          radial-gradient(ellipse 70% 50% at 50% 0%,   #0a1a2f 0%, transparent 70%),
          radial-gradient(ellipse 40% 40% at 90% 80%,  #071220 0%, transparent 65%),
          #050505
        `,
      }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(10,26,47,0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(10,26,47,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "4rem 4rem",
        }}
      />

      {/* Laser scan bar — sweeps top→bottom during phase 1 */}
      {phase === 1 && (
        <motion.div
          className="absolute left-0 w-full z-20 pointer-events-none"
          style={{
            height: "3px",
            background:
              "linear-gradient(90deg, transparent 0%, #ef4444 20%, #ff2222 50%, #ef4444 80%, transparent 100%)",
            boxShadow: "0 0 20px 8px rgba(239,68,68,0.8), 0 0 60px 12px rgba(239,68,68,0.25)",
          }}
          initial={{ top: "-4px" }}
          animate={{ top: "100%" }}
          transition={{ duration: 1.5, ease: "linear" }}
        />
      )}

      <div className="relative z-10 w-full max-w-5xl">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#1e3a8a] to-transparent" />
          <p
            className="text-red-500 tracking-[0.35em] text-xs uppercase"
            style={{ fontFamily: "var(--font-mono)", fontWeight: 200 }}
          >
            SYSTEM_PROFILE
          </p>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#1e3a8a] to-transparent" />
        </div>

        {/* Main dossier card */}
        <motion.div
          className="border border-[#1e3a8a]/30 rounded-lg overflow-hidden"
          style={{ background: "linear-gradient(160deg, #0d1f35 0%, #07101e 100%)" }}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Card top bar */}
          <div
            className="flex items-center justify-between px-6 py-3"
            style={{ borderBottom: "1px solid rgba(30,58,138,0.3)" }}
          >
            <span
              className="text-[11px] text-[#4a9eff] tracking-widest"
              style={{ fontFamily: "var(--font-mono)", fontWeight: 200 }}
            >
              CLEARANCE_LEVEL: OMEGA
            </span>
            <span
              className={`text-[11px] tracking-widest ${revealed ? "text-green-500" : "text-red-500"}`}
              style={{ fontFamily: "var(--font-mono)", fontWeight: 400 }}
            >
              {revealed ? "● DECRYPTED" : phase === 1 ? "⟳ SCANNING..." : "● ENCRYPTED"}
            </span>
          </div>

          <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10">
            {/* ── LEFT COL ── */}
            <div className="space-y-6">
              <div>
                <h2
                  className="text-3xl md:text-4xl text-white mb-1"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
                >
                  ROHIT BIHAL
                </h2>
                <p
                  className="text-sm text-red-400"
                  style={{ fontFamily: "var(--font-mono)", fontWeight: 300 }}
                >
                  {revealed ? (
                    <TypedBlock text={DOSSIER.role} active={revealed} speed={14} />
                  ) : (
                    <span className="opacity-30">■■■■■■■■■■■■■■■■■■■■■■■■■</span>
                  )}
                </p>
              </div>

              {/* Stack badges — staggered reveal */}
              <motion.div
                className="space-y-3"
                initial="hidden"
                animate={revealed ? "show" : "hidden"}
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.04, delayChildren: 0.3 } },
                }}
              >
                <p
                  className="text-[10px] text-neutral-600 tracking-[0.3em] uppercase"
                  style={{ fontFamily: "var(--font-mono)", fontWeight: 100 }}
                >
                  SKILLS &amp; TOOLS
                </p>

                <div>
                  <p className="text-[10px] text-neutral-500 mb-1" style={{ fontFamily: "var(--font-mono)", fontWeight: 200 }}>DEV WORKFLOW</p>
                  <div className="flex flex-wrap gap-2">
                    {DOSSIER.stack.devWorkflow.map((l) => (
                      <Badge key={l}>{l}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-neutral-500 mb-1" style={{ fontFamily: "var(--font-mono)", fontWeight: 200 }}>SYSTEM FOUNDATIONS</p>
                  <div className="flex flex-wrap gap-2">
                    {DOSSIER.stack.foundations.map((l) => (
                      <Badge key={l}>{l}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-neutral-500 mb-1" style={{ fontFamily: "var(--font-mono)", fontWeight: 200 }}>WEB STRUCTURE</p>
                  <div className="flex flex-wrap gap-2">
                    {DOSSIER.stack.web.map((l) => (
                      <Badge key={l}>{l}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-neutral-500 mb-1" style={{ fontFamily: "var(--font-mono)", fontWeight: 200 }}>PROFESSIONAL</p>
                  <div className="flex flex-wrap gap-2">
                    {DOSSIER.stack.professional.map((l) => (
                      <Badge key={l}>{l}</Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ── RIGHT COL ── */}
            <div className="space-y-8">
              {/* Mission */}
              <div>
                <p
                  className="text-[10px] text-neutral-500 mb-3 tracking-[0.3em] uppercase"
                  style={{ fontFamily: "var(--font-mono)", fontWeight: 100 }}
                >
                  THE MISSION
                </p>
                <p
                  className="text-sm md:text-base text-neutral-300 leading-relaxed"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}
                >
                  {revealed ? (
                    <TypedBlock text={DOSSIER.mission} active={revealed} speed={8} />
                  ) : (
                    Array(5).fill(null).map((_, i) => (
                      <span key={i} className="block mb-1 opacity-20">{"■".repeat(40 + (i % 3) * 8)}</span>
                    ))
                  )}
                </p>
              </div>

              {/* Field Operations */}
              <div>
                <p
                  className="text-[10px] text-neutral-500 mb-4 tracking-[0.3em] uppercase"
                  style={{ fontFamily: "var(--font-mono)", fontWeight: 100 }}
                >
                  FIELD OPERATIONS
                </p>
                <motion.div
                  className="space-y-4"
                  initial="hidden"
                  animate={revealed ? "show" : "hidden"}
                  variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
                  }}
                >
                  {DOSSIER.operations.map((op, i) => (
                    <motion.div
                      key={op.label}
                      className="flex gap-4"
                      variants={{
                        hidden: { opacity: 0, x: -16 },
                        show: { opacity: 1, x: 0 },
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <div className="flex-shrink-0 pt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 shadow-[0_0_6px_2px_rgba(239,68,68,0.5)]" />
                      </div>
                      <div>
                        <span
                          className="text-[10px] text-red-500/70 tracking-[0.2em] uppercase block mb-1"
                          style={{ fontFamily: "var(--font-mono)", fontWeight: 400 }}
                        >
                          {op.label}
                        </span>
                        <p
                          className="text-sm text-neutral-400 leading-relaxed"
                          style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}
                        >
                          {revealed ? (
                            <TypedBlock
                              text={op.text}
                              active={revealed}
                              speed={10}
                            />
                          ) : (
                            <span className="opacity-20">{"■".repeat(50)}</span>
                          )}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
