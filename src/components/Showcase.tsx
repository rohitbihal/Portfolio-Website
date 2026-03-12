"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { logStore } from "@/lib/logStore";

const PROJECTS = [
  {
    id: "01",
    title: "EduScheduler",
    role: "AI-Augmented Full-Stack Developer",
    description:
      "A full-stack educational management platform that leverages the Google Gemini API to automatically generate conflict-free academic timetables. Features role-based dashboards for administrators, teachers, and students, streamlining campus operations from attendance tracking to real-time AI assistance.",
    tech: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "Gemini API", "Tailwind CSS", "JWT Auth"],
  },
];

export default function Showcase() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-65%"]);

  return (
    <section id="vault" ref={targetRef} className="relative h-[300vh]" style={{ background: "#050505" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
        {/* Cyber-blue grid background */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(10,26,47,0.35) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(10,26,47,0.35) 1px, transparent 1px)
            `,
            backgroundSize: "4rem 4rem",
          }}
        />

        <motion.div style={{ x }} className="flex gap-24 px-32 w-max items-center z-10">
          {/* Section header */}
          <div className="flex-shrink-0 w-[30vw]">
            <p
              className="text-sm tracking-[0.35em] mb-4 text-red-500 uppercase"
              style={{ fontFamily: "var(--font-mono)", fontWeight: 200 }}
            >
              DATABASE ACCESS
            </p>
            <h3
              className="text-5xl md:text-7xl text-white mb-6"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
            >
              THE VAULT
            </h3>
            <p
              className="max-w-md text-neutral-400 leading-relaxed"
              style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}
            >
              Classified intelligence and operational nodes. Scroll to decrypt project data.
            </p>
          </div>

          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}

          <div className="w-[10vw]" />
        </motion.div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof PROJECTS)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({ target: cardRef });
  const isInView = useInView(cardRef, { margin: "-20%" });
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    if (isInView) {
      logStore.addLog(`[LOG]: Accessing Vault — Project ${project.id}...`);
      /* Trigger chromatic aberration glitch for 800 ms as the laser passes */
      setGlitching(true);
      const t = setTimeout(() => setGlitching(false), 900);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView]);

  return (
    <div
      ref={cardRef}
      className="relative flex-shrink-0 w-[80vw] md:w-[60vw] h-[70vh] rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900/40 backdrop-blur-md"
      style={{
        background:
          "linear-gradient(135deg, #0a1a2f18 0%, #05050598 100%)",
        borderColor: glitching ? "rgba(239,68,68,0.6)" : undefined,
        boxShadow: glitching
          ? "0 0 40px 4px rgba(239,68,68,0.15), 0 0 0 1px rgba(239,68,68,0.3)"
          : undefined,
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
    >
      {/* Encrypted placeholder behind the reveal */}
      <div className="absolute inset-0 flex flex-col items-center justify-center font-mono text-neutral-700 p-8 z-0">
        <span className="text-4xl opacity-20" style={{ fontFamily: "var(--font-mono)", fontWeight: 100 }}>
          [{project.id}] ENCRYPTED
        </span>
        <div className="w-full h-px bg-neutral-800 my-4" />
        <span className="text-xs max-w-sm text-center" style={{ fontFamily: "var(--font-mono)", fontWeight: 200 }}>
          AWAITING SYSTEM CLEARANCE — STANDBY
        </span>
      </div>

      {/* ── Vault reveal layer (clip-path from bottom → top) ── */}
      <motion.div
        className="absolute inset-0 z-10 flex flex-col justify-between p-8 md:p-12"
        style={{ background: "linear-gradient(160deg, #0d1f35 0%, #080e18 100%)" }}
        initial={{ clipPath: "inset(100% 0 0 0)" }}
        whileInView={{ clipPath: "inset(0% 0 0 0)" }}
        viewport={{ margin: "-100px", once: false, amount: 0.6 }}
        transition={{ duration: 1.4, ease: "circOut" }}
      >
        {/* ── Red laser scan-line ── */}
        <motion.div
          className="absolute left-0 w-full z-20 pointer-events-none"
          style={{
            height: "3px",
            background:
              "linear-gradient(90deg, transparent 0%, #ef4444 20%, #ff2222 50%, #ef4444 80%, transparent 100%)",
            boxShadow:
              "0 0 18px 6px rgba(239,68,68,0.9), 0 0 40px 10px rgba(239,68,68,0.3)",
          }}
          initial={{ top: "100%", opacity: 1 }}
          whileInView={{ top: "0%", opacity: 0 }}
          viewport={{ margin: "-100px", once: false, amount: 0.6 }}
          transition={{ duration: 1.4, ease: "circOut" }}
        />

        {/* Status bar */}
        <div className="flex justify-between items-start">
          <span
            className="text-red-500 border border-red-500/30 px-3 py-1 bg-red-500/10 text-xs"
            style={{ fontFamily: "var(--font-mono)", fontWeight: 400 }}
          >
            STATUS: DECRYPTED
          </span>
          <span
            className="text-neutral-500 text-sm tracking-widest"
            style={{ fontFamily: "var(--font-mono)", fontWeight: 200 }}
          >
            {project.id}
          </span>
        </div>

        {/* Project title — chromatic aberration applied here */}
        <div className="flex-1 flex flex-col justify-center">
          <h4
            ref={titleRef}
            className={`chromatic-glitch text-4xl md:text-5xl lg:text-7xl text-white tracking-tight mb-4${glitching ? " glitch-active" : ""}`}
            data-text={project.title}
            style={{ fontFamily: "var(--font-display)", fontWeight: 700, lineHeight: 1.1 }}
          >
            {project.title}
          </h4>

          {/* Role — weight 200 for contrast against weight-700 title */}
          <p
            className="text-xl md:text-2xl text-neutral-400 mb-6"
            style={{ fontFamily: "var(--font-display)", fontWeight: 200 }}
          >
            {project.role}
          </p>

          <p
            className="text-neutral-500 max-w-2xl leading-relaxed text-sm md:text-base"
            style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}
          >
            {project.description}
          </p>
        </div>

        {/* Tech stack */}
        <div className="flex gap-3 flex-wrap mt-8">
          {project.tech.map((t) => (
            <span
              key={t}
              className="px-4 py-2 bg-[#0a1a2f]/60 text-neutral-300 text-xs tracking-wider uppercase border border-[#1e3a8a]/40"
              style={{ fontFamily: "var(--font-mono)", fontWeight: 300 }}
            >
              {t}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
