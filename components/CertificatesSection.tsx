"use client";

import React, { useState } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { CertificateItem } from "@/types/portfolio";
import { Award, ExternalLink, Calendar, ShieldCheck, X } from "lucide-react";

export const CertificatesSection: React.FC = () => {
  const { data } = usePortfolio();
  const { certificates } = data;
  const [activeCert, setActiveCert] = useState<CertificateItem | null>(null);

  return (
    <section id="certificates" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5" />
            Verified Skills
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Certificates & Licenses
          </h2>
          <p className="mt-3 text-neutral-400 text-base">
            Professional certifications and achievements earned from industry leaders.
          </p>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="rounded-2xl bg-neutral-900/90 border border-neutral-800/90 p-6 shadow-xl hover:border-cyan-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              onClick={() => setActiveCert(cert)}
            >
              <div>
                {/* Badge Image / Header */}
                <div className="flex items-center gap-4 mb-4">
                  {cert.badge ? (
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-700/80 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cert.badge}
                        alt={cert.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 flex items-center justify-center shrink-0">
                      <Award className="w-7 h-7" />
                    </div>
                  )}

                  <div>
                    <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified Badge
                    </span>
                    <h4 className="text-sm font-semibold text-neutral-300 mt-0.5">
                      {cert.issuer}
                    </h4>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug">
                  {cert.title}
                </h3>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  Issued {cert.date}
                </span>

                {cert.credentialUrl && cert.credentialUrl !== "#" && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:underline"
                  >
                    Credential
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Certificate Modal Preview */}
        {activeCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4">
              <button
                onClick={() => setActiveCert(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                {activeCert.badge && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-700 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeCert.badge}
                      alt={activeCert.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-white">{activeCert.title}</h3>
                  <p className="text-sm font-semibold text-cyan-400">{activeCert.issuer}</p>
                  <p className="text-xs text-neutral-400 mt-1">Issued: {activeCert.date}</p>
                </div>
              </div>

              {activeCert.credentialUrl && activeCert.credentialUrl !== "#" && (
                <div className="pt-4 border-t border-neutral-800">
                  <a
                    href={activeCert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-white text-sm font-semibold hover:bg-cyan-400 transition-colors w-full justify-center"
                  >
                    Verify Credential Online
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
