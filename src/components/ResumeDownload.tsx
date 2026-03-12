"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FileDown } from "lucide-react";

export default function ResumeDownload() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <div
      ref={ref}
      className="relative w-full py-16 px-6 md:px-16 lg:px-32 overflow-hidden"
      style={{ background: "#050505" }}
    >
      <motion.div
        className="relative z-10 max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Decorative lines */}
        <div className="flex items-center gap-4 mb-8 justify-center">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#1e3a8a]" />
          <p
            className="text-neutral-600 tracking-[0.35em] text-[10px] uppercase"
            style={{ fontFamily: "var(--font-mono)", fontWeight: 200 }}
          >
            DOCUMENT EXTRACTION
          </p>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#1e3a8a]" />
        </div>

        <h3
          className="text-2xl md:text-3xl text-white mb-4"
          style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
        >
          CLASSIFIED DOSSIER
        </h3>
        <p
          className="text-sm text-neutral-500 mb-8 max-w-md mx-auto"
          style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}
        >
          Extract full mission history, technical specifications, and
          operational clearance documentation.
        </p>

        {/* Download button */}
        <motion.a
          href="/resume.pdf"
          download
          className="relative inline-flex items-center gap-3 px-8 py-4 border border-red-500/40 bg-transparent text-red-400 text-xs tracking-[0.3em] uppercase cursor-pointer rounded-sm group overflow-hidden"
          style={{ fontFamily: "var(--font-mono)", fontWeight: 400 }}
          whileHover={{
            borderColor: "rgba(239,68,68,0.8)",
            color: "#ffffff",
          }}
          whileTap={{ scale: 0.96 }}
        >
          {/* Sliding fill on hover */}
          <span className="absolute inset-0 bg-red-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          <FileDown className="w-4 h-4 relative z-10" />
          <span className="relative z-10">EXTRACT DOCUMENT</span>

          {/* Glow */}
          <span className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              boxShadow:
                "0 0 25px rgba(239,68,68,0.3), 0 0 50px rgba(239,68,68,0.1)",
            }}
          />
        </motion.a>

        <p
          className="mt-4 text-[10px] text-neutral-700 tracking-wider"
          style={{ fontFamily: "var(--font-mono)", fontWeight: 200 }}
        >
          PDF // LAST UPDATED: MARCH 2026
        </p>
      </motion.div>
    </div>
  );
}
