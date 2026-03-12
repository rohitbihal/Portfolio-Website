"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  useEffect(() => {
    // Detect touch device
    const isTouch =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);
    if (isTouch) return;

    const onMove = (e: MouseEvent) => {
      if (!visible) setVisible(true);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const onEnterInteractive = () => setHovering(true);
    const onLeaveInteractive = () => setHovering(false);

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    // Delegate hover detection for interactive elements
    const observer = new MutationObserver(() => {
      attachListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    function attachListeners() {
      const interactives = document.querySelectorAll(
        'a, button, [role="button"], input, textarea, select, [data-cursor-hover]'
      );
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterInteractive);
        el.removeEventListener("mouseleave", onLeaveInteractive);
        el.addEventListener("mouseenter", onEnterInteractive);
        el.addEventListener("mouseleave", onLeaveInteractive);
      });
    }
    attachListeners();

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      observer.disconnect();
    };
  }, [visible]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.15s ease",
          willChange: "transform",
        }}
      >
        <div
          className="rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-150"
          style={{
            width: hovering ? "8px" : "6px",
            height: hovering ? "8px" : "6px",
            background: "#ef4444",
            boxShadow: hovering
              ? "0 0 12px 4px rgba(239,68,68,0.6)"
              : "0 0 8px 2px rgba(239,68,68,0.4)",
          }}
        />
      </div>

      {/* Trailing ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.15s ease, transform 0.08s ease-out",
          willChange: "transform",
        }}
      >
        <div
          className="rounded-full -translate-x-1/2 -translate-y-1/2 border transition-all duration-200"
          style={{
            width: hovering ? "48px" : "32px",
            height: hovering ? "48px" : "32px",
            borderColor: hovering
              ? "rgba(239,68,68,0.5)"
              : "rgba(239,68,68,0.25)",
            background: hovering
              ? "rgba(239,68,68,0.05)"
              : "transparent",
          }}
        />
      </div>
    </>
  );
}
