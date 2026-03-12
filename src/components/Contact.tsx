"use client";

import { logStore } from "@/lib/logStore";
import { motion, AnimatePresence } from "framer-motion";
import { Fingerprint, Mail, Linkedin } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Contact() {
  const [isHovering, setIsHovering] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [glitchPhase, setGlitchPhase] = useState<"idle" | "glitching" | "revealed">("idle");
  const progressRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const revertTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const REQUIRED_TIME = 1500;
  const REVERT_TIME = 5000;

  /* Handle glitch phases when access is granted */
  useEffect(() => {
    if (!accessGranted) {
      setGlitchPhase("idle");
      return;
    }

    // Phase 1: Glitch for 800ms
    setGlitchPhase("glitching");
    logStore.addLog("[SYS]: Decrypting secure channel...");

    const revealTimer = setTimeout(() => {
      setGlitchPhase("revealed");
      logStore.addLog("[SYS]: Channel decrypted. Comms online.");
    }, 800);

    // Auto-revert
    revertTimerRef.current = setTimeout(() => {
      setAccessGranted(false);
      progressRef.current = 0;
      const ring = document.getElementById("progress-ring-circle");
      if (ring) ring.style.strokeDashoffset = (60 * 2 * Math.PI).toString();
      logStore.addLog("[SYS]: Session expired. Re-locking comms channel.");
    }, REVERT_TIME);

    return () => {
      clearTimeout(revealTimer);
      if (revertTimerRef.current) clearTimeout(revertTimerRef.current);
    };
  }, [accessGranted]);

  const updateProgress = (timestamp: number, startTime: number) => {
    const elapsed = timestamp - startTime;
    progressRef.current = Math.min((elapsed / REQUIRED_TIME) * 100, 100);

    const ring = document.getElementById("progress-ring-circle");
    if (ring) {
      const radius = 60;
      const circumference = radius * 2 * Math.PI;
      const offset = circumference - (progressRef.current / 100) * circumference;
      ring.style.strokeDashoffset = offset.toString();
    }

    if (elapsed >= REQUIRED_TIME) {
      setAccessGranted(true);
      logStore.addLog("[SYS]: Biometric Scan Successful. Access Granted.");
      setIsHovering(false);
      return;
    }

    rafRef.current = requestAnimationFrame((newTime) => updateProgress(newTime, startTime));
  };

  const handlePointerDown = () => {
    if (accessGranted) return;
    setIsHovering(true);
    logStore.addLog("[LOG]: Initiating Biometric Scan...");
    const startTime = performance.now();
    rafRef.current = requestAnimationFrame((time) => updateProgress(time, startTime));
  };

  const handlePointerUp = () => {
    if (accessGranted) return;
    setIsHovering(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    progressRef.current = 0;
    const ring = document.getElementById("progress-ring-circle");
    if (ring) ring.style.strokeDashoffset = (60 * 2 * Math.PI).toString();
    logStore.addLog("[WARN]: Scan Interrupted. Access Denied.");
  };

  return (
    <section id="contact" className="relative h-screen w-full bg-[#050505] flex items-center justify-center overflow-hidden">
      {/* Glitch Warp CSS Keyframes */}
      <style>{`
        @keyframes glitch-scanlines {
          0% { background-position: 0 0; }
          100% { background-position: 0 -200vh; }
        }
        @keyframes glitch-shift-1 {
          0%, 100% { clip-path: inset(0 0 95% 0); transform: translateX(0); }
          10% { clip-path: inset(15% 0 70% 0); transform: translateX(-8px); }
          20% { clip-path: inset(40% 0 40% 0); transform: translateX(6px); }
          30% { clip-path: inset(60% 0 20% 0); transform: translateX(-4px); }
          40% { clip-path: inset(80% 0 5% 0); transform: translateX(10px); }
          50% { clip-path: inset(5% 0 85% 0); transform: translateX(-6px); }
          60% { clip-path: inset(30% 0 50% 0); transform: translateX(8px); }
          70% { clip-path: inset(50% 0 30% 0); transform: translateX(-10px); }
          80% { clip-path: inset(70% 0 15% 0); transform: translateX(4px); }
          90% { clip-path: inset(10% 0 75% 0); transform: translateX(-8px); }
        }
        @keyframes glitch-shift-2 {
          0%, 100% { clip-path: inset(95% 0 0 0); transform: translateX(0); }
          10% { clip-path: inset(70% 0 15% 0); transform: translateX(10px); }
          20% { clip-path: inset(20% 0 60% 0); transform: translateX(-6px); }
          30% { clip-path: inset(50% 0 30% 0); transform: translateX(8px); }
          40% { clip-path: inset(10% 0 80% 0); transform: translateX(-4px); }
          50% { clip-path: inset(85% 0 5% 0); transform: translateX(6px); }
          60% { clip-path: inset(45% 0 40% 0); transform: translateX(-10px); }
          70% { clip-path: inset(25% 0 55% 0); transform: translateX(4px); }
          80% { clip-path: inset(65% 0 20% 0); transform: translateX(-8px); }
          90% { clip-path: inset(35% 0 50% 0); transform: translateX(10px); }
        }
        @keyframes glitch-flicker {
          0%, 100% { opacity: 1; }
          5% { opacity: 0.3; }
          10% { opacity: 1; }
          15% { opacity: 0.6; }
          20% { opacity: 1; }
          45% { opacity: 0.4; }
          50% { opacity: 1; }
          75% { opacity: 0.7; }
          80% { opacity: 1; }
        }
        .glitch-overlay {
          animation: glitch-flicker 0.3s steps(4) infinite;
        }
        .glitch-layer-red {
          position: absolute; inset: 0;
          animation: glitch-shift-1 0.4s steps(3) infinite;
          mix-blend-mode: screen;
          opacity: 0.8;
        }
        .glitch-layer-cyan {
          position: absolute; inset: 0;
          animation: glitch-shift-2 0.35s steps(3) infinite;
          mix-blend-mode: screen;
          opacity: 0.8;
        }
        .glitch-scanlines-overlay {
          pointer-events: none;
          position: absolute; inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.3) 2px,
            rgba(0, 0, 0, 0.3) 4px
          );
          animation: glitch-scanlines 0.5s linear infinite;
          z-index: 50;
        }
      `}</style>

      <div className="text-center z-10">
        <h2 className="text-neutral-500 font-mono tracking-[0.3em] text-sm mb-12">
          {glitchPhase === "revealed" ? "SECURE COMMS CHANNEL" : glitchPhase === "glitching" ? "DECRYPTING..." : "SYSTEM LOCKED"}
        </h2>

        <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!accessGranted ? (
              <motion.div
                key="locked"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, filter: "blur(8px) brightness(3)", scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="relative flex items-center justify-center cursor-pointer"
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
              >
                {/* SVG Progress Ring */}
                <svg className="absolute w-44 h-44 -rotate-90 pointer-events-none">
                  <circle
                    className="text-neutral-800"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="transparent"
                    r="60"
                    cx="88"
                    cy="88"
                  />
                  <circle
                    id="progress-ring-circle"
                    className="text-red-500 transition-all duration-75 ease-linear drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                    strokeWidth="4"
                    strokeDasharray={60 * 2 * Math.PI}
                    strokeDashoffset={60 * 2 * Math.PI}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="60"
                    cx="88"
                    cy="88"
                  />
                </svg>

                <div
                  className={`relative p-8 rounded-full border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm transition-colors duration-300 ${isHovering ? "border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)] bg-neutral-900" : ""}`}
                >
                  <Fingerprint className={`w-12 h-12 transition-colors duration-300 ${isHovering ? "text-red-500" : "text-neutral-500"}`} />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="unlocked"
                className="absolute inset-[-50vh] flex flex-col items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
              >
                {/* Glitch Phase: chromatic aberration + scan lines */}
                {glitchPhase === "glitching" && (
                  <>
                    {/* Glitch scanlines overlay */}
                    <div className="glitch-scanlines-overlay" />

                    {/* Red chromatic aberration layer */}
                    <div className="glitch-layer-red">
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="flex flex-col items-center gap-8 py-12 px-24">
                          <h3 className="text-3xl font-bold tracking-tight" style={{ color: "#ff0040" }}>ACCESS GRANTED</h3>
                          <div className="flex gap-6">
                            <div className="flex items-center gap-3 px-6 py-3 rounded-lg" style={{ color: "#ff0040" }}>
                              <Mail className="w-5 h-5" />
                              EMAIL PROTOCOL
                            </div>
                            <div className="flex items-center gap-3 px-6 py-3 rounded-lg" style={{ color: "#ff0040" }}>
                              <Linkedin className="w-5 h-5" />
                              LINKEDIN NETWORK
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cyan chromatic aberration layer */}
                    <div className="glitch-layer-cyan">
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="flex flex-col items-center gap-8 py-12 px-24">
                          <h3 className="text-3xl font-bold tracking-tight" style={{ color: "#00e5ff" }}>ACCESS GRANTED</h3>
                          <div className="flex gap-6">
                            <div className="flex items-center gap-3 px-6 py-3 rounded-lg" style={{ color: "#00e5ff" }}>
                              <Mail className="w-5 h-5" />
                              EMAIL PROTOCOL
                            </div>
                            <div className="flex items-center gap-3 px-6 py-3 rounded-lg" style={{ color: "#00e5ff" }}>
                              <Linkedin className="w-5 h-5" />
                              LINKEDIN NETWORK
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Main content (flickering) */}
                    <div className="glitch-overlay flex flex-col items-center justify-center h-full">
                      <div className="flex flex-col items-center gap-8 py-12 px-24 bg-[#0a0a0a] border border-neutral-800 rounded-2xl">
                        <h3 className="text-3xl font-bold text-white tracking-tight">ACCESS GRANTED</h3>
                      </div>
                    </div>
                  </>
                )}

                {/* Revealed Phase: clean content snaps in */}
                {glitchPhase === "revealed" && (
                  <motion.div
                    className="flex flex-col items-center justify-center h-full bg-neutral-900 border border-neutral-800 shadow-[0_0_50px_rgba(30,58,138,0.1)] rounded-full"
                    initial={{ opacity: 0, scale: 1.05, filter: "brightness(2) blur(4px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "brightness(1) blur(0px)" }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <div className="flex flex-col items-center gap-8 py-12 px-24 bg-[#0a0a0a] border border-neutral-800 rounded-2xl">
                      <motion.h3
                        className="text-3xl font-bold text-white tracking-tight"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                      >
                        ACCESS GRANTED
                      </motion.h3>
                      <motion.div
                        className="flex gap-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                      >
                        <a href="mailto:rohitbihal333@gmail.com" className="flex items-center gap-3 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors font-mono text-sm">
                          <Mail className="w-5 h-5 text-red-500" />
                          EMAIL PROTOCOL
                        </a>
                        <a href="https://www.linkedin.com/in/rohit-bihal" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-6 py-3 bg-[#0a66c2]/10 border border-[#0a66c2]/30 hover:bg-[#0a66c2]/20 text-white rounded-lg transition-colors font-mono text-sm">
                          <Linkedin className="w-5 h-5 text-[#0a66c2]" />
                          LINKEDIN NETWORK
                        </a>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-8 font-mono text-neutral-600 text-xs">
          {glitchPhase === "revealed" ? "COMMUNICATION CHANNELS OPEN" : glitchPhase === "glitching" ? "DECRYPTING SECURE CHANNEL..." : "HOLD FINGERPRINT TO VERIFY IDENTITY"}
        </p>
      </div>
    </section>
  );
}

