"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { logStore } from "@/lib/logStore";
import { ShieldCheck } from "lucide-react";

type CertStatus = "IN_PROGRESS" | "COMPLETED";

interface Cert {
  title: string;
  issuer: string;
  status: CertStatus;
  progress: number;
  totalCourses: number;
  completedCourses: number;
  description: string;
  verifyUrl: string | null;
}

const CERTS: Cert[] = [
  {
    title: "Google Cybersecurity Professional Certificate",
    issuer: "Google",
    status: "IN_PROGRESS",
    progress: 30,
    totalCourses: 8,
    completedCourses: 2,
    description:
      "Deep-dive into network security, threat intelligence, SIEM tools, and Python-driven automation across 8 comprehensive courses.",
    verifyUrl: null,
  },
  // Add more certs here as objects with the same shape
];

function CertCard({
  cert,
  index,
}: {
  cert: Cert;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });

  const isComplete = cert.status === "COMPLETED";

  return (
    <motion.div
      ref={ref}
      className="relative border border-[#1e3a8a]/30 rounded-lg overflow-hidden group"
      style={{
        background: "linear-gradient(160deg, #0d1f35 0%, #080e18 100%)",
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
    >
      {/* Status bar */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: "1px solid rgba(30,58,138,0.25)" }}
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#4a9eff]" />
          <span
            className="text-[10px] text-neutral-500 tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-mono)", fontWeight: 200 }}
          >
            {cert.issuer}
          </span>
        </div>
        <span
          className={`text-[10px] tracking-[0.2em] uppercase ${
            isComplete ? "text-green-400" : "text-amber-400"
          }`}
          style={{ fontFamily: "var(--font-mono)", fontWeight: 400 }}
        >
          {isComplete ? "● VERIFIED" : "⟳ IN PROGRESS"}
        </span>
      </div>

      <div className="p-5 space-y-4">
        <h4
          className="text-lg text-white"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
        >
          {cert.title}
        </h4>

        <p
          className="text-sm text-neutral-400 leading-relaxed"
          style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}
        >
          {cert.description}
        </p>

        {/* Progress bar */}
        {!isComplete && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span
                className="text-[10px] text-neutral-500 tracking-wider uppercase"
                style={{ fontFamily: "var(--font-mono)", fontWeight: 200 }}
              >
                COURSE PROGRESS
              </span>
              <span
                className="text-[10px] text-[#4a9eff]"
                style={{ fontFamily: "var(--font-mono)", fontWeight: 400 }}
              >
                {cert.completedCourses}/{cert.totalCourses} MODULES
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#0a1a2f] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #1e3a8a, #4a9eff)",
                  boxShadow: "0 0 10px rgba(74,158,255,0.4)",
                }}
                initial={{ width: "0%" }}
                animate={isInView ? { width: `${cert.progress}%` } : {}}
                transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {/* Verify link (for completed certs) */}
        {isComplete && cert.verifyUrl && (
          <a
            href={cert.verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-[#4a9eff] hover:text-white transition-colors"
            style={{ fontFamily: "var(--font-mono)", fontWeight: 300 }}
          >
            VERIFY CREDENTIAL →
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default function Certifications() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  useEffect(() => {
    if (isInView) {
      logStore.addLog("[LOG]: Querying credentials database...");
      const t = setTimeout(
        () => logStore.addLog("[SYS]: Credential status loaded."),
        1200
      );
      return () => clearTimeout(t);
    }
  }, [isInView]);

  return (
    <section
      id="certifications"
      ref={sectionRef}
      className="relative w-full py-24 px-6 md:px-16 lg:px-32 overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 70% 50% at 70% 0%, #0a1a2f 0%, transparent 70%),
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
            CREDENTIALS_ARCHIVE
          </p>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#1e3a8a] to-transparent" />
        </div>

        {/* Cert cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CERTS.map((cert, i) => (
            <CertCard key={cert.title} cert={cert} index={i} />
          ))}
        </div>

        {/* Placeholder hint */}
        {CERTS.length < 2 && (
          <motion.div
            className="mt-6 border border-dashed border-[#1e3a8a]/20 rounded-lg p-8 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
          >
            <p
              className="text-neutral-600 text-xs tracking-[0.2em] uppercase"
              style={{ fontFamily: "var(--font-mono)", fontWeight: 200 }}
            >
              MORE CREDENTIALS INCOMING // STANDBY
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
