import Hero from "@/components/Hero";
import About from "@/components/About";
import SkillsRadar from "@/components/SkillsRadar";
import Showcase from "@/components/Showcase";
import Timeline from "@/components/Timeline";
import Certifications from "@/components/Certifications";
import ResumeDownload from "@/components/ResumeDownload";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-[#050505]">
      <Hero />
      <About />
      <SkillsRadar />
      <Showcase />
      <Timeline />
      <Certifications />
      <ResumeDownload />
      <Contact />
      <Footer />
    </main>
  );
}
