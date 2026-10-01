"use client";

import React from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { Cpu, Code2, Database, Wrench, CheckCircle } from "lucide-react";

export const SkillsSection: React.FC = () => {
  const { data } = usePortfolio();
  const { skills } = data;

  const getCategoryIcon = (category: string) => {
    const catLower = category.toLowerCase();
    if (catLower.includes("frontend")) return <Code2 className="w-5 h-5 text-cyan-400" />;
    if (catLower.includes("backend") || catLower.includes("database"))
      return <Database className="w-5 h-5 text-indigo-400" />;
    return <Wrench className="w-5 h-5 text-purple-400" />;
  };

  const getLevelBadgeColor = (level: string) => {
    const lvlLower = level.toLowerCase();
    if (lvlLower.includes("expert"))
      return "bg-cyan-950/80 text-cyan-300 border-cyan-800/80";
    if (lvlLower.includes("advanced"))
      return "bg-indigo-950/80 text-indigo-300 border-indigo-800/80";
    return "bg-purple-950/80 text-purple-300 border-purple-800/80";
  };

  return (
    <section id="skills" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Cpu className="w-3.5 h-3.5" />
            Skills & Expertise
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Technical Superpowers & Tools
          </h2>
          <p className="mt-3 text-neutral-400 text-base">
            Technologies and frameworks I utilize to transform ideas into scalable reality.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((cat, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-neutral-900/80 border border-neutral-800/90 p-6 shadow-xl hover:border-cyan-500/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Category Header */}
                <div className="flex items-center gap-3 pb-4 mb-5 border-b border-neutral-800">
                  <div className="p-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700/60">
                    {getCategoryIcon(cat.category)}
                  </div>
                  <h3 className="text-xl font-bold text-neutral-100">{cat.category}</h3>
                </div>

                {/* Skill Items */}
                <div className="space-y-3">
                  {cat.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="flex items-center justify-between p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/60 hover:bg-neutral-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="text-sm font-semibold text-neutral-200">
                          {item.name}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${getLevelBadgeColor(
                          item.level
                        )}`}
                      >
                        {item.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
