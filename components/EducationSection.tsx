"use client";

import React from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { GraduationCap, Calendar, Award, BookOpen } from "lucide-react";

export const EducationSection: React.FC = () => {
  const { data } = usePortfolio();
  const { education } = data;

  return (
    <section id="education" className="py-20 relative bg-neutral-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            Learning & Credentials
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Education & Background
          </h2>
          <p className="mt-3 text-neutral-400 text-base">
            Academic degrees, bootcamps, and specialized tech training programs.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {education.map((edu, idx) => (
            <div
              key={edu.id || idx}
              className="rounded-2xl bg-neutral-900/90 border border-neutral-800/90 p-6 sm:p-8 shadow-xl hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 group-hover:scale-105 transition-transform">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    {edu.period}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {edu.degree}
                </h3>
                <h4 className="text-sm font-semibold text-neutral-300 mt-1 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  {edu.institution}
                </h4>

                {edu.grade && (
                  <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-neutral-800/80 border border-neutral-700/80 text-cyan-300 text-xs font-semibold">
                    <Award className="w-3.5 h-3.5 text-cyan-400" />
                    {edu.grade}
                  </div>
                )}

                <p className="mt-4 text-sm text-neutral-400 leading-relaxed">
                  {edu.details}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
