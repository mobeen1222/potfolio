"use client";

import React from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { User, CheckCircle2, Award, Briefcase, Code, Sparkles, Download } from "lucide-react";

export const AboutSection: React.FC = () => {
  const { data } = usePortfolio();
  const { about, hero } = data;

  return (
    <section id="about" className="py-20 relative bg-neutral-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <User className="w-3.5 h-3.5" />
            About Me
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Passionate About Crafting Exceptional Digital Experiences
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Bio & Bullet Points */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h3 className="text-2xl font-bold text-neutral-100 flex items-center gap-2">
              Who I Am
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </h3>

            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
              {about.bio}
            </p>

            {/* Highlights List */}
            {about.highlights && about.highlights.length > 0 && (
              <div className="mt-2 space-y-3">
                <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">
                  Core Competencies & Principles
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {about.highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-colors"
                    >
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-neutral-200">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CV Button */}
            {hero.resumeUrl && hero.resumeUrl !== "#" && (
              <div className="mt-4">
                <a
                  href={hero.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-sm hover:from-cyan-400 hover:to-indigo-500 transition-all shadow-md shadow-cyan-500/20"
                >
                  <Download className="w-4 h-4" />
                  Download Full CV / Resume
                </a>
              </div>
            )}
          </div>

          {/* Stats Cards Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {about.stats.map((stat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800/90 hover:border-cyan-500/40 hover:bg-neutral-850 transition-all duration-300 flex flex-col items-center justify-center text-center group shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  {idx === 0 ? (
                    <Briefcase className="w-6 h-6" />
                  ) : idx === 1 ? (
                    <Code className="w-6 h-6" />
                  ) : idx === 2 ? (
                    <User className="w-6 h-6" />
                  ) : (
                    <Award className="w-6 h-6" />
                  )}
                </div>
                <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight group-hover:text-cyan-400 transition-colors">
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm font-medium text-neutral-400 mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
