"use client";

import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import NodeNetwork from "./NodeNetwork";
import ScrambleText from "./ScrambleText";

export default function Hero() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  /* Magnetic CTA state */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 200, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 20 });
  const [ctaHover, setCtaHover] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    mouseX.set(dx * 0.3);
    mouseY.set(dy * 0.3);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setCtaHover(false);
  };

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      id="hero"
      ref={container}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
      style={{
        /* Deep charcoal base with radial cyber-blue halos for depth */
        background: `
          radial-gradient(ellipse 80% 60% at 50% 10%,  #0a1a2f 0%, transparent 70%),
          radial-gradient(ellipse 60% 40% at 80% 60%,  #071220 0%, transparent 60%),
          radial-gradient(ellipse 50% 50% at 15% 80%,  #0a1a2f 0%, transparent 65%),
          #050505
        `,
      }}
    >
      {/* Animated sapphire mesh gradient */}
      <div className="mesh-gradient z-0" />

      {/* R3F Canvas – node network */}
      <div className="absolute inset-0 z-[1] opacity-75">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <NodeNetwork count={2000} />
        </Canvas>
      </div>

      {/* Subtle inner vignette to focus depth */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, #050505 100%)",
        }}
      />

      {/* Hero text */}
      <motion.div
        style={{ y, opacity }}
        className="z-10 flex flex-col items-center justify-center"
      >
        {/* Ultra-light label — weight 100 for contrast */}
        <p
          className="text-red-500 text-sm md:text-base tracking-[0.4em] mb-4 uppercase pointer-events-none"
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 200,
          }}
        >
          SYSTEM ALIVE // INITIALIZING
        </p>

        {/* Display name — weight 900 for maximum contrast */}
        <h1
          className="text-6xl md:text-8xl lg:text-[10rem] text-transparent bg-clip-text tracking-[-0.04em] leading-none pointer-events-none"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            backgroundImage:
              "linear-gradient(170deg, #ffffff 0%, #a0aec0 50%, #3a4a6b 100%)",
          }}
        >
          <ScrambleText text="ROHIT BIHAL" />
        </h1>

        {/* Subtitle — weight 100 for extreme contrast with the name above */}
        <div
          className="mt-6 flex items-center gap-4 text-neutral-400 text-xs md:text-sm uppercase tracking-[0.35em] pointer-events-none"
          style={{ fontFamily: "var(--font-mono)", fontWeight: 100 }}
        >
          <span>Cybersecurity Aspirant</span>
          <span className="text-red-500 text-base" aria-hidden="true">·</span>
          <span>AI-Augmented Developer</span>
        </div>

        {/* Magnetic CTA button */}
        <motion.button
          onClick={scrollToContact}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setCtaHover(true)}
          onMouseLeave={handleMouseLeave}
          style={{ x: springX, y: springY }}
          className="mt-12 relative px-8 py-3 border border-red-500/40 bg-transparent text-red-400 text-xs tracking-[0.3em] uppercase cursor-pointer transition-all duration-300 rounded-sm"
          whileHover={{
            borderColor: "rgba(239,68,68,0.8)",
            color: "#ffffff",
          }}
          whileTap={{ scale: 0.96 }}
        >
          <span style={{ fontFamily: "var(--font-mono)", fontWeight: 400 }}>
            INITIATE CONTACT
          </span>
          {/* Glow effect on hover */}
          <motion.div
            className="absolute inset-0 rounded-sm pointer-events-none"
            animate={{
              boxShadow: ctaHover
                ? "0 0 25px rgba(239,68,68,0.4), 0 0 50px rgba(239,68,68,0.15)"
                : "0 0 0px rgba(239,68,68,0)",
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </motion.div>

      {/* Film-grain overlay */}
      <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.12] mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </div>
    </div>
  );
}
