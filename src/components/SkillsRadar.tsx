"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { logStore } from "@/lib/logStore";

const SKILLS = [
  { label: "Security", value: 0.65 },
  { label: "AI / Prompt Eng.", value: 0.85 },
  { label: "Web Dev", value: 0.55 },
  { label: "System Arch.", value: 0.6 },
  { label: "Problem Solving", value: 0.8 },
  { label: "Professional", value: 0.75 },
];

const SIZE = 280;
const CENTER = SIZE / 2;
const RINGS = 5;
const RADIUS = 110;

function polarToCartesian(
  angleDeg: number,
  radius: number
): [number, number] {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return [CENTER + radius * Math.cos(rad), CENTER + radius * Math.sin(rad)];
}

function getPolygonPoints(values: number[], maxR: number): string {
  const step = 360 / values.length;
  return values
    .map((v, i) => {
      const [x, y] = polarToCartesian(i * step, v * maxR);
      return `${x},${y}`;
    })
    .join(" ");
}

export default function SkillsRadar() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-15%" });
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isInView) {
      logStore.addLog("[LOG]: Running skills diagnostic scan...");
      const t1 = setTimeout(() => setAnimate(true), 300);
      const t2 = setTimeout(
        () => logStore.addLog("[SYS]: Skill vector analysis complete."),
        1800
      );
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [isInView]);

  const step = 360 / SKILLS.length;

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative w-full py-24 px-6 md:px-16 lg:px-32 overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 60% 50% at 40% 80%, #0a1a2f 0%, transparent 70%),
          #050505
        `,
      }}
    >
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-16">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#1e3a8a] to-transparent" />
          <p
            className="text-red-500 tracking-[0.35em] text-xs uppercase"
            style={{ fontFamily: "var(--font-mono)", fontWeight: 200 }}
          >
            CAPABILITY_MATRIX
          </p>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#1e3a8a] to-transparent" />
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Radar chart */}
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <svg
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              className="w-[260px] h-[260px] md:w-[320px] md:h-[320px]"
            >
              {/* Concentric rings */}
              {Array.from({ length: RINGS }, (_, ri) => {
                const r = (RADIUS / RINGS) * (ri + 1);
                const points = SKILLS.map((_, i) => {
                  const [x, y] = polarToCartesian(i * step, r);
                  return `${x},${y}`;
                }).join(" ");
                return (
                  <polygon
                    key={`ring-${ri}`}
                    points={points}
                    fill="none"
                    stroke="rgba(30,58,138,0.25)"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Axis lines */}
              {SKILLS.map((_, i) => {
                const [x, y] = polarToCartesian(i * step, RADIUS);
                return (
                  <line
                    key={`axis-${i}`}
                    x1={CENTER}
                    y1={CENTER}
                    x2={x}
                    y2={y}
                    stroke="rgba(30,58,138,0.2)"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Data polygon */}
              <motion.polygon
                points={getPolygonPoints(
                  animate ? SKILLS.map((s) => s.value) : SKILLS.map(() => 0),
                  RADIUS
                )}
                fill="rgba(239,68,68,0.12)"
                stroke="rgba(239,68,68,0.7)"
                strokeWidth="2"
                style={{
                  filter: "drop-shadow(0 0 8px rgba(239,68,68,0.3))",
                }}
                initial={false}
                animate={{
                  points: getPolygonPoints(
                    animate
                      ? SKILLS.map((s) => s.value)
                      : SKILLS.map(() => 0),
                    RADIUS
                  ),
                }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />

              {/* Data points */}
              {SKILLS.map((skill, i) => {
                const val = animate ? skill.value : 0;
                const [x, y] = polarToCartesian(i * step, val * RADIUS);
                return (
                  <motion.circle
                    key={`dot-${i}`}
                    cx={animate ? x : CENTER}
                    cy={animate ? y : CENTER}
                    r="4"
                    fill="#ef4444"
                    stroke="#050505"
                    strokeWidth="2"
                    style={{
                      filter: "drop-shadow(0 0 6px rgba(239,68,68,0.6))",
                    }}
                    animate={{
                      cx: animate ? x : CENTER,
                      cy: animate ? y : CENTER,
                    }}
                    transition={{
                      duration: 1.2,
                      delay: i * 0.08,
                      ease: "easeOut",
                    }}
                  />
                );
              })}

              {/* Labels */}
              {SKILLS.map((skill, i) => {
                const labelR = RADIUS + 24;
                const [x, y] = polarToCartesian(i * step, labelR);
                return (
                  <text
                    key={`label-${i}`}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-neutral-500 text-[9px] md:text-[10px]"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontWeight: 300,
                    }}
                  >
                    {skill.label}
                  </text>
                );
              })}
            </svg>
          </motion.div>

          {/* Skill bars (textual breakdown) */}
          <div className="flex-1 w-full space-y-5">
            {SKILLS.map((skill, i) => (
              <motion.div
                key={skill.label}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              >
                <div className="flex justify-between mb-1.5">
                  <span
                    className="text-xs text-neutral-300 tracking-wider uppercase"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontWeight: 300,
                    }}
                  >
                    {skill.label}
                  </span>
                  <span
                    className="text-xs text-red-400"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontWeight: 400,
                    }}
                  >
                    {Math.round(skill.value * 100)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#0a1a2f] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, #ef4444, #f87171)",
                      boxShadow: "0 0 8px rgba(239,68,68,0.4)",
                    }}
                    initial={{ width: "0%" }}
                    animate={
                      isInView
                        ? { width: `${skill.value * 100}%` }
                        : {}
                    }
                    transition={{
                      duration: 1,
                      delay: 0.3 + i * 0.1,
                      ease: "easeOut",
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
