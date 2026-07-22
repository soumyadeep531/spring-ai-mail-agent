import React, { useState } from "react";
import { Sparkles, FileText, ArrowLeft, ArrowRight, Loader2, ClipboardCheck, ArrowUpRight } from "lucide-react";

interface OnboardingPageProps {
  onBack: () => void;
  onStartBlank: () => void;
  onStartWithParsedData: (data: any) => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onBack, onStartBlank, onStartWithParsedData }) => {
  const [importMode, setImportMode] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleParseFile = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch((import.meta.env.VITE_API_URL || "") + "/api/resume/parse", {
        method: "POST",
        body: formData,
        // Let the browser set the Content-Type with the boundary for multipart/form-data
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (!res.ok) {
        let backendError = "Failed to parse resume file";
        try {
          const errData = await res.json();
          if (errData.error) backendError = errData.error;
        } catch(e) {}
        throw new Error(backendError);
      }

      const data = await res.json();
      
      // 'data' has { resumeId, confidence, unmappedText, parsedData }
      // Route it down with the parsedData payload
      onStartWithParsedData(data.parsedData || data);
    } catch (err: any) {
      console.error("Parse error:", err);
      setError(err.message || "Failed to parse resume file. Ensure it's a valid PDF or DOCX.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.pdf') && !selectedFile.name.endsWith('.docx')) {
        setError("Only PDF and DOCX files are supported.");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError("");
    }
  };



  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-12 px-6">
      
      {/* Header rail */}
      <div className="max-w-4xl mx-auto w-full">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors bg-white px-3.5 py-2 rounded-xl shadow-sm border border-slate-100"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Go Back
        </button>
      </div>

      {/* Main Core Block */}
      <div className="max-w-4xl mx-auto w-full my-auto flex flex-col items-center gap-10">
        
        {/* Step Info */}
        {!importMode ? (
          <div className="text-center flex flex-col gap-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight">
              Ready to build your career?
            </h1>
            <p className="text-slate-500 text-sm sm:text-base max-w-md mx-auto">
              Choose how you'd like to get started. Build from scratch or leverage AI to parse existing records.
            </p>
          </div>
        ) : (
          <div className="text-center flex flex-col gap-3">
            <h1 className="text-3xl font-extrabold text-slate-900 font-display tracking-tight flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-teal-500" />
              AI Resume Parser
            </h1>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Paste your raw, unstructured resume text below. Our Gemini model will parse and format the records immediately.
            </p>
          </div>
        )}

        {/* Content body switcher */}
        {!importMode ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
            
            {/* Card 1: Start From Scratch */}
            <div 
              onClick={onStartBlank}
              className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-md hover:border-slate-200 transition-all cursor-pointer group flex flex-col justify-between min-h-[300px]"
            >
              <div className="flex flex-col gap-4">
                <div className="bg-slate-100 text-slate-900 w-12 h-12 rounded-2xl flex items-center justify-center font-bold">
                  01
                </div>
                <h3 className="font-display font-bold text-xl text-slate-900">Start from scratch</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  Build a clean, polished CV from a blank canvas. Recommended if you want complete creative control over sections.
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs font-bold text-slate-800 group-hover:text-teal-600 transition-colors">
                Start blank
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: AI Parser upload */}
            <div 
              onClick={() => setImportMode(true)}
              className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-md hover:border-slate-200 transition-all cursor-pointer group flex flex-col justify-between min-h-[300px] relative overflow-hidden"
            >
              {/* Sparkle background element */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 rounded-bl-full flex items-start justify-end p-4">
                <Sparkles className="w-6 h-6 text-teal-400" />
              </div>

              <div className="flex flex-col gap-4 z-10">
                <div className="bg-teal-50 text-teal-700 w-12 h-12 rounded-2xl flex items-center justify-center font-bold font-mono">
                  AI
                </div>
                <h3 className="font-display font-bold text-xl text-slate-900">I already have a resume</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  Paste your existing CV or past drafts. Our intelligent AI parser will extract contact details, jobs, and skills instantly.
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs font-bold text-teal-600 transition-colors">
                Upload & Parse
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>
        ) : (
          /* Real AI Parsing Form */
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-sm flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">Upload Resume</span>
            </div>

            <div className="w-full h-64 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 p-4 text-center hover:bg-slate-100 transition-colors relative">
              <input 
                type="file" 
                accept=".pdf,.docx" 
                onChange={handleFileChange}
                disabled={loading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="bg-white p-3 rounded-full shadow-sm border border-slate-100">
                <FileText className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700">Drag & Drop your CV here</p>
                <p className="text-xs text-slate-400 mt-1">Supports PDF and DOCX (Max 5MB)</p>
              </div>
              {file && (
                <div className="mt-2 bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-teal-100">
                  Selected: {file.name}
                </div>
              )}
            </div>

            {error && (
              <p className="text-xs font-semibold text-rose-500 bg-rose-50 px-4 py-2.5 rounded-xl border border-rose-100">
                ⚠️ {error}
              </p>
            )}

            <div className="flex gap-4 items-center justify-between">
              <button
                onClick={() => setImportMode(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 px-4 py-2"
                disabled={loading}
              >
                Cancel
              </button>

              <button
                onClick={handleParseFile}
                disabled={loading || !file}
                className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white font-semibold text-sm rounded-2xl px-6 py-3.5 flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                    Extracting details...
                  </>
                ) : (
                  <>
                    Parse Resume Content
                    <ArrowUpRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Footer Branding */}
      <div className="max-w-4xl mx-auto w-full text-center text-xs text-slate-400">
        SmartCV Builder v1.2 • Powered by Google Gemini AI
      </div>

    </div>
  );
};
