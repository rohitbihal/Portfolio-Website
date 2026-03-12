"use client";

import { Github, Linkedin, Mail, ArrowUp } from "lucide-react";

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/rohitbihal",
    icon: Github,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/rohit-bihal",
    icon: Linkedin,
  },
  {
    label: "Email",
    href: "mailto:rohitbihal333@gmail.com",
    icon: Mail,
  },
];

const NAV = [
  { label: "Profile", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Vault", href: "#vault" },
  { label: "Timeline", href: "#timeline" },
  { label: "Certs", href: "#certifications" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      className="relative w-full border-t border-[#1e3a8a]/20"
      style={{ background: "#030303" }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <h4
              className="text-white text-lg mb-3"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
            >
              ROHIT BIHAL
            </h4>
            <p
              className="text-sm text-neutral-500 leading-relaxed max-w-xs"
              style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}
            >
              Cybersecurity Aspirant & AI-Augmented Developer. Building at the
              intersection of security and creation.
            </p>
          </div>

          {/* Quick Nav */}
          <div>
            <p
              className="text-[10px] text-neutral-600 tracking-[0.3em] uppercase mb-4"
              style={{ fontFamily: "var(--font-mono)", fontWeight: 200 }}
            >
              NAVIGATION
            </p>
            <div className="grid grid-cols-2 gap-2">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNav(e, item.href)}
                  className="text-sm text-neutral-500 hover:text-white transition-colors"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontWeight: 300,
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Socials */}
          <div>
            <p
              className="text-[10px] text-neutral-600 tracking-[0.3em] uppercase mb-4"
              style={{ fontFamily: "var(--font-mono)", fontWeight: 200 }}
            >
              CHANNELS
            </p>
            <div className="flex gap-4">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  {...(social.href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                  className="group flex items-center justify-center w-10 h-10 rounded-full border border-neutral-800 bg-neutral-900/50 hover:border-red-500/50 hover:bg-red-500/10 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 text-neutral-500 group-hover:text-red-400 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#1e3a8a]/30 to-transparent mb-6" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-[11px] text-neutral-600"
            style={{ fontFamily: "var(--font-mono)", fontWeight: 200 }}
          >
            © {new Date().getFullYear()} ROHIT BIHAL. ALL RIGHTS RESERVED.
          </p>
          <p
            className="text-[11px] text-neutral-700"
            style={{ fontFamily: "var(--font-mono)", fontWeight: 200 }}
          >
            BUILT WITH <span className="text-red-500">♥</span> AND AI
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-[11px] text-neutral-600 hover:text-white transition-colors group cursor-pointer"
            style={{ fontFamily: "var(--font-mono)", fontWeight: 300 }}
          >
            BACK TO TOP
            <ArrowUp className="w-3 h-3 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
