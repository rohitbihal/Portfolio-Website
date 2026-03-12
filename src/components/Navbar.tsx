"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "PROFILE", href: "#about" },
  { label: "SKILLS", href: "#skills" },
  { label: "VAULT", href: "#vault" },
  { label: "TIMELINE", href: "#timeline" },
  { label: "COMMS", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const [lastY, setLastY] = useState(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > lastY && latest > 200) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setLastY(latest);
    setScrolled(latest > 80);
  });

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 flex justify-center"
        initial={{ y: -100 }}
        animate={{ y: hidden && !menuOpen ? -100 : 0 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
      >
        <motion.div
          className="flex items-center gap-1 mt-4 px-2 rounded-full border"
          animate={{
            height: scrolled ? 44 : 52,
            backgroundColor: scrolled
              ? "rgba(5, 5, 5, 0.75)"
              : "rgba(5, 5, 5, 0.25)",
            borderColor: scrolled
              ? "rgba(30, 58, 138, 0.4)"
              : "rgba(255, 255, 255, 0.06)",
            backdropFilter: scrolled ? "blur(20px)" : "blur(4px)",
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            boxShadow: scrolled
              ? "0 4px 30px rgba(0,0,0,0.6), 0 0 0 1px rgba(10,26,47,0.3)"
              : "none",
          }}
        >
          {/* Live indicator */}
          <div className="flex items-center gap-2 px-4">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_6px_2px_rgba(239,68,68,0.5)]" />
            <span
              className="text-[10px] text-neutral-500 tracking-[0.2em] uppercase hidden sm:inline"
              style={{ fontFamily: "var(--font-mono)", fontWeight: 200 }}
            >
              RB
            </span>
          </div>

          {/* Separator */}
          <div className="w-px h-5 bg-neutral-800 hidden md:block" />

          {/* Desktop Links */}
          <div className="hidden md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className="relative px-4 py-2 text-[11px] text-neutral-400 tracking-[0.2em] uppercase transition-colors duration-200 hover:text-white group"
                style={{ fontFamily: "var(--font-mono)", fontWeight: 300 }}
              >
                {link.label}
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-px bg-red-500 transition-all duration-300 group-hover:w-3/4 shadow-[0_0_4px_rgba(239,68,68,0.6)]" />
              </a>
            ))}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col items-center justify-center w-10 h-10 gap-1.5 cursor-pointer px-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <motion.span
              className="block w-5 h-px bg-neutral-400 origin-center"
              animate={
                menuOpen
                  ? { rotate: 45, y: 4 }
                  : { rotate: 0, y: 0 }
              }
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block w-5 h-px bg-neutral-400"
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.15 }}
            />
            <motion.span
              className="block w-5 h-px bg-neutral-400 origin-center"
              animate={
                menuOpen
                  ? { rotate: -45, y: -4 }
                  : { rotate: 0, y: 0 }
              }
              transition={{ duration: 0.2 }}
            />
          </button>
        </motion.div>
      </motion.nav>

      {/* Mobile Full-screen Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center md:hidden"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 30%, #0a1a2f 0%, #030303 70%)",
            }}
            initial={{ opacity: 0, clipPath: "circle(0% at 50% 0%)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 50% 0%)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 50% 0%)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {/* Terminal header */}
            <div className="absolute top-20 left-0 right-0 text-center">
              <p
                className="text-[10px] text-red-500/50 tracking-[0.4em] uppercase"
                style={{ fontFamily: "var(--font-mono)", fontWeight: 200 }}
              >
                SYSTEM TERMINAL // NAVIGATION
              </p>
            </div>

            {/* Nav links */}
            <div className="flex flex-col items-center gap-8">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleClick(e, link.href)}
                  className="text-2xl text-neutral-300 tracking-[0.3em] uppercase hover:text-white transition-colors"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontWeight: 300,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: i * 0.08,
                    ease: "easeOut",
                  }}
                >
                  <span className="text-red-500/40 text-sm mr-3">
                    0{i + 1}
                  </span>
                  {link.label}
                </motion.a>
              ))}
            </div>

            {/* Footer hint */}
            <div className="absolute bottom-12 text-center">
              <p
                className="text-[10px] text-neutral-700 tracking-wider"
                style={{ fontFamily: "var(--font-mono)", fontWeight: 200 }}
              >
                TAP TO NAVIGATE // SWIPE TO CLOSE
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
