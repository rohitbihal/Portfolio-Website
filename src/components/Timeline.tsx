"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { logStore } from "@/lib/logStore";

const EVENTS = [
  {
    year: "2024 – PRESENT",
    title: "B.Tech CSE (CYS Specialization)",
    org: "CGC University",
    description:
      "Pursuing Computer Science with a specialization in Cybersecurity. Building a dual identity as a Vibe Coder and Security Analyst.",
    status: "ACTIVE",
  },
  {
    year: "2025",
    title: "E-Summit Hackathon",
    org: "IIIT Delhi",
    description:
      "Deployed under high-pressure conditions, solving real-world architectural challenges in a competitive hackathon environment.",
    status: "COMPLETED",
  },
];

function TimelineNode({
  event,
  index,
  total,
}: {
  event: (typeof EVENTS)[0];
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <motion.div
      ref={ref}
      className="relative flex gap-6 md:gap-10"
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
    >
      {/* Vertical connector line + node dot */}
      <div className="flex flex-col items-center flex-shrink-0">
        {/* Glowing dot */}
        <div
          className={`relative w-4 h-4 rounded-full border-2 flex-shrink-0 z-10 ${
            event.status === "ACTIVE"
              ? "border-red-500 bg-red-500/30 shadow-[0_0_12px_4px_rgba(239,68,68,0.5)]"
              : "border-[#4a9eff] bg-[#4a9eff]/20 shadow-[0_0_10px_3px_rgba(74,158,255,0.3)]"
          }`}
        >
          {event.status === "ACTIVE" && (
            <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-40" />
          )}
        </div>
        {/* Connector line */}
        {index < total - 1 && (
          <motion.div
            className="w-px flex-1 min-h-[60px]"
            style={{
              transformOrigin: "top",
              background:
                "linear-gradient(to bottom, rgba(30,58,138,0.6), rgba(30,58,138,0.1))",
            }}
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.8, delay: index * 0.2 + 0.3 }}
          />
        )}
      </div>

      {/* Content */}
      <div className="pb-12">
        <span
          className="text-[10px] text-red-500/70 tracking-[0.3em] uppercase block mb-1"
          style={{ fontFamily: "var(--font-mono)", fontWeight: 400 }}
        >
          {event.year}
        </span>
        <h4
          className="text-xl md:text-2xl text-white mb-1"
          style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
        >
          {event.title}
        </h4>
        <p
          className="text-sm text-[#4a9eff] mb-3"
          style={{ fontFamily: "var(--font-mono)", fontWeight: 300 }}
        >
          {event.org}
        </p>
        <p
          className="text-sm text-neutral-400 leading-relaxed max-w-lg"
          style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}
        >
          {event.description}
        </p>
        <span
          className={`inline-block mt-3 px-3 py-1 text-[10px] tracking-[0.2em] uppercase border rounded-sm ${
            event.status === "ACTIVE"
              ? "text-red-400 border-red-500/30 bg-red-500/10"
              : "text-green-400 border-green-500/30 bg-green-500/10"
          }`}
          style={{ fontFamily: "var(--font-mono)", fontWeight: 400 }}
        >
          {event.status === "ACTIVE" ? "● ONGOING" : "● MISSION COMPLETE"}
        </span>
      </div>
    </motion.div>
  );
}

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  useEffect(() => {
    if (isInView) {
      logStore.addLog("[LOG]: Loading Operational History...");
      const t = setTimeout(
        () => logStore.addLog("[SYS]: Timeline data decrypted."),
        1500
      );
      return () => clearTimeout(t);
    }
  }, [isInView]);

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="relative w-full py-24 px-6 md:px-16 lg:px-32 overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 60% 40% at 20% 50%, #0a1a2f 0%, transparent 70%),
          radial-gradient(ellipse 50% 50% at 80% 30%, #071220 0%, transparent 60%),
          #050505
        `,
      }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(10,26,47,0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(10,26,47,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "4rem 4rem",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-16">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#1e3a8a] to-transparent" />
          <p
            className="text-red-500 tracking-[0.35em] text-xs uppercase"
            style={{ fontFamily: "var(--font-mono)", fontWeight: 200 }}
          >
            OPERATIONAL_HISTORY
          </p>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#1e3a8a] to-transparent" />
        </div>

        {/* Timeline */}
        <div className="ml-2 md:ml-8">
          {EVENTS.map((event, i) => (
            <TimelineNode
              key={event.title}
              event={event}
              index={i}
              total={EVENTS.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
