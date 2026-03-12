"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  "INITIALIZING SYSTEM KERNEL...",
  "LOADING SECURITY PROTOCOLS...",
  "ESTABLISHING NEURAL NETWORK...",
  "DECRYPTING USER INTERFACE...",
  "CALIBRATING THREAT SENSORS...",
  "SYSTEM ONLINE.",
];

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [currentLine, setCurrentLine] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Don't show on subsequent navigations (session check)
    if (sessionStorage.getItem("rb-loaded")) {
      setLoading(false);
      return;
    }

    // Animate through boot lines
    const lineInterval = setInterval(() => {
      setCurrentLine((prev) => {
        if (prev >= BOOT_LINES.length - 1) {
          clearInterval(lineInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 350);

    // Progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    // Dismiss after ~2.5s
    const dismiss = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem("rb-loaded", "true");
    }, 2600);

    return () => {
      clearInterval(lineInterval);
      clearInterval(progressInterval);
      clearTimeout(dismiss);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: "#030303" }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="text-center max-w-md px-6">
            {/* Logo / Name */}
            <motion.h1
              className="text-3xl md:text-4xl text-white mb-8"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                backgroundImage:
                  "linear-gradient(170deg, #ffffff 0%, #a0aec0 50%, #3a4a6b 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              RB://SYSTEM
            </motion.h1>

            {/* Boot log */}
            <div className="text-left mb-8 h-40 flex flex-col justify-end">
              {BOOT_LINES.slice(0, currentLine + 1).map((line, i) => (
                <motion.p
                  key={i}
                  className={`text-xs mb-1 ${
                    i === currentLine
                      ? "text-red-400"
                      : i === BOOT_LINES.length - 1 && currentLine === BOOT_LINES.length - 1
                      ? "text-green-400"
                      : "text-neutral-600"
                  }`}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontWeight: i === currentLine ? 400 : 200,
                  }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {i === currentLine && i !== BOOT_LINES.length - 1 && (
                    <span className="text-red-500 mr-2">▸</span>
                  )}
                  {i === BOOT_LINES.length - 1 && currentLine >= BOOT_LINES.length - 1 && (
                    <span className="text-green-500 mr-2">●</span>
                  )}
                  {i < currentLine && i !== BOOT_LINES.length - 1 && (
                    <span className="text-neutral-700 mr-2">✓</span>
                  )}
                  {line}
                </motion.p>
              ))}
            </div>

            {/* Progress bar */}
            <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, #ef4444, #f87171)",
                  boxShadow: "0 0 12px rgba(239,68,68,0.5)",
                  width: `${progress}%`,
                }}
                transition={{ duration: 0.05 }}
              />
            </div>

            <p
              className="mt-3 text-[10px] text-neutral-700 tracking-[0.3em]"
              style={{ fontFamily: "var(--font-mono)", fontWeight: 200 }}
            >
              {progress}% LOADED
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
