"use client";

import React from "react";
import { PortfolioProvider } from "@/context/PortfolioContext";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { SkillsSection } from "@/components/SkillsSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { EducationSection } from "@/components/EducationSection";
import { CertificatesSection } from "@/components/CertificatesSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { AdminPanel } from "@/components/AdminPanel";

export default function Home() {
  return (
    <PortfolioProvider>
      <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-cyan-500 selection:text-white">
        <Navbar />
        <main>
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          <ExperienceSection />
          <EducationSection />
          <CertificatesSection />
          <ContactSection />
        </main>
        <Footer />
        <AdminPanel />
      </div>
    </PortfolioProvider>
  );
}
