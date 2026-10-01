"use client";

import React, { useState } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { PortfolioData, ProjectItem, ExperienceItem, EducationItem, CertificateItem } from "@/types/portfolio";
import {
  X,
  Lock,
  Save,
  Plus,
  Trash2,
  RotateCcw,
  Download,
  Upload,
  User,
  Info,
  Cpu,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Award,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  MessageSquare
} from "lucide-react";
import { ContactMessage } from "@/app/api/messages/route";

const FileUploadInput: React.FC<{
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  buttonText?: string;
}> = ({ label, value, onChange, accept = "image/*", buttonText = "Browse PC" }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          onChange(data.url);
        }
      } else {
        alert("Upload failed. Please try again.");
      }
    } catch (err) {
      alert("Error uploading file.");
    } finally {
      setUploading(false);
    }
  };

  const isImage = value && (value.match(/\.(jpeg|jpg|gif|png|webp|svg)/i) || value.startsWith("data:image"));

  return (
    <div>
      <label className="block text-xs font-semibold text-neutral-400 mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste URL or upload file from PC..."
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
        />
        <label className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-cyan-950 border border-cyan-800/80 text-cyan-300 hover:bg-cyan-900 text-xs font-semibold cursor-pointer shrink-0 transition-colors">
          <Upload className="w-4 h-4" />
          {uploading ? "Uploading..." : buttonText}
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>
      {value && (
        <div className="mt-2 flex items-center gap-2 text-xs text-neutral-400">
          <span className="text-neutral-500">Linked:</span>
          {isImage ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={value} alt="Preview" className="w-8 h-8 rounded-lg object-cover border border-neutral-800" />
          ) : (
            <Download className="w-4 h-4 text-cyan-400" />
          )}
          <span className="truncate max-w-xs text-cyan-400 font-mono">{value}</span>
        </div>
      )}
    </div>
  );
};

export const AdminPanel: React.FC = () => {
  const {
    data,
    updateData,
    resetToDefaultData,
    isAdminOpen,
    setIsAdminOpen,
    isAuthenticated,
    setIsAuthenticated
  } = usePortfolio();

  const [passcodeInput, setPasscodeInput] = useState("");
  const [authError, setAuthError] = useState(false);

  // New Password Change State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passChangeSuccess, setPassChangeSuccess] = useState(false);
  const [passChangeError, setPassChangeError] = useState("");

  // Contact Messages State
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages");
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // Tabs: hero, about, skills, projects, experience, education, certificates, contact, messages, settings
  const [activeTab, setActiveTab] = useState<
    "hero" | "about" | "skills" | "projects" | "experience" | "education" | "certificates" | "contact" | "messages" | "settings"
  >("hero");

  // Local draft state for editing
  const [formData, setFormData] = useState<PortfolioData>(data);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync draft data when modal opens
  React.useEffect(() => {
    if (isAdminOpen) {
      setFormData(data);
      fetchMessages();
    }
  }, [isAdminOpen, data]);

  if (!isAdminOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPasscode = data.adminPasscode || "admin123";
    if (passcodeInput === correctPasscode) {
      setIsAuthenticated(true);
      setAuthError(false);
      setPasscodeInput("");
    } else {
      setAuthError(true);
    }
  };

  const handleSaveAll = async () => {
    const success = await updateData(formData);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleResetData = async () => {
    if (confirm("Are you sure you want to reset all portfolio content to default seed data?")) {
      await resetToDefaultData();
      setFormData(data);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleExportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(formData, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", `portfolio_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && parsed.hero) {
            setFormData(parsed);
            alert("JSON backup loaded into editor! Click 'Save All Changes' to apply.");
          } else {
            alert("Invalid portfolio JSON format.");
          }
        } catch (err) {
          alert("Could not parse JSON file.");
        }
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/80">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-none">Portfolio Admin Panel</h2>
              <p className="text-xs text-neutral-400 mt-0.5">Modify any section of your portfolio live</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={handleSaveAll}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold text-xs transition-all shadow-md shadow-cyan-500/20"
              >
                <Save className="w-4 h-4" />
                Save All Changes
              </button>
            )}
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 rounded-full bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Save Toast Banner */}
        {saveSuccess && (
          <div className="bg-cyan-950 border-b border-cyan-800 px-6 py-2.5 text-cyan-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            Portfolio data saved successfully! Changes are updated live on the site.
          </div>
        )}

        {/* Auth Locked View */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center my-auto">
            <div className="w-16 h-16 rounded-2xl bg-neutral-950 border border-neutral-800 text-cyan-400 flex items-center justify-center mb-6 shadow-xl">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white">Admin Authentication</h3>
            <p className="text-neutral-400 text-sm max-w-md mt-2 mb-6">
              Enter your admin passcode to access section management and content editor. (Default: <code className="text-cyan-400">admin123</code>)
            </p>

            <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Enter passcode..."
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 text-center font-mono text-sm"
                />
                {authError && (
                  <p className="text-red-400 text-xs mt-2 flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Incorrect passcode. Default is &apos;admin123&apos;.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-cyan-500 text-white font-semibold text-sm hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/25"
              >
                Unlock Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Content Editor */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Tabs */}
            <div className="w-full md:w-64 bg-neutral-950/80 border-r border-neutral-800 p-3 flex md:flex-col gap-1 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab("hero")}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === "hero"
                    ? "bg-cyan-500/15 border border-cyan-500/40 text-cyan-300"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                }`}
              >
                <User className="w-4 h-4" />
                Hero Section
              </button>

              <button
                onClick={() => setActiveTab("about")}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === "about"
                    ? "bg-cyan-500/15 border border-cyan-500/40 text-cyan-300"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                }`}
              >
                <Info className="w-4 h-4" />
                About & Stats
              </button>

              <button
                onClick={() => setActiveTab("skills")}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === "skills"
                    ? "bg-cyan-500/15 border border-cyan-500/40 text-cyan-300"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                }`}
              >
                <Cpu className="w-4 h-4" />
                Skills Categories
              </button>

              <button
                onClick={() => setActiveTab("projects")}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === "projects"
                    ? "bg-cyan-500/15 border border-cyan-500/40 text-cyan-300"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                }`}
              >
                <FolderGit2 className="w-4 h-4" />
                Projects ({formData.projects.length})
              </button>

              <button
                onClick={() => setActiveTab("experience")}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === "experience"
                    ? "bg-cyan-500/15 border border-cyan-500/40 text-cyan-300"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                }`}
              >
                <Briefcase className="w-4 h-4" />
                Experience ({formData.experience.length})
              </button>

              <button
                onClick={() => setActiveTab("education")}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === "education"
                    ? "bg-cyan-500/15 border border-cyan-500/40 text-cyan-300"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                Education ({formData.education.length})
              </button>

              <button
                onClick={() => setActiveTab("certificates")}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === "certificates"
                    ? "bg-cyan-500/15 border border-cyan-500/40 text-cyan-300"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                }`}
              >
                <Award className="w-4 h-4" />
                Certificates ({formData.certificates.length})
              </button>

              <button
                onClick={() => setActiveTab("contact")}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === "contact"
                    ? "bg-cyan-500/15 border border-cyan-500/40 text-cyan-300"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                }`}
              >
                <Mail className="w-4 h-4" />
                Contact Info
              </button>

              <button
                onClick={() => {
                  setActiveTab("messages");
                  fetchMessages();
                }}
                className={`w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === "messages"
                    ? "bg-cyan-500/15 border border-cyan-500/40 text-cyan-300"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  Inbox / Messages
                </div>
                {messages.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 text-[10px] font-extrabold">
                    {messages.length}
                  </span>
                )}
              </button>

              <div className="md:mt-auto pt-2 border-t border-neutral-800">
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    activeTab === "settings"
                      ? "bg-purple-500/15 border border-purple-500/40 text-purple-300"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  Backup & Passcode
                </button>
              </div>
            </div>

            {/* Tab Editor Main Panel */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              
              {/* TAB 1: HERO SECTION */}
              {activeTab === "hero" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white">Edit Hero Section</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.hero.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hero: { ...formData.hero, name: e.target.value }
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 mb-1">
                        Professional Title
                      </label>
                      <input
                        type="text"
                        value={formData.hero.title}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hero: { ...formData.hero, title: e.target.value }
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 mb-1">
                      Hero Subtitle / Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.hero.subtitle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, subtitle: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <FileUploadInput
                        label="Avatar Profile Image (URL or PC File)"
                        value={formData.hero.avatar}
                        onChange={(url) =>
                          setFormData({
                            ...formData,
                            hero: { ...formData.hero, avatar: url }
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 mb-1">
                        Availability Status Pill
                      </label>
                      <input
                        type="text"
                        value={formData.hero.status}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hero: { ...formData.hero, status: e.target.value }
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <FileUploadInput
                        label="Resume / CV Document (PDF, DOCX, or URL)"
                        value={formData.hero.resumeUrl}
                        accept=".pdf,.doc,.docx,application/pdf"
                        buttonText="Upload CV from PC"
                        onChange={(url) =>
                          setFormData({
                            ...formData,
                            hero: { ...formData.hero, resumeUrl: url }
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 mb-1">
                        LinkedIn Profile URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://linkedin.com/in/username"
                        value={formData.hero.linkedin || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hero: { ...formData.hero, linkedin: e.target.value },
                            contact: {
                              ...formData.contact,
                              socials: { ...formData.contact.socials, linkedin: e.target.value }
                            }
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 mb-1">
                        GitHub Profile URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://github.com/username"
                        value={formData.hero.github || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hero: { ...formData.hero, github: e.target.value },
                            contact: {
                              ...formData.contact,
                              socials: { ...formData.contact.socials, github: e.target.value }
                            }
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 mb-1">
                        Twitter / X Profile URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://twitter.com/username"
                        value={formData.hero.twitter || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hero: { ...formData.hero, twitter: e.target.value },
                            contact: {
                              ...formData.contact,
                              socials: { ...formData.contact.socials, twitter: e.target.value }
                            }
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 mb-1">
                      Primary Contact Email
                    </label>
                    <input
                      type="text"
                      value={formData.contact.email || formData.hero.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, email: e.target.value },
                          contact: { ...formData.contact, email: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: ABOUT SECTION */}
              {activeTab === "about" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white">Edit About Section</h3>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 mb-1">
                      Biography Text
                    </label>
                    <textarea
                      rows={5}
                      value={formData.about.bio}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          about: { ...formData.about, bio: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
                    />
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                      Highlight Stats Cards
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {formData.about.stats.map((st, idx) => (
                        <div key={idx} className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl flex gap-2">
                          <input
                            type="text"
                            value={st.label}
                            onChange={(e) => {
                              const newStats = [...formData.about.stats];
                              newStats[idx].label = e.target.value;
                              setFormData({ ...formData, about: { ...formData.about, stats: newStats } });
                            }}
                            className="flex-1 px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white"
                          />
                          <input
                            type="text"
                            value={st.value}
                            onChange={(e) => {
                              const newStats = [...formData.about.stats];
                              newStats[idx].value = e.target.value;
                              setFormData({ ...formData, about: { ...formData.about, stats: newStats } });
                            }}
                            className="w-20 px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-cyan-400 font-bold"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SKILLS SECTION */}
              {activeTab === "skills" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Manage Skill Categories</h3>
                    <button
                      onClick={() => {
                        setFormData({
                          ...formData,
                          skills: [
                            ...formData.skills,
                            { category: "New Category", items: [{ name: "New Skill", level: "Advanced" }] }
                          ]
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 border border-neutral-700 text-cyan-400 text-xs font-semibold rounded-lg hover:bg-neutral-700"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Category
                    </button>
                  </div>

                  {formData.skills.map((cat, catIdx) => (
                    <div key={catIdx} className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={cat.category}
                          onChange={(e) => {
                            const updated = [...formData.skills];
                            updated[catIdx].category = e.target.value;
                            setFormData({ ...formData, skills: updated });
                          }}
                          className="px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-sm font-bold text-white"
                        />
                        <button
                          onClick={() => {
                            const updated = formData.skills.filter((_, i) => i !== catIdx);
                            setFormData({ ...formData, skills: updated });
                          }}
                          className="p-1.5 text-red-400 hover:bg-neutral-900 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {cat.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => {
                                const updated = [...formData.skills];
                                updated[catIdx].items[itemIdx].name = e.target.value;
                                setFormData({ ...formData, skills: updated });
                              }}
                              className="flex-1 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white"
                            />
                            <select
                              value={item.level}
                              onChange={(e) => {
                                const updated = [...formData.skills];
                                updated[catIdx].items[itemIdx].level = e.target.value;
                                setFormData({ ...formData, skills: updated });
                              }}
                              className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-cyan-300"
                            >
                              <option value="Expert">Expert</option>
                              <option value="Advanced">Advanced</option>
                              <option value="Intermediate">Intermediate</option>
                            </select>
                            <button
                              onClick={() => {
                                const updated = [...formData.skills];
                                updated[catIdx].items = updated[catIdx].items.filter((_, i) => i !== itemIdx);
                                setFormData({ ...formData, skills: updated });
                              }}
                              className="p-1 text-neutral-400 hover:text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}

                        <button
                          onClick={() => {
                            const updated = [...formData.skills];
                            updated[catIdx].items.push({ name: "New Skill", level: "Advanced" });
                            setFormData({ ...formData, skills: updated });
                          }}
                          className="mt-2 text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add Skill Item
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: PROJECTS SECTION */}
              {activeTab === "projects" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Manage Projects</h3>
                    <button
                      onClick={() => {
                        const newProj: ProjectItem = {
                          id: `proj-${Date.now()}`,
                          title: "New Project",
                          description: "Project description goes here...",
                          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
                          category: "Full-Stack",
                          tags: ["React", "Node.js"],
                          liveUrl: "#",
                          githubUrl: "#",
                          featured: false
                        };
                        setFormData({ ...formData, projects: [newProj, ...formData.projects] });
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-cyan-500 text-white text-xs font-semibold rounded-xl hover:bg-cyan-400"
                    >
                      <Plus className="w-4 h-4" />
                      Add New Project
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.projects.map((proj, pIdx) => (
                      <div key={proj.id} className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => {
                              const updated = [...formData.projects];
                              updated[pIdx].title = e.target.value;
                              setFormData({ ...formData, projects: updated });
                            }}
                            className="px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-sm font-bold text-white flex-1"
                          />
                          <label className="flex items-center gap-1.5 text-xs text-cyan-400 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={proj.featured}
                              onChange={(e) => {
                                const updated = [...formData.projects];
                                updated[pIdx].featured = e.target.checked;
                                setFormData({ ...formData, projects: updated });
                              }}
                            />
                            Featured
                          </label>
                          <button
                            onClick={() => {
                              const updated = formData.projects.filter((_, i) => i !== pIdx);
                              setFormData({ ...formData, projects: updated });
                            }}
                            className="p-1.5 text-red-400 hover:bg-neutral-900 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-400 mb-1">Description</label>
                          <textarea
                            rows={2}
                            value={proj.description}
                            onChange={(e) => {
                              const updated = [...formData.projects];
                              updated[pIdx].description = e.target.value;
                              setFormData({ ...formData, projects: updated });
                            }}
                            className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-neutral-400 mb-1">Category</label>
                            <input
                              type="text"
                              value={proj.category}
                              onChange={(e) => {
                                const updated = [...formData.projects];
                                updated[pIdx].category = e.target.value;
                                setFormData({ ...formData, projects: updated });
                              }}
                              className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white"
                            />
                          </div>
                          <div>
                            <FileUploadInput
                              label="Project Showcase Image (URL or PC File)"
                              value={proj.image}
                              onChange={(url) => {
                                const updated = [...formData.projects];
                                updated[pIdx].image = url;
                                setFormData({ ...formData, projects: updated });
                              }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-neutral-400 mb-1">Live URL</label>
                            <input
                              type="text"
                              value={proj.liveUrl}
                              onChange={(e) => {
                                const updated = [...formData.projects];
                                updated[pIdx].liveUrl = e.target.value;
                                setFormData({ ...formData, projects: updated });
                              }}
                              className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-400 mb-1">GitHub URL</label>
                            <input
                              type="text"
                              value={proj.githubUrl}
                              onChange={(e) => {
                                const updated = [...formData.projects];
                                updated[pIdx].githubUrl = e.target.value;
                                setFormData({ ...formData, projects: updated });
                              }}
                              className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-400 mb-1">Tags (Comma-separated)</label>
                          <input
                            type="text"
                            value={proj.tags.join(", ")}
                            onChange={(e) => {
                              const updated = [...formData.projects];
                              updated[pIdx].tags = e.target.value.split(",").map((t) => t.trim());
                              setFormData({ ...formData, projects: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: EXPERIENCE SECTION */}
              {activeTab === "experience" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Manage Work Experience</h3>
                    <button
                      onClick={() => {
                        const newExp: ExperienceItem = {
                          id: `exp-${Date.now()}`,
                          role: "Software Engineer",
                          company: "Company Name",
                          location: "Remote",
                          period: "2023 - Present",
                          description: "Key contributions and achievements..."
                        };
                        setFormData({ ...formData, experience: [newExp, ...formData.experience] });
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-cyan-500 text-white text-xs font-semibold rounded-xl hover:bg-cyan-400"
                    >
                      <Plus className="w-4 h-4" />
                      Add Experience
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.experience.map((exp, eIdx) => (
                      <div key={exp.id} className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => {
                              const updated = [...formData.experience];
                              updated[eIdx].role = e.target.value;
                              setFormData({ ...formData, experience: updated });
                            }}
                            className="px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-sm font-bold text-white flex-1"
                          />
                          <button
                            onClick={() => {
                              const updated = formData.experience.filter((_, i) => i !== eIdx);
                              setFormData({ ...formData, experience: updated });
                            }}
                            className="p-1.5 text-red-400 hover:bg-neutral-900 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-neutral-400 mb-1">Company</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => {
                                const updated = [...formData.experience];
                                updated[eIdx].company = e.target.value;
                                setFormData({ ...formData, experience: updated });
                              }}
                              className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-400 mb-1">Period</label>
                            <input
                              type="text"
                              value={exp.period}
                              onChange={(e) => {
                                const updated = [...formData.experience];
                                updated[eIdx].period = e.target.value;
                                setFormData({ ...formData, experience: updated });
                              }}
                              className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-400 mb-1">Location</label>
                            <input
                              type="text"
                              value={exp.location}
                              onChange={(e) => {
                                const updated = [...formData.experience];
                                updated[eIdx].location = e.target.value;
                                setFormData({ ...formData, experience: updated });
                              }}
                              className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-400 mb-1">Description</label>
                          <textarea
                            rows={3}
                            value={exp.description}
                            onChange={(e) => {
                              const updated = [...formData.experience];
                              updated[eIdx].description = e.target.value;
                              setFormData({ ...formData, experience: updated });
                            }}
                            className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: EDUCATION SECTION */}
              {activeTab === "education" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Manage Education</h3>
                    <button
                      onClick={() => {
                        const newEdu: EducationItem = {
                          id: `edu-${Date.now()}`,
                          degree: "Degree / Certification Title",
                          institution: "University / School Name",
                          period: "2020 - 2024",
                          grade: "GPA 3.8",
                          details: "Coursework and achievements..."
                        };
                        setFormData({ ...formData, education: [newEdu, ...formData.education] });
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-cyan-500 text-white text-xs font-semibold rounded-xl hover:bg-cyan-400"
                    >
                      <Plus className="w-4 h-4" />
                      Add Education
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.education.map((edu, edIdx) => (
                      <div key={edu.id} className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => {
                              const updated = [...formData.education];
                              updated[edIdx].degree = e.target.value;
                              setFormData({ ...formData, education: updated });
                            }}
                            className="px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-sm font-bold text-white flex-1"
                          />
                          <button
                            onClick={() => {
                              const updated = formData.education.filter((_, i) => i !== edIdx);
                              setFormData({ ...formData, education: updated });
                            }}
                            className="p-1.5 text-red-400 hover:bg-neutral-900 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-neutral-400 mb-1">Institution</label>
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => {
                                const updated = [...formData.education];
                                updated[edIdx].institution = e.target.value;
                                setFormData({ ...formData, education: updated });
                              }}
                              className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-400 mb-1">Period</label>
                            <input
                              type="text"
                              value={edu.period}
                              onChange={(e) => {
                                const updated = [...formData.education];
                                updated[edIdx].period = e.target.value;
                                setFormData({ ...formData, education: updated });
                              }}
                              className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-400 mb-1">Grade / Distinction</label>
                            <input
                              type="text"
                              value={edu.grade}
                              onChange={(e) => {
                                const updated = [...formData.education];
                                updated[edIdx].grade = e.target.value;
                                setFormData({ ...formData, education: updated });
                              }}
                              className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-400 mb-1">Details</label>
                          <textarea
                            rows={2}
                            value={edu.details}
                            onChange={(e) => {
                              const updated = [...formData.education];
                              updated[edIdx].details = e.target.value;
                              setFormData({ ...formData, education: updated });
                            }}
                            className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: CERTIFICATES SECTION */}
              {activeTab === "certificates" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Manage Certificates</h3>
                    <button
                      onClick={() => {
                        const newCert: CertificateItem = {
                          id: `cert-${Date.now()}`,
                          title: "New Certification Title",
                          issuer: "Organization Name",
                          date: "2023",
                          credentialUrl: "#",
                          badge: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=400&q=80"
                        };
                        setFormData({ ...formData, certificates: [newCert, ...formData.certificates] });
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-cyan-500 text-white text-xs font-semibold rounded-xl hover:bg-cyan-400"
                    >
                      <Plus className="w-4 h-4" />
                      Add Certificate
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.certificates.map((cert, cIdx) => (
                      <div key={cert.id} className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={cert.title}
                            onChange={(e) => {
                              const updated = [...formData.certificates];
                              updated[cIdx].title = e.target.value;
                              setFormData({ ...formData, certificates: updated });
                            }}
                            className="px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-sm font-bold text-white flex-1"
                          />
                          <button
                            onClick={() => {
                              const updated = formData.certificates.filter((_, i) => i !== cIdx);
                              setFormData({ ...formData, certificates: updated });
                            }}
                            className="p-1.5 text-red-400 hover:bg-neutral-900 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-neutral-400 mb-1">Issuer Organization</label>
                            <input
                              type="text"
                              value={cert.issuer}
                              onChange={(e) => {
                                const updated = [...formData.certificates];
                                updated[cIdx].issuer = e.target.value;
                                setFormData({ ...formData, certificates: updated });
                              }}
                              className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-400 mb-1">Issue Date / Year</label>
                            <input
                              type="text"
                              value={cert.date}
                              onChange={(e) => {
                                const updated = [...formData.certificates];
                                updated[cIdx].date = e.target.value;
                                setFormData({ ...formData, certificates: updated });
                              }}
                              className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-neutral-400 mb-1">Credential URL</label>
                            <input
                              type="text"
                              value={cert.credentialUrl}
                              onChange={(e) => {
                                const updated = [...formData.certificates];
                                updated[cIdx].credentialUrl = e.target.value;
                                setFormData({ ...formData, certificates: updated });
                              }}
                              className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white"
                            />
                          </div>
                          <div>
                            <FileUploadInput
                              label="Certificate Badge Image (URL or PC File)"
                              value={cert.badge}
                              onChange={(url) => {
                                const updated = [...formData.certificates];
                                updated[cIdx].badge = url;
                                setFormData({ ...formData, certificates: updated });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 8: CONTACT SECTION */}
              {activeTab === "contact" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white">Edit Contact Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 mb-1">Public Email</label>
                      <input
                        type="text"
                        value={formData.contact.email || formData.hero.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hero: { ...formData.hero, email: e.target.value },
                            contact: { ...formData.contact, email: e.target.value }
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={formData.contact.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contact: { ...formData.contact, phone: e.target.value }
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 mb-1">Location</label>
                      <input
                        type="text"
                        value={formData.contact.location}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contact: { ...formData.contact, location: e.target.value }
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 mb-1">Availability Note</label>
                      <input
                        type="text"
                        value={formData.contact.availability}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contact: { ...formData.contact, availability: e.target.value }
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 mb-1">
                        LinkedIn Profile URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://linkedin.com/in/username"
                        value={formData.hero.linkedin || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hero: { ...formData.hero, linkedin: e.target.value },
                            contact: {
                              ...formData.contact,
                              socials: { ...formData.contact.socials, linkedin: e.target.value }
                            }
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 mb-1">
                        GitHub Profile URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://github.com/username"
                        value={formData.hero.github || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hero: { ...formData.hero, github: e.target.value },
                            contact: {
                              ...formData.contact,
                              socials: { ...formData.contact.socials, github: e.target.value }
                            }
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 mb-1">
                        Twitter / X Profile URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://twitter.com/username"
                        value={formData.hero.twitter || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hero: { ...formData.hero, twitter: e.target.value },
                            contact: {
                              ...formData.contact,
                              socials: { ...formData.contact.socials, twitter: e.target.value }
                            }
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 10: INBOX / MESSAGES */}
              {activeTab === "messages" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">Visitor Messages & Inquiries</h3>
                      <p className="text-xs text-neutral-400">
                        Messages sent by visitors through your website contact form.
                      </p>
                    </div>

                    {messages.length > 0 && (
                      <button
                        onClick={async () => {
                          if (confirm("Are you sure you want to clear all messages?")) {
                            await fetch("/api/messages", { method: "DELETE" });
                            setMessages([]);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-950/60 border border-red-800 text-red-300 text-xs font-semibold rounded-xl hover:bg-red-900"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Clear All
                      </button>
                    )}
                  </div>

                  {messages.length === 0 ? (
                    <div className="py-16 flex flex-col items-center justify-center text-center space-y-3 bg-neutral-950 border border-neutral-800 rounded-2xl">
                      <MessageSquare className="w-12 h-12 text-neutral-600" />
                      <h4 className="text-base font-bold text-neutral-300">No Messages Yet</h4>
                      <p className="text-xs text-neutral-500 max-w-sm">
                        When visitors send you a message from the Contact section, they will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className="p-5 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-3 shadow-md"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-base">{msg.name}</span>
                                <a
                                  href={`mailto:${msg.email}`}
                                  className="text-xs text-cyan-400 hover:underline"
                                >
                                  ({msg.email})
                                </a>
                              </div>
                              <h5 className="text-xs font-semibold text-neutral-400 mt-0.5">
                                Subject: <span className="text-neutral-200">{msg.subject}</span>
                              </h5>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-[11px] text-neutral-500">{msg.timestamp}</span>
                              <button
                                onClick={async () => {
                                  await fetch(`/api/messages?id=${msg.id}`, { method: "DELETE" });
                                  setMessages(messages.filter((m) => m.id !== msg.id));
                                }}
                                className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-900 rounded-lg transition-colors"
                                title="Delete Message"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <p className="text-sm text-neutral-300 whitespace-pre-wrap leading-relaxed">
                            {msg.message}
                          </p>

                          <div className="pt-2 flex items-center gap-3">
                            <a
                              href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-semibold rounded-xl hover:bg-cyan-900 transition-colors"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              Reply via Email
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 9: SETTINGS & BACKUP */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white">Security & Backup Operations</h3>

                  {/* Change Admin Password Card */}
                  <div className="p-5 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-cyan-400" />
                      <h4 className="text-sm font-bold text-white">Change Admin Password</h4>
                    </div>

                    {passChangeSuccess && (
                      <div className="p-3 bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs font-semibold rounded-xl flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                        Admin password updated successfully! Click &quot;Save All Changes&quot; to apply to file storage.
                      </div>
                    )}

                    {passChangeError && (
                      <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 text-xs font-semibold rounded-xl flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                        {passChangeError}
                      </div>
                    )}

                    <div className="space-y-3 max-w-md">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-400 mb-1">Current Password</label>
                        <input
                          type="text"
                          readOnly
                          value={formData.adminPasscode || "admin123"}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">New Admin Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter new password..."
                            value={newPassword}
                            onChange={(e) => {
                              setNewPassword(e.target.value);
                              setPassChangeError("");
                            }}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-mono text-sm pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">Confirm New Password</label>
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Re-enter new password..."
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setPassChangeError("");
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-mono text-sm"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={async () => {
                          if (!newPassword || newPassword.trim().length < 3) {
                            setPassChangeError("Password must be at least 3 characters long.");
                            return;
                          }
                          if (newPassword !== confirmPassword) {
                            setPassChangeError("New passwords do not match.");
                            return;
                          }

                          const updated = { ...formData, adminPasscode: newPassword.trim() };
                          setFormData(updated);
                          const success = await updateData(updated);
                          if (success) {
                            setPassChangeSuccess(true);
                            setNewPassword("");
                            setConfirmPassword("");
                            setTimeout(() => setPassChangeSuccess(false), 4000);
                          }
                        }}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold text-xs transition-all shadow-md shadow-cyan-500/20"
                      >
                        Update Admin Password
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-4">
                    <h4 className="text-sm font-bold text-white">Backup & Data Transfer</h4>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={handleExportJSON}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-xs font-semibold hover:bg-neutral-700"
                      >
                        <Download className="w-4 h-4 text-cyan-400" />
                        Export JSON Backup
                      </button>

                      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-xs font-semibold hover:bg-neutral-700 cursor-pointer">
                        <Upload className="w-4 h-4 text-purple-400" />
                        Import JSON Backup
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportJSON}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="p-4 bg-red-950/20 border border-red-900/40 rounded-2xl space-y-3">
                    <h4 className="text-sm font-bold text-red-400">Reset to Defaults</h4>
                    <p className="text-xs text-neutral-400">
                      Reset all portfolio data back to the default initial seed state.
                    </p>
                    <button
                      onClick={handleResetData}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-950 border border-red-800 text-red-300 text-xs font-semibold hover:bg-red-900"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset All Content
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
};
