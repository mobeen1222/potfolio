"use client";

import React from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { Briefcase, Calendar, MapPin, Building2 } from "lucide-react";

export const ExperienceSection: React.FC = () => {
  const { data } = usePortfolio();
  const { experience } = data;

  return (
    <section id="experience" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            Career History
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Work Experience
          </h2>
          <p className="mt-3 text-neutral-400 text-base">
            My professional journey across tech companies and collaborative engineering teams.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative max-w-4xl mx-auto pl-6 sm:pl-8 border-l-2 border-neutral-800 space-y-12">
          {experience.map((exp, idx) => (
            <div key={exp.id || idx} className="relative group">
              {/* Timeline Dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-neutral-950 border-2 border-cyan-500 group-hover:bg-cyan-400 group-hover:scale-125 transition-all duration-300 flex items-center justify-center shadow-md shadow-cyan-500/30">
                <div className="w-2 h-2 rounded-full bg-cyan-400 group-hover:bg-neutral-950" />
              </div>

              {/* Experience Card */}
              <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800/90 p-6 sm:p-8 shadow-xl group-hover:border-cyan-500/40 transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {exp.role}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 mt-1.5 text-sm text-neutral-400">
                      <span className="flex items-center gap-1.5 font-medium text-neutral-200">
                        <Building2 className="w-4 h-4 text-cyan-400" />
                        {exp.company}
                      </span>
                      {exp.location && (
                        <span className="flex items-center gap-1 text-xs text-neutral-400">
                          <MapPin className="w-3.5 h-3.5" />
                          {exp.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-cyan-300 text-xs font-semibold self-start sm:self-auto">
                    <Calendar className="w-3.5 h-3.5" />
                    {exp.period}
                  </span>
                </div>

                <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
