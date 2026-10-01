"use client";

import React from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { Mail, ArrowRight, Download, CheckCircle2 } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/SocialIcons";

export const HeroSection: React.FC = () => {
  const { data } = usePortfolio();
  const { hero, contact } = data;
  const userEmail = contact?.email || hero?.email;

  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Accent Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-purple-500/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-16">

          {/* Left Text Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Status Badge */}
            {hero.status && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-xs font-semibold mb-6 shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
                </span>
                {hero.status}
              </div>
            )}

            {/* Main Greeting & Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Hi, I&apos;m <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">{hero.name}</span>
            </h1>

            <h2 className="mt-4 text-xl sm:text-2xl font-semibold text-neutral-300">
              {hero.title}
            </h2>

            <p className="mt-6 text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {hero.subtitle}
            </p>

            {/* CTA Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-sm hover:from-cyan-400 hover:to-indigo-500 transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5"
              >
                View Projects
                <ArrowRight className="w-4 h-4" />
              </a>

              {hero.resumeUrl && hero.resumeUrl !== "#" ? (
                <a
                  href={hero.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-200 font-semibold text-sm hover:bg-neutral-800 hover:text-white hover:border-neutral-600 transition-all hover:-translate-y-0.5"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  Download CV
                </a>
              ) : (
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-200 font-semibold text-sm hover:bg-neutral-800 hover:text-white hover:border-neutral-600 transition-all hover:-translate-y-0.5"
                >
                  <Mail className="w-4 h-4 text-cyan-400" />
                  Contact Me
                </a>
              )}
            </div>

            {/* Social Links */}
            <div className="mt-10 flex items-center justify-center lg:justify-start gap-4 text-neutral-400">
              {hero.github && (
                <a
                  href={hero.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 hover:text-white hover:border-cyan-500/50 hover:bg-neutral-800 transition-all"
                  aria-label="GitHub"
                >
                  <GithubIcon className="w-5 h-5" />
                </a>
              )}
              {hero.linkedin && (
                <a
                  href={hero.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 hover:text-white hover:border-cyan-500/50 hover:bg-neutral-800 transition-all"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon className="w-5 h-5" />
                </a>
              )}
              {hero.twitter && (
                <a
                  href={hero.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 hover:text-white hover:border-cyan-500/50 hover:bg-neutral-800 transition-all"
                  aria-label="Twitter"
                >
                  <TwitterIcon className="w-5 h-5" />
                </a>
              )}
              {userEmail && (
                <a
                  href={`mailto:${userEmail}`}
                  className="p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 hover:text-white hover:border-cyan-500/50 hover:bg-neutral-800 transition-all"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Right Avatar Image */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 blur-lg opacity-50 group-hover:opacity-80 transition duration-500" />
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-3xl overflow-hidden border-2 border-neutral-700/80 bg-neutral-900 shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hero.avatar}
                alt={hero.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
