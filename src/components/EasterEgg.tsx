"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { logStore } from "@/lib/logStore";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "KeyB", "KeyA",
];

export default function EasterEgg() {
  const [triggered, setTriggered] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (triggered) return;
      setProgress((prev) => {
        const expected = KONAMI[prev];
        if (e.code === expected) {
          const next = prev + 1;
          if (next === KONAMI.length) {
            setTriggered(true);
            logStore.addLog("[WARN]: ⚠ KONAMI CODE DETECTED!");
            logStore.addLog("[SYS]: SYSTEM BREACHED // MATRIX PROTOCOL ACTIVE");
            setTimeout(() => {
              setTriggered(false);
              setProgress(0);
              logStore.addLog("[SYS]: Breach contained. System restored.");
            }, 4000);
          }
          return next;
        }
        return e.code === KONAMI[0] ? 1 : 0;
      });
    },
    [triggered]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <AnimatePresence>
      {triggered && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Black overlay */}
          <div className="absolute inset-0 bg-black/90" />

          {/* Matrix rain effect */}
          <MatrixRain />

          {/* Glitch text */}
          <motion.div
            className="relative z-10 text-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h2
              className="text-5xl md:text-7xl text-red-500 mb-4 glitch-text"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                textShadow:
                  "0 0 20px rgba(239,68,68,0.8), 0 0 60px rgba(239,68,68,0.3)",
                animation: "glitch-skew 0.5s steps(2) infinite",
              }}
            >
              SYSTEM BREACHED
            </h2>
            <p
              className="text-green-400 text-sm tracking-[0.4em]"
              style={{ fontFamily: "var(--font-mono)", fontWeight: 300 }}
            >
              UNAUTHORIZED ACCESS DETECTED
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Matrix Rain Canvas ── */
function MatrixRain() {
  useEffect(() => {
    const canvas = document.getElementById("matrix-canvas") as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "01アイウエオカキクケコサシスセソ";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0f0";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = Math.random() > 0.95 ? "#fff" : `hsl(120, 100%, ${30 + Math.random() * 30}%)`;
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 35);
    return () => clearInterval(interval);
  }, []);

  return (
    <canvas
      id="matrix-canvas"
      className="absolute inset-0 z-0 opacity-60"
    />
  );
}
