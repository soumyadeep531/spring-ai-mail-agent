import React, { useState, useEffect } from "react";
import { 
  Sparkles, FileText, Layers, Palette, ShieldAlert, Mail, ArrowLeft, 
  Plus, Trash2, Check, RefreshCw, Loader2, Download, CheckCircle, HelpCircle, AlertCircle
} from "lucide-react";
import { Resume, Experience, Education, Language, Certification, Award, ScoreData } from "../types";
import { ResumePreviewRenderer } from "./ResumeTemplates";

interface BuilderPageProps {
  initialResume: Resume;
  onBackToDashboard: () => void;
  onGoToCorrespondence: () => void;
}

// Accent Colors preset palette
const ACCENT_COLORS = [
  { name: "Teal", value: "#14b8a6" },
  { name: "Navy", value: "#1e3a8a" },
  { name: "Emerald", value: "#10b981" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Slate", value: "#475569" },
  { name: "Custom Purple", value: "#a855f7" }
];

export const BuilderPage: React.FC<BuilderPageProps> = ({ initialResume, onBackToDashboard, onGoToCorrespondence }) => {
  const [resume, setResume] = useState<Resume>(initialResume);
  const [activeTab, setActiveTab] = useState<"templates" | "sections" | "design" | "ats">("sections");
  const [saving, setSaving] = useState<boolean>(false);
  const [atsLoading, setAtsLoading] = useState<boolean>(false);
  const [atsData, setAtsData] = useState<ScoreData>({
    score: initialResume.score || 85,
    subScores: { completeness: 95, formatting: 80, keywords: 75 },
    suggestions: [
      {
        title: "Quantify your work metrics",
        description: "Add clear numbers (e.g., 'managed 8 designers', '25% increase in retention') to show measurable impact.",
        category: "keywords"
      },
      {
        title: "Replace weak verbs",
        description: "Replace expressions like 'worked on' or 'helped' with action-oriented verbiage like 'spearheaded'.",
        category: "formatting"
      }
    ]
  });

  // AI Summary local inputs
  const [aiSummaryLevel, setAiSummaryLevel] = useState<string>("Senior");
  const [summaryGenerating, setSummaryGenerating] = useState<boolean>(false);

  // AI Bullet Point helper state
  const [bulletPolishingId, setBulletPolishingId] = useState<string | null>(null);

  // AI Skills suggestion helpers
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [skillsLoading, setSkillsLoading] = useState<boolean>(false);
  const [newSkillInput, setNewSkillInput] = useState<string>("");

  // Autosave simulation
  useEffect(() => {
    setSaving(true);
    const timer = setTimeout(() => {
      setSaving(false);
      // Synchronize in-memory changes back to our Express server storage
      fetch(`/api/resumes/${resume.id}`, {
        method: "PATCH",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(resume)
      }).catch(err => console.error("Error autosaving resume:", err));
    }, 1200);

    return () => clearTimeout(timer);
  }, [resume]);

  // Handle manual ATS Scan
  const handleRunATSScan = async () => {
    setAtsLoading(true);
    try {
      const res = await fetch("/api/resume/score", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ resume })
      });
      if (res.ok) {
        const scoreResult = await res.json();
        setAtsData(scoreResult);
        // Sync overall score cache
        setResume(prev => ({ ...prev, score: scoreResult.score }));
      }
    } catch (err) {
      console.error("ATS Scan failed:", err);
    } finally {
      setAtsLoading(false);
    }
  };

  // Run ATS scan once when switching to ATS Checks view
  useEffect(() => {
    if (activeTab === "ats") {
      handleRunATSScan();
    }
  }, [activeTab]);

  // AI: Generate professional summary
  const handleGenerateSummary = async () => {
    setSummaryGenerating(true);
    try {
      const res = await fetch("/api/ai/summary", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          jobTitle: resume.personalInfo.jobTitle || "Product Designer",
          experienceLevel: aiSummaryLevel,
          keySkills: resume.skills
        })
      });
      if (res.ok) {
        const data = await res.json();
        setResume(prev => ({ ...prev, summary: data.summary }));
      }
    } catch (err) {
      console.error("Error generating summary:", err);
    } finally {
      setSummaryGenerating(false);
    }
  };

  // AI: Polish a bullet point
  const handlePolishBullet = async (expId: string, bulletIdx: number, currentText: string) => {
    setBulletPolishingId(`${expId}-${bulletIdx}`);
    try {
      const res = await fetch("/api/ai/bullet-point", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          roughText: currentText,
          roleContext: resume.personalInfo.jobTitle || "Professional"
        })
      });
      if (res.ok) {
        const data = await res.json();
        
        // Update specific bullet
        setResume(prev => {
          const updatedExp = prev.experience.map(exp => {
            if (exp.id === expId) {
              const updatedBullets = [...exp.bullets];
              updatedBullets[bulletIdx] = data.bullet;
              return { ...exp, bullets: updatedBullets };
            }
            return exp;
          });
          return { ...prev, experience: updatedExp };
        });
      }
    } catch (err) {
      console.error("Bullet polish failed:", err);
    } finally {
      setBulletPolishingId(null);
    }
  };

  // AI: Fetch skill recommendations
  const handleFetchSkillSuggestions = async () => {
    setSkillsLoading(true);
    try {
      const res = await fetch("/api/ai/skill-suggestions", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ jobTitle: resume.personalInfo.jobTitle || "Product Designer" })
      });
      if (res.ok) {
        const data = await res.json();
        setSuggestedSkills(data.skills || []);
      }
    } catch (err) {
      console.error("Skill suggestions failed:", err);
    } finally {
      setSkillsLoading(false);
    }
  };

  const handlePrintPDF = () => {
    window.print();
  };

  // ----------------------------------------------------------------------
  // MUTATORS (Updating resume sub-states with pristine React patterns)
  // ----------------------------------------------------------------------

  const updatePersonalInfo = (field: string, value: string) => {
    setResume(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  // Experience Repeatables
  const handleAddExperience = () => {
    const newExp: Experience = {
      id: "exp-" + Date.now().toString(36),
      company: "",
      role: "",
      startDate: "",
      endDate: "",
      current: false,
      bullets: [""]
    };
    setResume(prev => ({ ...prev, experience: [...prev.experience, newExp] }));
  };

  const handleUpdateExperience = (id: string, field: string, value: any) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }));
  };

  const handleRemoveExperience = (id: string) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const handleAddBullet = (expId: string) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map(exp => {
        if (exp.id === expId) {
          return { ...exp, bullets: [...exp.bullets, ""] };
        }
        return exp;
      })
    }));
  };

  const handleUpdateBullet = (expId: string, bulletIdx: number, value: string) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map(exp => {
        if (exp.id === expId) {
          const updated = [...exp.bullets];
          updated[bulletIdx] = value;
          return { ...exp, bullets: updated };
        }
        return exp;
      })
    }));
  };

  const handleRemoveBullet = (expId: string, bulletIdx: number) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map(exp => {
        if (exp.id === expId) {
          return { ...exp, bullets: exp.bullets.filter((_, idx) => idx !== bulletIdx) };
        }
        return exp;
      })
    }));
  };

  // Education Repeatables
  const handleAddEducation = () => {
    const newEdu: Education = {
      id: "edu-" + Date.now().toString(36),
      institution: "",
      degree: "",
      startDate: "",
      endDate: "",
      score: ""
    };
    setResume(prev => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const handleUpdateEducation = (id: string, field: string, value: string) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    }));
  };

  const handleRemoveEducation = (id: string) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  // Languages
  const handleAddLanguage = () => {
    const newLang: Language = {
      id: "lang-" + Date.now().toString(36),
      name: "",
      proficiency: "Native"
    };
    setResume(prev => ({ ...prev, languages: [...prev.languages, newLang] }));
  };

  const handleUpdateLanguage = (id: string, field: string, value: string) => {
    setResume(prev => ({
      ...prev,
      languages: prev.languages.map(l => l.id === id ? { ...l, [field]: value } : l)
    }));
  };

  const handleRemoveLanguage = (id: string) => {
    setResume(prev => ({ ...prev, languages: prev.languages.filter(l => l.id !== id) }));
  };

  // Certifications
  const handleAddCertification = () => {
    const newCert: Certification = {
      id: "cert-" + Date.now().toString(36),
      name: "",
      issuer: "",
      date: ""
    };
    setResume(prev => ({ ...prev, certifications: [...prev.certifications, newCert] }));
  };

  const handleUpdateCertification = (id: string, field: string, value: string) => {
    setResume(prev => ({
      ...prev,
      certifications: prev.certifications.map(c => c.id === id ? { ...c, [field]: value } : c)
    }));
  };

  const handleRemoveCertification = (id: string) => {
    setResume(prev => ({ ...prev, certifications: prev.certifications.filter(c => c.id !== id) }));
  };

  // Awards
  const handleAddAward = () => {
    const newAward: Award = {
      id: "awd-" + Date.now().toString(36),
      title: "",
      issuer: "",
      date: ""
    };
    setResume(prev => ({ ...prev, awards: [...prev.awards, newAward] }));
  };

  const handleUpdateAward = (id: string, field: string, value: string) => {
    setResume(prev => ({
      ...prev,
      awards: prev.awards.map(a => a.id === id ? { ...a, [field]: value } : a)
    }));
  };

  const handleRemoveAward = (id: string) => {
    setResume(prev => ({ ...prev, awards: prev.awards.filter(a => a.id !== id) }));
  };

  // Skills
  const handleAddSkill = () => {
    if (newSkillInput.trim() && !resume.skills.includes(newSkillInput.trim())) {
      setResume(prev => ({ ...prev, skills: [...prev.skills, newSkillInput.trim()] }));
      setNewSkillInput("");
    }
  };

  const handleAddSuggestedSkill = (skName: string) => {
    if (!resume.skills.includes(skName)) {
      setResume(prev => ({ ...prev, skills: [...prev.skills, skName] }));
    }
    setSuggestedSkills(prev => prev.filter(s => s !== skName));
  };

  const handleRemoveSkill = (skillName: string) => {
    setResume(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillName) }));
  };


  return (
    <div className="min-h-screen bg-slate-100 flex flex-col no-print antialiased">
      
      {/* 1. TOP CONTROL BAR */}
      <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between shadow-sm z-30">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBackToDashboard}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all border border-slate-100"
            title="Go to dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                className="font-display font-extrabold text-slate-900 text-sm focus:outline-none focus:bg-slate-50 px-2 py-0.5 rounded transition-all w-48 sm:w-64"
                value={resume.title}
                onChange={(e) => setResume(prev => ({ ...prev, title: e.target.value }))}
              />
              <span className="text-[10px] font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded font-mono uppercase">
                {resume.templateId}
              </span>
            </div>
            
            {/* Saved state feedback */}
            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400 font-mono px-2">
              {saving ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin text-slate-400" />
                  Saving updates locally...
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Pristine sync with browser storage
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onGoToCorrespondence}
            className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-slate-500" />
            Email Assistant
          </button>

          <button
            onClick={handlePrintPDF}
            className="bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold tracking-wide uppercase px-4.5 py-2.5 rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Download className="w-4 h-4 text-teal-400" />
            Download PDF
          </button>
        </div>
      </header>

      {/* 2. THREE-PANEL CORE CONTAINER */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* PANEL 1: LEFT ICON RAIL */}
        <div className="w-16 bg-white border-r border-slate-200 flex flex-col justify-between py-6 items-center z-20 shrink-0">
          <div className="flex flex-col gap-5 items-center w-full">
            
            {/* Templates icon */}
            <button
              onClick={() => setActiveTab("templates")}
              className={`p-2.5 rounded-xl transition-all cursor-pointer relative group ${
                activeTab === "templates" 
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/10" 
                  : "text-slate-400 hover:text-slate-800 hover:bg-slate-50"
              }`}
              title="Resume Templates"
            >
              <FileText className="w-5 h-5" />
              <span className="absolute left-14 bg-slate-900 text-white text-[10px] px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-50">
                Templates & Color
              </span>
            </button>

            {/* Sections icon */}
            <button
              onClick={() => setActiveTab("sections")}
              className={`p-2.5 rounded-xl transition-all cursor-pointer relative group ${
                activeTab === "sections" 
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/10" 
                  : "text-slate-400 hover:text-slate-800 hover:bg-slate-50"
              }`}
              title="Curate Sections"
            >
              <Layers className="w-5 h-5" />
              <span className="absolute left-14 bg-slate-900 text-white text-[10px] px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-50">
                Form Sections
              </span>
            </button>

            {/* Design Icon */}
            <button
              onClick={() => setActiveTab("design")}
              className={`p-2.5 rounded-xl transition-all cursor-pointer relative group ${
                activeTab === "design" 
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/10" 
                  : "text-slate-400 hover:text-slate-800 hover:bg-slate-50"
              }`}
              title="Styling Options"
            >
              <Palette className="w-5 h-5" />
              <span className="absolute left-14 bg-slate-900 text-white text-[10px] px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-50">
                Styling & Density
              </span>
            </button>

            {/* ATS Score checks (Matches Screenshot 2) */}
            <button
              onClick={() => setActiveTab("ats")}
              className={`p-2.5 rounded-xl transition-all cursor-pointer relative group ${
                activeTab === "ats" 
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/10" 
                  : "text-slate-400 hover:text-slate-800 hover:bg-slate-50"
              }`}
              title="ATS Optimization"
            >
              <div className="relative">
                <ShieldAlert className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white"></span>
              </div>
              <span className="absolute left-14 bg-slate-900 text-white text-[10px] px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-50">
                ATS Scorecard Checks
              </span>
            </button>

          </div>

          {/* Quick auxiliary Dashboard shortcut */}
          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={onBackToDashboard}
              className="p-2.5 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all"
              title="Dashboard Home"
            >
              <Plus className="w-5 h-5 rotate-45" />
            </button>
          </div>
        </div>

        {/* PANEL 2: WORKSPACE ACTIVE VIEW (Width 450px) */}
        <div className="w-[450px] bg-slate-50 border-r border-slate-200 overflow-y-auto shrink-0 flex flex-col justify-between z-10">
          
          <div className="p-6">
            
            {/* SUB-VIEW 1: TEMPLATES GRID */}
            {activeTab === "templates" && (
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 font-display">Resume Layouts</h2>
                  <p className="text-slate-500 text-xs mt-1">Select an ATS-optimized visual aesthetic.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: "modern", name: "Modern Two-Col", desc: "Clean asymmetric" },
                    { id: "professional", name: "Professional Classic", desc: "Traditional alignment" },
                    { id: "elegant", name: "Elegant Serif", desc: "Warm editorial" },
                    { id: "minimal", name: "Minimal Tech", desc: "Clean monospaced" }
                  ].map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => setResume(prev => ({ ...prev, templateId: tpl.id }))}
                      className={`p-4 rounded-2xl border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                        resume.templateId === tpl.id
                          ? "bg-white border-slate-900 shadow-md ring-2 ring-slate-900/5"
                          : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                      }`}
                    >
                      {/* Simulative paper icon */}
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                        <FileText className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{tpl.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{tpl.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Accent Color picker */}
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Accent Theme Color</h3>
                  <div className="flex flex-wrap gap-2.5 mt-3">
                    {ACCENT_COLORS.map((col) => (
                      <button
                        key={col.value}
                        onClick={() => setResume(prev => ({ ...prev, accentColor: col.value }))}
                        className="w-8 h-8 rounded-full flex items-center justify-center relative cursor-pointer shadow-sm hover:scale-105 transition-all"
                        style={{ backgroundColor: col.value }}
                        title={col.name}
                      >
                        {resume.accentColor === col.value && (
                          <Check className="w-4 h-4 text-white drop-shadow-md" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SUB-VIEW 2: FORM SECTIONS (Accords with Screenshot 4) */}
            {activeTab === "sections" && (
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 font-display">Build your Sections</h2>
                  <p className="text-slate-500 text-xs mt-1">Crate and edit individual CV building blocks.</p>
                </div>

                <div className="flex flex-col gap-5">
                  
                  {/* Section A: Contact Info */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" /> Contact Information
                    </h3>
                    <div className="grid grid-cols-2 gap-3 mt-1">
                      <div className="col-span-2">
                        <label className="text-[10px] font-semibold text-slate-400">Full Name</label>
                        <input
                          type="text"
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-teal-500"
                          value={resume.personalInfo.fullName}
                          onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-semibold text-slate-400">Job Title</label>
                        <input
                          type="text"
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-teal-500"
                          value={resume.personalInfo.jobTitle}
                          onChange={(e) => updatePersonalInfo("jobTitle", e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-semibold text-slate-400">Email Address</label>
                        <input
                          type="email"
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-teal-500"
                          value={resume.personalInfo.email}
                          onChange={(e) => updatePersonalInfo("email", e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-semibold text-slate-400">Phone</label>
                        <input
                          type="text"
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-teal-500"
                          value={resume.personalInfo.phone}
                          onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-semibold text-slate-400">Location</label>
                        <input
                          type="text"
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-teal-500"
                          value={resume.personalInfo.location}
                          onChange={(e) => updatePersonalInfo("location", e.target.value)}
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="text-[10px] font-semibold text-slate-400">Personal Website / Portfolio</label>
                        <input
                          type="text"
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-teal-500"
                          value={resume.personalInfo.website || ""}
                          onChange={(e) => updatePersonalInfo("website", e.target.value)}
                          placeholder="e.g. www.riversdesign.co"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section B: Summary (with AI Summary generator) */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                        Professional Summary
                      </h3>
                      
                      {/* AI Generator Helper Button */}
                      <div className="flex gap-1.5 items-center">
                        <select 
                          className="text-[10px] bg-slate-100 rounded border-none font-medium text-slate-600 focus:outline-none py-0.5"
                          value={aiSummaryLevel}
                          onChange={(e) => setAiSummaryLevel(e.target.value)}
                        >
                          <option value="Junior">Junior</option>
                          <option value="Mid-Level">Mid</option>
                          <option value="Senior">Senior</option>
                          <option value="Executive">Exec</option>
                        </select>
                        <button
                          onClick={handleGenerateSummary}
                          disabled={summaryGenerating}
                          className="text-[10px] font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer disabled:opacity-55"
                        >
                          {summaryGenerating ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Sparkles className="w-3 h-3 text-teal-500" />
                          )}
                          AI Generate
                        </button>
                      </div>
                    </div>

                    <textarea
                      className="w-full h-24 bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-teal-500 resize-none leading-relaxed"
                      placeholder="Write brief professional overview or generate one with our smart AI assistant above..."
                      value={resume.summary}
                      onChange={(e) => setResume(prev => ({ ...prev, summary: e.target.value }))}
                    ></textarea>
                  </div>

                  {/* Section C: Work Experience (With AI Bullet optimizer) */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                        Work Experience
                      </h3>
                      <button
                        onClick={handleAddExperience}
                        className="text-[10px] font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Job
                      </button>
                    </div>

                    {resume.experience.map((exp) => (
                      <div key={exp.id} className="border-t border-slate-100 pt-4 mt-1 flex flex-col gap-3 relative">
                        <button
                          onClick={() => handleRemoveExperience(exp.id)}
                          className="absolute right-0 top-3 text-rose-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50"
                          title="Remove experience"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="text-[9px] font-semibold text-slate-400">Company Name</label>
                            <input
                              type="text"
                              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
                              value={exp.company}
                              onChange={(e) => handleUpdateExperience(exp.id, "company", e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-semibold text-slate-400">Role Title</label>
                            <input
                              type="text"
                              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
                              value={exp.role}
                              onChange={(e) => handleUpdateExperience(exp.id, "role", e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-semibold text-slate-400">Start Date</label>
                            <input
                              type="text"
                              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
                              value={exp.startDate}
                              placeholder="e.g. 2021"
                              onChange={(e) => handleUpdateExperience(exp.id, "startDate", e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-semibold text-slate-400">End Date</label>
                            <input
                              type="text"
                              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
                              value={exp.endDate}
                              placeholder="e.g. Present"
                              disabled={exp.current}
                              onChange={(e) => handleUpdateExperience(exp.id, "endDate", e.target.value)}
                            />
                          </div>
                          <div className="col-span-2 flex items-center gap-1.5 mt-1">
                            <input
                              type="checkbox"
                              id={`curr-${exp.id}`}
                              className="rounded accent-slate-900"
                              checked={exp.current}
                              onChange={(e) => handleUpdateExperience(exp.id, "current", e.target.checked)}
                            />
                            <label htmlFor={`curr-${exp.id}`} className="text-[10px] font-semibold text-slate-500 cursor-pointer">
                              I currently work here
                            </label>
                          </div>
                        </div>

                        {/* Repeatable job bullets */}
                        <div className="flex flex-col gap-2 mt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-bold text-slate-400 font-mono">Role Accomplishments</span>
                            <button
                              onClick={() => handleAddBullet(exp.id)}
                              className="text-[9px] text-teal-600 hover:text-teal-700 font-bold"
                            >
                              + Add Bullet
                            </button>
                          </div>

                          {exp.bullets?.map((bullet, idx) => (
                            <div key={idx} className="flex gap-1.5 items-center">
                              <input
                                type="text"
                                className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                                value={bullet}
                                onChange={(e) => handleUpdateBullet(exp.id, idx, e.target.value)}
                                placeholder="Describe a contribution or accomplishment..."
                              />
                              
                              {/* Sparkle polish action */}
                              <button
                                onClick={() => handlePolishBullet(exp.id, idx, bullet)}
                                disabled={!bullet.trim() || bulletPolishingId !== null}
                                className="p-1.5 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg shrink-0 disabled:opacity-40"
                                title="Polish bullet with Gemini AI"
                              >
                                {bulletPolishingId === `${exp.id}-${idx}` ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Sparkles className="w-3.5 h-3.5" />
                                )}
                              </button>

                              <button
                                onClick={() => handleRemoveBullet(exp.id, idx)}
                                className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg shrink-0"
                                title="Remove bullet"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Section D: Education */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                        Education History
                      </h3>
                      <button
                        onClick={handleAddEducation}
                        className="text-[10px] font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Degree
                      </button>
                    </div>

                    {resume.education.map((edu) => (
                      <div key={edu.id} className="border-t border-slate-100 pt-4 mt-1 flex flex-col gap-3 relative">
                        <button
                          onClick={() => handleRemoveEducation(edu.id)}
                          className="absolute right-0 top-3 text-rose-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div className="col-span-2">
                            <label className="text-[9px] font-semibold text-slate-400">School/University</label>
                            <input
                              type="text"
                              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
                              value={edu.institution}
                              onChange={(e) => handleUpdateEducation(edu.id, "institution", e.target.value)}
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="text-[9px] font-semibold text-slate-400">Degree / Focus</label>
                            <input
                              type="text"
                              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
                              value={edu.degree}
                              placeholder="e.g. BFA in Interaction Design"
                              onChange={(e) => handleUpdateEducation(edu.id, "degree", e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-semibold text-slate-400">Start Date</label>
                            <input
                              type="text"
                              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
                              value={edu.startDate}
                              placeholder="e.g. 2013"
                              onChange={(e) => handleUpdateEducation(edu.id, "startDate", e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-semibold text-slate-400">End Date</label>
                            <input
                              type="text"
                              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
                              value={edu.endDate}
                              placeholder="e.g. 2017"
                              onChange={(e) => handleUpdateEducation(edu.id, "endDate", e.target.value)}
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="text-[9px] font-semibold text-slate-400">Score / Grade GPA (Optional)</label>
                            <input
                              type="text"
                              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
                              value={edu.score || ""}
                              placeholder="e.g. 3.9 GPA / Magna Cum Laude"
                              onChange={(e) => handleUpdateEducation(edu.id, "score", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Section E: Expertise Skills (With AI suggestions) */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                        Skills & Expertise
                      </h3>
                      
                      {/* Suggest Button */}
                      <button
                        onClick={handleFetchSkillSuggestions}
                        disabled={skillsLoading}
                        className="text-[10px] font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer disabled:opacity-55"
                      >
                        {skillsLoading ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Sparkles className="w-3 h-3 text-teal-500" />
                        )}
                        Suggest Skills
                      </button>
                    </div>

                    {/* Chips panel */}
                    <div className="flex flex-wrap gap-1.5 min-h-[40px] p-2 bg-slate-50 rounded-xl border border-slate-100">
                      {resume.skills.length === 0 ? (
                        <span className="text-[10px] text-slate-400 italic p-1">No skills added yet...</span>
                      ) : (
                        resume.skills.map((sk) => (
                          <span 
                            key={sk} 
                            className="text-[10px] font-bold uppercase tracking-wide bg-slate-900 text-white pl-2.5 pr-1 py-1 rounded-lg flex items-center gap-1"
                          >
                            {sk}
                            <button 
                              onClick={() => handleRemoveSkill(sk)}
                              className="p-0.5 text-slate-400 hover:text-rose-400 rounded-full hover:bg-slate-800"
                            >
                              ✕
                            </button>
                          </span>
                        ))
                      )}
                    </div>

                    {/* Quick Skill additions field */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                        placeholder="Add skill tag, e.g. Figma"
                        value={newSkillInput}
                        onChange={(e) => setNewSkillInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                      />
                      <button
                        onClick={handleAddSkill}
                        className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                      >
                        Add
                      </button>
                    </div>

                    {/* Suggested skill chips rendering */}
                    {suggestedSkills.length > 0 && (
                      <div className="mt-2 border-t border-slate-100 pt-3">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Suggested for job title:</span>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {suggestedSkills.map((sk) => (
                            <button
                              key={sk}
                              onClick={() => handleAddSuggestedSkill(sk)}
                              className="text-[10px] font-medium bg-teal-50 text-teal-700 hover:bg-teal-100 px-2 py-1 rounded-lg transition-colors border border-teal-100/50 cursor-pointer"
                            >
                              + {sk}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Section F: Languages */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                        Languages
                      </h3>
                      <button onClick={handleAddLanguage} className="text-[10px] font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer">
                        <Plus className="w-3 h-3" /> Add Language
                      </button>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      {resume.languages.map((lang, index) => (
                        <div key={lang.id} className="relative bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col gap-2">
                          <button onClick={() => handleRemoveLanguage(lang.id)} className="absolute top-2 right-2 text-slate-300 hover:text-rose-400">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <div className="grid grid-cols-2 gap-3 mr-6">
                            <div>
                              <label className="text-[9px] font-semibold text-slate-400">Language Name</label>
                              <input
                                type="text"
                                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
                                value={lang.name}
                                placeholder="e.g. Spanish"
                                onChange={(e) => handleUpdateLanguage(lang.id, "name", e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-semibold text-slate-400">Proficiency</label>
                              <select 
                                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
                                value={lang.proficiency}
                                onChange={(e) => handleUpdateLanguage(lang.id, "proficiency", e.target.value)}
                              >
                                <option value="Native">Native</option>
                                <option value="Fluent">Fluent</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Basic">Basic</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section G: Certifications */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                        Certifications
                      </h3>
                      <button onClick={handleAddCertification} className="text-[10px] font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer">
                        <Plus className="w-3 h-3" /> Add Certification
                      </button>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      {resume.certifications.map((cert) => (
                        <div key={cert.id} className="relative bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col gap-2">
                          <button onClick={() => handleRemoveCertification(cert.id)} className="absolute top-2 right-2 text-slate-300 hover:text-rose-400">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <div className="grid grid-cols-2 gap-3 mr-6">
                            <div className="col-span-2">
                              <label className="text-[9px] font-semibold text-slate-400">Certification Name</label>
                              <input
                                type="text"
                                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
                                value={cert.name}
                                placeholder="e.g. AWS Certified Solutions Architect"
                                onChange={(e) => handleUpdateCertification(cert.id, "name", e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-semibold text-slate-400">Issuer</label>
                              <input
                                type="text"
                                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
                                value={cert.issuer}
                                placeholder="e.g. Amazon Web Services"
                                onChange={(e) => handleUpdateCertification(cert.id, "issuer", e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-semibold text-slate-400">Date</label>
                              <input
                                type="text"
                                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
                                value={cert.date}
                                placeholder="e.g. 2023"
                                onChange={(e) => handleUpdateCertification(cert.id, "date", e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section H: Awards */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                        Awards & Honors
                      </h3>
                      <button onClick={handleAddAward} className="text-[10px] font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer">
                        <Plus className="w-3 h-3" /> Add Award
                      </button>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      {resume.awards.map((award) => (
                        <div key={award.id} className="relative bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col gap-2">
                          <button onClick={() => handleRemoveAward(award.id)} className="absolute top-2 right-2 text-slate-300 hover:text-rose-400">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <div className="grid grid-cols-2 gap-3 mr-6">
                            <div className="col-span-2">
                              <label className="text-[9px] font-semibold text-slate-400">Award Title</label>
                              <input
                                type="text"
                                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
                                value={award.title}
                                placeholder="e.g. Designer of the Year"
                                onChange={(e) => handleUpdateAward(award.id, "title", e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-semibold text-slate-400">Issuer / Organization</label>
                              <input
                                type="text"
                                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
                                value={award.issuer}
                                placeholder="e.g. Awwwards"
                                onChange={(e) => handleUpdateAward(award.id, "issuer", e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-semibold text-slate-400">Date</label>
                              <input
                                type="text"
                                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
                                value={award.date}
                                placeholder="e.g. Oct 2022"
                                onChange={(e) => handleUpdateAward(award.id, "date", e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* SUB-VIEW 3: DESIGN styling parameters */}
            {activeTab === "design" && (
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 font-display">Design Customizer</h2>
                  <p className="text-slate-500 text-xs mt-1 font-sans">Fine-tune styling presets to personalize templates.</p>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
                  {/* Spacing adjustments */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block">Vertical Margin Spacing</label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <button className="p-2 text-xs font-medium border border-slate-200 hover:border-slate-300 rounded-xl bg-slate-50">
                        Compact
                      </button>
                      <button className="p-2 text-xs font-medium border-2 border-slate-900 rounded-xl bg-white shadow-sm font-semibold">
                        Comfortable
                      </button>
                      <button className="p-2 text-xs font-medium border border-slate-200 hover:border-slate-300 rounded-xl bg-slate-50">
                        Spacious
                      </button>
                    </div>
                  </div>

                  {/* Spacing adjustments */}
                  <div className="border-t border-slate-100 pt-4">
                    <label className="text-xs font-bold text-slate-700 block">Typography Presets</label>
                    <div className="flex flex-col gap-2 mt-2">
                      <button className="p-2.5 text-left text-xs font-medium border-2 border-slate-950 rounded-xl bg-white flex items-center justify-between">
                        <div>
                          <span className="font-bold">Inter / Space Grotesk</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Modern Tech feel</span>
                        </div>
                        <Check className="w-4 h-4 text-emerald-500" />
                      </button>

                      <button className="p-2.5 text-left text-xs font-medium border border-slate-200 hover:border-slate-300 rounded-xl bg-slate-50 text-slate-500">
                        <div>
                          <span className="font-bold font-serif">Playfair Display / Georgia</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Warm Editorial serif</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-VIEW 4: ATS CHECKS SCORECARD (Accords with Screenshot 2) */}
            {activeTab === "ats" && (
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 font-display">ATS Optimization Checks</h2>
                  <p className="text-slate-500 text-xs mt-1">Review compatibility scoring and diagnostic guidelines.</p>
                </div>

                {/* ATS Circular Score Card */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center gap-4">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    {/* SVG Circle progress */}
                    <svg className="w-full h-full transform -rotate-95">
                      <circle 
                        cx="56" cy="56" r="48" 
                        className="text-slate-100" 
                        strokeWidth="8" stroke="currentColor" fill="transparent" 
                      />
                      <circle 
                        cx="56" cy="56" r="48" 
                        className="text-emerald-500 transition-all duration-1000" 
                        strokeWidth="8" 
                        strokeDasharray="301.6"
                        strokeDashoffset={301.6 - (301.6 * (atsData.score || 0)) / 100}
                        strokeLinecap="round" stroke="currentColor" fill="transparent" 
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-3xl font-black text-slate-900 font-display">{atsData.score}</span>
                      <span className="text-[9px] font-mono font-bold text-slate-400 tracking-wider uppercase">OUT OF 100</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {atsData.score >= 80 ? "Impressive Work! 🎉" : "Action Recommended ⚠️"}
                    </h3>
                    <p className="text-slate-500 text-xs mt-1 max-w-xs leading-relaxed">
                      Your resume shows strong formatting, structured readability, and dense industry keywords.
                    </p>
                  </div>

                  {/* Diagnostic Metric bars */}
                  <div className="w-full flex flex-col gap-2.5 mt-2 text-left border-t border-slate-100 pt-4">
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 font-mono">
                        <span>COMPLETENESS</span>
                        <span>{atsData.subScores?.completeness || 90}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${atsData.subScores?.completeness || 90}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 font-mono">
                        <span>FORMATTING & COHESION</span>
                        <span>{atsData.subScores?.formatting || 80}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div className="bg-teal-500 h-full rounded-full" style={{ width: `${atsData.subScores?.formatting || 80}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 font-mono">
                        <span>INDUSTRY KEYWORDS</span>
                        <span>{atsData.subScores?.keywords || 75}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${atsData.subScores?.keywords || 75}%` }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Force Re-Scan */}
                  <button
                    onClick={handleRunATSScan}
                    disabled={atsLoading}
                    className="mt-2 w-full bg-slate-100 hover:bg-slate-200 border border-slate-200/50 text-slate-700 text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    {atsLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-500" />
                        Re-analyzing draft metrics...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                        Run Diagnostic Scan
                      </>
                    )}
                  </button>
                </div>

                {/* AI Improvement suggestions */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Diagnostic Suggestions ({atsData.suggestions?.length || 0})
                  </h3>

                  {atsData.suggestions?.map((sug, idx) => (
                    <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-start gap-3">
                      <div className="bg-amber-50 text-amber-600 p-2 rounded-xl mt-0.5 shrink-0">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">{sug.title}</span>
                          <span className="text-[8px] font-mono font-bold bg-amber-50 text-amber-700 px-1.5 py-0.2 rounded-full uppercase">
                            {sug.category}
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px] leading-relaxed mt-1">{sug.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* PROFILE STRENGTH BOTTOM PROGRESS CHIP */}
          <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Profile Strength</span>
                <span className="text-xs font-bold text-slate-800">Excellent Integrity ({resume.score || 85}%)</span>
              </div>
            </div>
            <button 
              onClick={() => {
                if (activeTab === "sections") setActiveTab("ats");
                else if (activeTab === "templates") setActiveTab("sections");
                else if (activeTab === "ats") setActiveTab("design");
                else setActiveTab("templates");
              }}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 transition-colors"
            >
              Next Section →
            </button>
          </div>

        </div>

        {/* PANEL 3: RESUME PHYSICAL PAPER PREVIEW */}
        <div className="flex-1 bg-slate-100 p-8 overflow-y-auto flex justify-center items-start z-0">
          
          {/* Constrained layout for A4 simulation */}
          <div className="w-full max-w-[800px] min-w-[650px] shadow-lg rounded-sm overflow-hidden select-text">
            
            {/* The single-source-of-truth visual renderer */}
            <ResumePreviewRenderer resume={resume} />

          </div>

        </div>

      </div>

    </div>
  );
};
