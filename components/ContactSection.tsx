"use client";

import React, { useState } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { Mail, Phone, MapPin, Send, Clock, CheckCircle2 } from "lucide-react";

export const ContactSection: React.FC = () => {
  const { data } = usePortfolio();
  const { contact } = data;
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      setFormSubmitted(true);
      setTimeout(() => {
        setFormData({ name: "", email: "", subject: "", message: "" });
        setFormSubmitted(false);
      }, 5000);
    } catch (err) {
      console.error("Error submitting contact message:", err);
      alert("Error sending message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 relative bg-neutral-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Mail className="w-3.5 h-3.5" />
            Connect With Me
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Get In Touch
          </h2>
          <p className="mt-3 text-neutral-400 text-base">
            Have a question, project proposal, or opportunity? Feel free to reach out!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Direct Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800/90 flex items-center gap-4 hover:border-cyan-500/40 transition-all">
              <div className="p-3.5 rounded-xl bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Direct Email
                </h4>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-base font-bold text-white hover:text-cyan-400 transition-colors"
                >
                  {contact.email}
                </a>
              </div>
            </div>

            {contact.phone && (
              <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800/90 flex items-center gap-4 hover:border-cyan-500/40 transition-all">
                <div className="p-3.5 rounded-xl bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Phone / Call
                  </h4>
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-base font-bold text-white hover:text-cyan-400 transition-colors"
                  >
                    {contact.phone}
                  </a>
                </div>
              </div>
            )}

            {contact.location && (
              <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800/90 flex items-center gap-4 hover:border-cyan-500/40 transition-all">
                <div className="p-3.5 rounded-xl bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Location
                  </h4>
                  <p className="text-base font-bold text-white">{contact.location}</p>
                </div>
              </div>
            )}

            {contact.availability && (
              <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800/90 flex items-center gap-4 hover:border-cyan-500/40 transition-all">
                <div className="p-3.5 rounded-xl bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Work Status
                  </h4>
                  <p className="text-base font-bold text-cyan-300">{contact.availability}</p>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Form */}
          <div className="lg:col-span-7 rounded-2xl bg-neutral-900/90 border border-neutral-800/90 p-6 sm:p-8 shadow-2xl">
            {formSubmitted ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-cyan-950 border border-cyan-500 text-cyan-400 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white">Message Sent Successfully!</h3>
                <p className="text-neutral-300 text-sm max-w-md">
                  Thank you for reaching out. I have received your submission and will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-xl font-bold text-white mb-2">Send Me a Message</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                      Your Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 transition-colors text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Project Inquiry / Job Opportunity"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 transition-colors text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Hi, I'd like to talk about..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 transition-colors text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-sm hover:from-cyan-400 hover:to-indigo-500 transition-all shadow-lg shadow-cyan-500/25"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
