import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import ActiveLog from "@/components/ActiveLog";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import EasterEgg from "@/components/EasterEgg";
import LoadingScreen from "@/components/LoadingScreen";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "700", "800"],
});

export const metadata: Metadata = {
  title: "Rohit Bihal | Portfolio | Cyber & AI Building",
  description: "Building at the speed of thought. Cybersecurity aspirant and AI-augmented developer who prioritizes logic and architecture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased selection:bg-red-500/30 selection:text-red-200`}
      >
        <LoadingScreen />
        <CustomCursor />
        <EasterEgg />
        <SmoothScroll>
          <Navbar />
          {children}
          <ActiveLog />
        </SmoothScroll>
      </body>
    </html>
  );
}
