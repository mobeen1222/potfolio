"use client";

import React, { useState } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { ProjectItem } from "@/types/portfolio";
import { FolderGit2, ExternalLink, Star, X, Layers } from "lucide-react";

export const ProjectsSection: React.FC = () => {
  const { data } = usePortfolio();
  const { projects } = data;
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);

  // Extract unique categories
  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="projects" className="py-20 relative bg-neutral-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <FolderGit2 className="w-3.5 h-3.5" />
            My Portfolio
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Featured Projects & Works
          </h2>
          <p className="mt-3 text-neutral-400 text-base">
            Explore some of my recent web applications, tools, and digital solutions.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedCategory === cat
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/25"
                  : "bg-neutral-900 border border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="rounded-2xl bg-neutral-900/90 border border-neutral-800 overflow-hidden shadow-xl hover:border-cyan-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
              onClick={() => setActiveProject(proj)}
            >
              {/* Project Image */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-neutral-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {proj.featured && (
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/90 backdrop-blur-md border border-cyan-500/50 text-cyan-300 text-xs font-semibold shadow-md">
                    <Star className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                    Featured
                  </div>
                )}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-neutral-900/90 backdrop-blur-md border border-neutral-700 text-neutral-300 text-xs font-semibold">
                  {proj.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {proj.title}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-400 line-clamp-3 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div className="mt-6">
                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {proj.tags.map((tag, tagIdx) => (
                      <span
                        key={tagIdx}
                        className="px-2.5 py-0.5 rounded-md bg-neutral-800/80 border border-neutral-700/60 text-neutral-300 text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-3 pt-4 border-t border-neutral-800" onClick={(e) => e.stopPropagation()}>
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:underline"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Live Demo
                      </a>
                    )}

                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Project Detail Modal */}
        {activeProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              {/* Modal Image */}
              <div className="relative h-64 sm:h-72 w-full bg-neutral-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeProject.image}
                  alt={activeProject.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setActiveProject(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-neutral-950/80 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-2xl font-bold text-white">{activeProject.title}</h3>
                  <span className="px-3 py-1 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-semibold">
                    {activeProject.category}
                  </span>
                </div>

                <p className="text-neutral-300 text-base leading-relaxed">
                  {activeProject.description}
                </p>

                <div>
                  <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                    Technologies Used
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Modal Footer Links */}
                <div className="pt-4 border-t border-neutral-800 flex items-center gap-4">
                  {activeProject.liveUrl && (
                    <a
                      href={activeProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-white text-sm font-semibold hover:bg-cyan-400 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit Live Site
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
