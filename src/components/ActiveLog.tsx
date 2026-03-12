"use client";

import { useLogs } from "@/lib/logStore";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";

export default function ActiveLog() {
  const logs = useLogs();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="fixed bottom-6 right-6 z-50 w-72 md:w-88 pointer-events-none select-none">
      <div
        className="backdrop-blur-xl border rounded-lg p-3 shadow-[0_0_30px_rgba(0,0,0,0.8)]"
        style={{
          background: "rgba(5,5,5,0.88)",
          borderColor: "rgba(30,58,138,0.35)",
          boxShadow: "0 0 0 1px rgba(10,26,47,0.5), 0 8px 32px rgba(0,0,0,0.7)",
        }}
      >
        {/* Header bar */}
        <div
          className="flex items-center gap-2 mb-2 pb-2"
          style={{ borderBottom: "1px solid rgba(30,58,138,0.25)" }}
        >
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_6px_2px_rgba(239,68,68,0.5)]" />
          {/* Ultra-light (100) label text for maximum contrast effect */}
          <span
            className="text-[10px] text-neutral-500 tracking-[0.25em] uppercase"
            style={{ fontFamily: "var(--font-mono)", fontWeight: 100 }}
          >
            ACTIVE LOG //
          </span>
          {/* Flush-right heavy indicator for contrast */}
          <span
            className="ml-auto text-[9px] text-[#1e3a8a]"
            style={{ fontFamily: "var(--font-mono)", fontWeight: 800 }}
          >
            LIVE
          </span>
        </div>

        {/* Log lines */}
        <div
          ref={containerRef}
          className="h-32 overflow-hidden flex flex-col justify-end gap-[3px]"
        >
          <AnimatePresence initial={false}>
            {logs.map((log) => {
              const isAction = log.message.includes("[LOG]");
              const isWarn = log.message.includes("[WARN]");
              const isSys = log.message.includes("[SYS]");

              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: 12, filter: "blur(4px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="flex items-start gap-2 whitespace-nowrap overflow-hidden"
                >
                  {/* Timestamp */}
                  <span
                    className="text-[10px] text-neutral-700 flex-shrink-0"
                    style={{ fontFamily: "var(--font-mono)", fontWeight: 200 }}
                    suppressHydrationWarning
                  >
                    {log.timestamp.toLocaleTimeString([], {
                      hour12: false,
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                  {/* Message */}
                  <span
                    className={`text-[11px] truncate ${
                      isAction
                        ? "text-red-400"
                        : isWarn
                        ? "text-amber-400"
                        : isSys
                        ? "text-[#4a9eff]"
                        : "text-neutral-500"
                    }`}
                    style={{ fontFamily: "var(--font-mono)", fontWeight: isAction ? 700 : 300 }}
                  >
                    {log.message}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
