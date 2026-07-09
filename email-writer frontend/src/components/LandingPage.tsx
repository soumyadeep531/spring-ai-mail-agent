import React from "react";
import { Sparkles, ArrowRight, FileText, CheckCircle, Brain, Globe, TrendingUp, HelpCircle, FileCheck, Copy, Trash2, Star, Quote } from "lucide-react";
import { motion } from "motion/react";
import { Resume } from "../types";
import { HomeTemplateShowcase } from "./HomeTemplateShowcase";

interface LandingPageProps {
  resumes: Resume[];
  onCreateNew: () => void;
  onImproveExisting: () => void;
  onSelectResume: (id: string) => void;
  onDeleteResume: (id: string) => void;
  onDuplicateResume: (id: string) => void;
  onUseTemplate: (id: string, color: string) => void;
  onEmailAssistance: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ resumes, onCreateNew, onImproveExisting, onSelectResume, onDeleteResume, onDuplicateResume, onUseTemplate, onEmailAssistance }) => {
  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-800 antialiased overflow-x-hidden">
      
      {/* 1. Navigation Top Bar */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-100 px-6 lg:px-16 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-slate-900 text-white p-2 rounded-xl">
            <Sparkles className="w-5 h-5 text-teal-400" />
          </div>
          <span className="font-display font-extrabold text-xl text-slate-900 tracking-tight">
            SmartCV Builder
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#templates" className="hover:text-slate-900 transition-colors">Templates</a>
          <a href="#reviews" className="hover:text-slate-900 transition-colors">Reviews</a>
          <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={onEmailAssistance} 
            className="hidden sm:flex p-2 items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all"
          >
            <HelpCircle className="w-4 h-4" />
            Email Assistant
          </button>
          <button 
            onClick={onImproveExisting} 
            title="Upload existing resume to parse"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
          >
            <FileCheck className="w-5 h-5" />
          </button>
          <button 
            onClick={onCreateNew}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold tracking-wide uppercase px-5 py-2.5 rounded-xl shadow-md shadow-slate-900/10 hover:shadow-lg transition-all cursor-pointer"
          >
            Create CV
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="px-6 lg:px-16 pt-12 pb-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Hero Copy (Left 6 Cols) */}
        <div className="lg:col-span-7 flex flex-col items-start gap-6">
          <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200/50 text-teal-700 text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-teal-500" />
            AI-Powered Career Advancement
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 font-display tracking-tight leading-[1.1]">
            Create your CV with an <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600">
              AI-powered
            </span>{" "}
            CV maker
          </h1>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
            Build a professional, high-impact resume in minutes with our intelligent assistant. 
            Designed for modern applicants who value precision, style, and rapid career growth.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mt-2">
            <button
              onClick={onCreateNew}
              className="group bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-2xl px-6 py-4 flex items-center justify-center gap-3 shadow-lg shadow-slate-900/15 hover:shadow-xl hover:shadow-slate-900/20 active:scale-[0.98] transition-all cursor-pointer w-full sm:w-auto"
            >
              Create a New CV
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onEmailAssistance}
              className="bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 hover:border-teal-300 font-semibold rounded-2xl px-6 py-4 flex items-center justify-center gap-2.5 shadow-sm active:scale-[0.98] transition-all cursor-pointer w-full sm:w-auto"
            >
              <HelpCircle className="w-4 h-4" />
              Email Assistant
            </button>
          </div>

          {/* Inline Metrics Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 w-full max-w-xl">
            <div className="bg-white border border-slate-100 p-4 rounded-2xl flex items-start gap-3.5 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900 font-display">48% more likely</div>
                <div className="text-xs text-slate-500 mt-0.5">to get hired by top recruiters</div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-4 rounded-2xl flex items-start gap-3.5 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-teal-50 text-teal-600 p-2.5 rounded-xl">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900 font-display">12% better pay</div>
                <div className="text-xs text-slate-500 mt-0.5">on average salary offers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Mockup Resume Column (Right 5 Cols) */}
        <div className="lg:col-span-5 relative flex justify-center items-center mt-8 lg:mt-0">
          
          {/* Main Mockup Card */}
          <div className="w-full max-w-sm bg-white border border-slate-100 rounded-3xl p-6 shadow-xl relative z-10 select-none">
            
            {/* Header section */}
            <div className="border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-xl font-bold text-slate-900 font-display">Alex Rivers</h3>
              <p className="text-sm font-semibold text-teal-600 mt-0.5">Senior Product Designer</p>
            </div>

            {/* Exp block */}
            <div className="mb-4">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2 font-bold">EXPERIENCE</div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-800">Design Lead @ Techflow</h4>
                {/* Horizontal skeleton lines */}
                <div className="h-1.5 bg-slate-200/70 rounded-full w-4/5 mt-2.5"></div>
                <div className="h-1.5 bg-slate-200/50 rounded-full w-2/3 mt-1.5"></div>
              </div>
            </div>

            {/* Skills block */}
            <div className="mb-4">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2 font-bold">SKILLS</div>
              <div className="flex flex-wrap gap-1.5">
                {["Strategic Design", "Figma", "UI Engineering"].map((sk, idx) => (
                  <span key={idx} className="text-[9px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom floating CV Score */}
            <div className="absolute -bottom-3 -right-3 bg-slate-950 text-white rounded-full px-4 py-2.5 flex items-center gap-2 shadow-lg border border-slate-800 z-20">
              <div className="w-7 h-7 rounded-full border-2 border-teal-400 border-r-transparent flex items-center justify-center text-[9px] font-bold text-teal-400">
                85%
              </div>
              <span className="text-xs font-semibold whitespace-nowrap">CV Strength Score</span>
            </div>
          </div>

          {/* Floating Suggestion Chip 1 */}
          <div className="absolute top-[20%] -left-6 sm:-left-12 bg-white/95 backdrop-blur-md border border-slate-100 p-3.5 rounded-2xl shadow-xl flex items-start gap-2.5 max-w-[180px] z-20 hover:scale-105 transition-transform">
            <div className="bg-teal-50 text-teal-600 p-1.5 rounded-lg mt-0.5 shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="text-[10px] leading-tight font-medium text-slate-600">
              <strong className="text-slate-800 font-bold block">"Quantify this impact"</strong>
              Add data metrics to prove experience.
            </div>
          </div>

          {/* Floating Suggestion Chip 2 */}
          <div className="absolute bottom-[30%] -right-4 sm:-right-8 bg-white/95 backdrop-blur-md border border-slate-100 p-3.5 rounded-2xl shadow-xl flex items-start gap-2.5 max-w-[180px] z-20 hover:scale-105 transition-transform">
            <div className="bg-teal-50 text-teal-600 p-1.5 rounded-lg mt-0.5 shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="text-[10px] leading-tight font-medium text-slate-600">
              <strong className="text-slate-800 font-bold block">"Stronger verb"</strong>
              Replace 'worked on' with 'orchestrated'.
            </div>
          </div>

          {/* Background Radial Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-teal-400/10 to-emerald-400/5 blur-[120px] rounded-full z-0"></div>
        </div>
      </section>

      {/* 3. Bento Features Section */}
      <section id="features" className="px-6 lg:px-16 py-20 bg-white border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16 flex flex-col gap-3">
            <h2 className="text-3xl font-extrabold text-slate-900 font-display tracking-tight">
              Built for Every Career Stage
            </h2>
            <p className="text-slate-500 text-sm">
              The smart way to handle the high-stakes job market. Seamless layout management, instant AI guidance, and optimized exporting.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Card 1: ATS Templates (Left Span 7) */}
            <div className="md:col-span-7 bg-slate-50 rounded-3xl p-8 border border-slate-100 flex flex-col justify-between overflow-hidden relative group hover:shadow-md transition-shadow min-h-[260px]">
              <div className="flex flex-col items-start gap-4">
                <div className="bg-teal-100 text-teal-700 p-3 rounded-2xl">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-display">ATS-Optimized Templates</h3>
                <p className="text-slate-500 text-xs sm:text-sm max-w-md leading-relaxed">
                  Our templates are engineered to bypass complex screening algorithms, ensuring your CV reaches the hands of actual recruiters.
                </p>
              </div>
              
              {/* Abstract decorative graphic */}
              <div className="absolute right-0 bottom-0 w-44 h-44 bg-slate-200/50 rounded-tl-full flex items-center justify-center p-4">
                <CheckCircle className="w-14 h-14 text-white fill-teal-500 shadow-xl rounded-full" />
              </div>
            </div>

            {/* Card 2: Live Review (Right Span 5 - Dark style) */}
            <div className="md:col-span-5 bg-slate-950 text-white rounded-3xl p-8 border border-slate-900 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow min-h-[260px]">
              <div className="flex flex-col items-start gap-4 z-10">
                <div className="bg-slate-800 text-teal-400 p-3 rounded-2xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display">Live Review</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Real-time feedback as you type. Never miss a detail or run into overlapping margin bugs again.
                </p>
              </div>

              <div className="mt-8 z-10">
                <button className="bg-slate-900 text-slate-400 text-xs font-mono font-bold px-4 py-2 rounded-xl flex items-center gap-2 border border-slate-800/80">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                  Processing Live Data...
                </button>
              </div>

              {/* Radial gradient backing */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-500/10 blur-[50px] rounded-full"></div>
            </div>

            {/* Card 3: Multi-language AI (Left Span 4) */}
            <div className="md:col-span-4 bg-slate-50 rounded-3xl p-8 border border-slate-100 flex flex-col gap-4 justify-between hover:shadow-md transition-shadow min-h-[260px]">
              <div className="flex flex-col items-start gap-4">
                <div className="bg-indigo-50 text-indigo-600 p-3 rounded-2xl">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-display">Multi-language AI</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  Generate professional resumes in over 25 languages with perfect grammar and cultural nuance.
                </p>
              </div>
            </div>

            {/* Card 4: Expert Writing Assistant (Right Span 8) */}
            <div className="md:col-span-8 bg-slate-50 rounded-3xl p-8 border border-slate-100 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center hover:shadow-md transition-shadow min-h-[260px]">
              <div className="sm:col-span-7 flex flex-col items-start gap-4">
                <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-display">Expert Writing Assistant</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  Our AI doesn't just fill blanks—it helps you articulate your achievements using power verbs and industry-specific keywords.
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="p-2 bg-white rounded-xl border border-slate-200/50 shadow-sm text-slate-400"><Brain className="w-4 h-4" /></span>
                  <span className="p-2 bg-white rounded-xl border border-slate-200/50 shadow-sm text-slate-400"><FileText className="w-4 h-4" /></span>
                  <span className="p-2 bg-white rounded-xl border border-slate-200/50 shadow-sm text-slate-400"><CheckCircle className="w-4 h-4" /></span>
                </div>
              </div>
              
              {/* Photo on right */}
              <div className="sm:col-span-5 h-44 rounded-2xl overflow-hidden relative bg-slate-200">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600" 
                  alt="Professional Designer Working"
                  className="w-full h-full object-cover grayscale opacity-90 contrast-110"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Home Template Showcase (Interactive Preview) */}
      <HomeTemplateShowcase onUseTemplate={onUseTemplate} />

      {/* Pricing Section */}
      <section id="pricing" className="px-6 lg:px-16 py-20 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 font-display tracking-tight mb-4">
            Simple, Transparent Pricing
          </h2>
          <div className="bg-teal-50 border border-teal-100 rounded-3xl p-10 mt-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="w-24 h-24 text-teal-500" />
            </div>
            <h3 className="text-2xl font-bold text-teal-800 font-display mb-2">Free for Everyone</h3>
            <p className="text-teal-600 font-medium mb-6">No Pricing for Now!</p>
            <p className="text-slate-600 max-w-xl mx-auto leading-relaxed mb-8">
              We believe everyone deserves access to top-tier career tools. All templates, AI features, ATS scoring, and PDF exports are currently 100% free with no hidden paywalls.
            </p>
            <button 
              onClick={onCreateNew}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-md shadow-teal-500/20"
            >
              Start Building Now
            </button>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="px-6 lg:px-16 py-20 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 font-display tracking-tight">
              Loved by Professionals
            </h2>
            <p className="text-slate-500 text-sm mt-3">
              Join thousands of job seekers landing interviews at top companies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4 relative">
              <Quote className="absolute top-4 right-4 w-8 h-8 text-slate-100" />
              <div className="flex gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-slate-600 text-sm italic relative z-10 leading-relaxed">
                "SmartCV Builder completely transformed my job hunt. The AI suggestions helped me quantify my achievements properly. I landed a senior role at a Fortune 500 company within 3 weeks!"
              </p>
              <div className="mt-auto pt-4 flex items-center gap-3 border-t border-slate-50">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">SJ</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Sarah Jenkins</h4>
                  <p className="text-xs text-slate-400">Senior Product Manager</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4 relative">
              <Quote className="absolute top-4 right-4 w-8 h-8 text-slate-100" />
              <div className="flex gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-slate-600 text-sm italic relative z-10 leading-relaxed">
                "The ATS scoring feature is a game-changer. I didn't realize how much the layout mattered until I used the 'Navy Accent' template here. My interview rate doubled."
              </p>
              <div className="mt-auto pt-4 flex items-center gap-3 border-t border-slate-50">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">MR</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Marcus Rodriguez</h4>
                  <p className="text-xs text-slate-400">Frontend Engineer</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4 relative">
              <Quote className="absolute top-4 right-4 w-8 h-8 text-slate-100" />
              <div className="flex gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 text-amber-200 fill-current" />
              </div>
              <p className="text-slate-600 text-sm italic relative z-10 leading-relaxed">
                "As someone transitioning careers, the 'Suggest Skills' tool was incredibly helpful. It generated exactly the keywords I was missing. Super smooth export process too!"
              </p>
              <div className="mt-auto pt-4 flex items-center gap-3 border-t border-slate-50">
                <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold">AL</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Amanda Lee</h4>
                  <p className="text-xs text-slate-400">Data Analyst</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Dashboard list */}
      <section className="px-6 lg:px-16 py-16 max-w-7xl mx-auto">
        <h3 className="text-lg font-bold text-slate-900 font-display mb-6">
          Saved Resumes / Presets
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Render Actual Resumes */}
          {resumes.map((resume) => (
            <div key={resume.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-200 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-mono uppercase truncate max-w-[120px]" style={{ color: resume.accentColor }}>{resume.templateId} Layout</span>
                  <span className="text-[11px] font-bold text-emerald-500 font-mono bg-emerald-50 px-2 py-0.5 rounded-full">ATS {resume.score || 0}</span>
                </div>
                <h4 className="font-display font-bold text-base text-slate-900 mt-3 truncate">{resume.title || resume.personalInfo?.fullName || "Untitled Draft"}</h4>
                <p className="text-xs text-slate-500 mt-1 truncate">{resume.personalInfo?.jobTitle || "No title specified"}</p>
              </div>
              <div className="mt-5 flex gap-2">
                <button 
                  onClick={() => onSelectResume(resume.id)}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Edit Draft
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicateResume(resume.id);
                  }}
                  title="Duplicate Resume"
                  className="px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl transition-colors flex items-center justify-center cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteResume(resume.id);
                  }}
                  title="Delete Resume"
                  className="px-3 bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 rounded-xl transition-colors flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Create new widget */}
          <div className="border border-dashed border-slate-200 rounded-2xl p-5 hover:border-slate-300 hover:bg-slate-50/50 transition-all flex flex-col items-center justify-center text-center gap-3">
            <div className="bg-slate-100 text-slate-500 p-3 rounded-full">
              <Sparkles className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-slate-900">Custom Resume Draft</h4>
              <p className="text-xs text-slate-400 mt-1">Start from scratch or paste custom logs.</p>
            </div>
            <button 
              onClick={onCreateNew}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 transition-colors"
            >
              Create New +
            </button>
          </div>
        </div>
      </section>

      {/* 4. Footer */}
      <footer className="border-t border-slate-100 bg-white py-12 px-6 lg:px-16 text-xs text-slate-500 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8 items-start">
          <div className="flex flex-col gap-3 max-w-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-500" />
              <span className="font-display font-extrabold text-slate-900 text-sm">SmartCV Builder</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              The next generation of career tools. Professional, AI-enabled, and designed for stellar results.
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-10 md:gap-16">
            <div className="flex flex-col gap-2.5">
              <span className="font-bold text-slate-900">PRODUCT</span>
              <a href="#templates" className="hover:text-slate-900">Templates</a>
              <a href="#ai" className="hover:text-slate-900">AI Writing</a>
              <a href="#review" className="hover:text-slate-900">Review Tool</a>
            </div>
            <div className="flex flex-col gap-2.5">
              <span className="font-bold text-slate-900">RESOURCES</span>
              <span className="cursor-pointer hover:text-slate-900">Career Blog</span>
              <span className="cursor-pointer hover:text-slate-900">CV Examples</span>
              <span className="cursor-pointer hover:text-slate-900">Help Center</span>
            </div>
            <div className="flex flex-col gap-2.5">
              <span className="font-bold text-slate-900">COMPANY</span>
              <span className="cursor-pointer hover:text-slate-900">About Us</span>
              <span className="cursor-pointer hover:text-slate-900">Contact</span>
              <span className="cursor-pointer hover:text-slate-900">Privacy</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-100 mt-8 pt-6 flex flex-col sm:flex-row justify-between gap-4 items-center">
          <p>© 2026 SmartCV Builder. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <Globe className="w-4 h-4 hover:text-slate-600 cursor-pointer" />
            <Sparkles className="w-4 h-4 hover:text-slate-600 cursor-pointer" />
            <TrendingUp className="w-4 h-4 hover:text-slate-600 cursor-pointer" />
          </div>
        </div>
      </footer>

    </div>
  );
};
