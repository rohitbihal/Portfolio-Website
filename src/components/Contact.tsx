"use client";

import { logStore } from "@/lib/logStore";
import { motion, AnimatePresence } from "framer-motion";
import { Fingerprint, Mail, Linkedin } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Contact() {
  const [isHovering, setIsHovering] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const progressRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const revertTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1.5s = 1500ms
  const REQUIRED_TIME = 1500;
  // Auto-revert after 5s
  const REVERT_TIME = 5000;

  /* Auto-revert: re-lock after REVERT_TIME */
  useEffect(() => {
    if (!accessGranted) return;
    revertTimerRef.current = setTimeout(() => {
      setAccessGranted(false);
      progressRef.current = 0;
      const ring = document.getElementById("progress-ring-circle");
      if (ring) ring.style.strokeDashoffset = (60 * 2 * Math.PI).toString();
      logStore.addLog("[SYS]: Session expired. Re-locking comms channel.");
    }, REVERT_TIME);
    return () => {
      if (revertTimerRef.current) clearTimeout(revertTimerRef.current);
    };
  }, [accessGranted]);

  const updateProgress = (timestamp: number, startTime: number) => {
    const elapsed = timestamp - startTime;
    progressRef.current = Math.min((elapsed / REQUIRED_TIME) * 100, 100);

    // Update the visual ring or state here if needed (e.g., via state or direct DOM for perf)
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
      return; // Stop animation loop
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
      <div className="text-center z-10">
        <h2 className="text-neutral-500 font-mono tracking-[0.3em] text-sm mb-12">
          {accessGranted ? "SECURE COMMS CHANNEL" : "SYSTEM LOCKED"}
        </h2>

        <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!accessGranted ? (
              <motion.div
                key="locked"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
                transition={{ duration: 0.5 }}
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
                initial={{ clipPath: "circle(0% at center)" }}
                animate={{ clipPath: "circle(150% at center)" }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="absolute inset-[-50vh] flex flex-col items-center justify-center bg-neutral-900 border border-neutral-800 shadow-[0_0_50px_rgba(30,58,138,0.1)] rounded-full"
              >
                <div className="flex flex-col items-center gap-8 py-12 px-24 bg-[#0a0a0a] border border-neutral-800 rounded-2xl">
                  <h3 className="text-3xl font-bold text-white tracking-tight">ACCESS GRANTED</h3>
                  <div className="flex gap-6">
                    <a href="mailto:rohitbihal333@gmail.com" className="flex items-center gap-3 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors font-mono text-sm">
                      <Mail className="w-5 h-5 text-red-500" />
                      EMAIL PROTOCOL
                    </a>
                    <a href="https://www.linkedin.com/in/rohit-bihal" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-6 py-3 bg-[#0a66c2]/10 border border-[#0a66c2]/30 hover:bg-[#0a66c2]/20 text-white rounded-lg transition-colors font-mono text-sm">
                      <Linkedin className="w-5 h-5 text-[#0a66c2]" />
                      LINKEDIN NETWORK
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-8 font-mono text-neutral-600 text-xs">
          {!accessGranted ? "HOLD FINGERPRINT TO VERIFY IDENTITY" : "COMMUNICATION CHANNELS OPEN"}
        </p>
      </div>
    </section>
  );
}
