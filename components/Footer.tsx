"use client";

import React from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { ArrowUp, Mail, Shield } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/SocialIcons";

export const Footer: React.FC = () => {
  const { data, setIsAdminOpen } = usePortfolio();
  const { hero, contact } = data;
  const userEmail = contact?.email || hero?.email;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-neutral-950 border-t border-neutral-800/80 py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-neutral-800">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              {hero.name.charAt(0)}
            </div>
            <div>
              <span className="font-bold text-white text-base block">{hero.name}</span>
              <span className="text-xs text-neutral-400">{hero.title}</span>
            </div>
          </div>

          {/* Nav Quick Links */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-neutral-400">
            <a href="#home" className="hover:text-white transition-colors">Home</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#skills" className="hover:text-white transition-colors">Skills</a>
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
            <a href="#experience" className="hover:text-white transition-colors">Experience</a>
            <a href="#education" className="hover:text-white transition-colors">Education</a>
            <a href="#certificates" className="hover:text-white transition-colors">Certificates</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>

          {/* Socials & Admin */}
          <div className="flex items-center gap-3">
            {hero.github && (
              <a
                href={hero.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
                aria-label="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
            )}
            {hero.linkedin && (
              <a
                href={hero.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            )}
            {hero.twitter && (
              <a
                href={hero.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
                aria-label="Twitter"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
            )}
            {userEmail && (
              <a
                href={`mailto:${userEmail}`}
                className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}

            <button
              onClick={() => setIsAdminOpen(true)}
              className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-cyan-400 hover:bg-neutral-800 transition-colors"
              title="Admin Panel"
            >
              <Shield className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© {new Date().getFullYear()} {hero.name}. All rights reserved.</p>
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            Back to Top
            <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>
      </div>
    </footer>
  );
};
