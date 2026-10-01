"use client";

import React, { useState, useEffect } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { Menu, X, Shield, Sparkles } from "lucide-react";

export const Navbar: React.FC = () => {
  const { data, setIsAdminOpen } = usePortfolio();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Experience", href: "#experience" },
    { name: "Education", href: "#education" },
    { name: "Certificates", href: "#certificates" },
    { name: "Contact", href: "#contact" }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/60 shadow-xl py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <a href="#home" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            {data.hero.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
              {data.hero.name}
              <Sparkles className="w-4 h-4 text-cyan-400 opacity-80 group-hover:rotate-12 transition-transform" />
            </span>
            <span className="text-xs text-neutral-400 font-medium">Portfolio</span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-800/60 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setIsAdminOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-neutral-900 border border-neutral-700/70 text-cyan-400 hover:text-cyan-300 hover:bg-neutral-800 hover:border-cyan-500/50 transition-all shadow-sm"
            title="Open Admin Dashboard"
          >
            <Shield className="w-3.5 h-3.5" />
            Admin Panel
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setIsAdminOpen(true)}
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-cyan-400 hover:bg-neutral-800"
            title="Admin Panel"
          >
            <Shield className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200 hover:bg-neutral-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-950/95 backdrop-blur-xl border-b border-neutral-800 px-4 pt-3 pb-6 flex flex-col gap-2 mt-2 transition-all">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-lg text-base font-medium text-neutral-200 hover:bg-neutral-800 hover:text-cyan-400 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
