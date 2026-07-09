import React, { useState } from "react";
import { Sparkles, ArrowLeft, Loader2, Copy, Check, MailOpen, RefreshCw } from "lucide-react";

interface EmailGeneratorProps {
  onBack: () => void;
}

const TONES = [
  { id: "professional", label: "Professional & Direct", description: "Clear, formal, and objective" },
  { id: "appreciative", label: "Appreciative & Polite", description: "Expresses gratitude and enthusiasm" },
  { id: "persuasive", label: "Persuasive & Impactful", description: "Highlights strong value propositions" },
  { id: "inquisitive", label: "Inquisitive & Curious", description: "Asks clarify questions about the role" }
];

export const EmailGenerator: React.FC<EmailGeneratorProps> = ({ onBack }) => {
  const [originalEmail, setOriginalEmail] = useState<string>("");
  const [selectedTone, setSelectedTone] = useState<string>("professional");
  const [generatedReply, setGeneratedReply] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleGenerate = async () => {
    if (!originalEmail.trim()) {
      setError("Please paste the original email first.");
      return;
    }

    setLoading(true);
    setError("");
    setCopied(false);

    try {
      const toneLabel = TONES.find(t => t.id === selectedTone)?.label || "Professional";
      const res = await fetch("/api/ai/email-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalEmail, tone: toneLabel })
      });

      if (!res.ok) {
        throw new Error("Failed to generate reply");
      }

      const data = await res.json();
      setGeneratedReply(data.reply);
    } catch (err: any) {
      console.error(err);
      setError("Failed to generate reply. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadSampleEmail = () => {
    setOriginalEmail(`Hi Jonathan,

Hope you're having a great week!

I came across your Senior Product Designer profile on LinkedIn and was really impressed by your SaaS redesign experience at TechFlow Dynamics. 

We're currently expanding our product design team at Vertex Cloud and looking for a Lead UI/UX designer to spearhead our next-generation AI interfaces.

Do you have 15 minutes this Thursday or Friday for a quick intro chat?

Best regards,
Sarah Jenkins
Director of Talent @ Vertex Cloud`);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-16 flex flex-col justify-between">
      
      {/* Top Navigation */}
      <div className="max-w-4xl mx-auto w-full flex justify-between items-center mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors bg-white px-3.5 py-2 rounded-xl shadow-sm border border-slate-100 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </button>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
          <MailOpen className="w-3.5 h-3.5 text-slate-500" />
          輔 AI Correspondence Tool
        </div>
      </div>

      {/* Core Interface Workspace */}
      <div className="max-w-4xl mx-auto w-full my-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Input panel (Col 6) */}
        <div className="md:col-span-6 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-extrabold text-slate-900 font-display tracking-tight">
              Email Reply Generator
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Paste the original email below and let our AI craft a perfectly toned response tailored to your professional needs.
            </p>
          </div>

          {/* Text Area */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Original Recruiter Email</label>
              <button 
                onClick={loadSampleEmail}
                className="text-[11px] font-bold text-teal-600 hover:text-teal-700 hover:underline cursor-pointer"
              >
                Load Sample Email
              </button>
            </div>
            <textarea
              className="w-full h-48 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:bg-white transition-all resize-none"
              placeholder="Paste the recruiter email, interview request, or inquiry message here..."
              value={originalEmail}
              onChange={(e) => setOriginalEmail(e.target.value)}
              disabled={loading}
            ></textarea>
          </div>

          {/* Tone Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Desired Tone</label>
            <div className="grid grid-cols-2 gap-3">
              {TONES.map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => setSelectedTone(tone.id)}
                  disabled={loading}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-0.5 cursor-pointer ${
                    selectedTone === tone.id
                      ? "bg-slate-900 border-slate-900 text-white"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200/50 text-slate-700"
                  }`}
                >
                  <span className="text-xs font-bold">{tone.label}</span>
                  <span className={`text-[9px] ${selectedTone === tone.id ? "text-slate-400" : "text-slate-500"}`}>
                    {tone.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-xs font-semibold text-rose-500 bg-rose-50 px-4 py-2 rounded-xl">
              ⚠️ {error}
            </p>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !originalEmail.trim()}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white font-semibold rounded-2xl py-3.5 flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                Composing Reply...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-teal-400" />
                Generate Tailored Reply
              </>
            )}
          </button>
        </div>

        {/* Right Generated Response Panel (Col 6) */}
        <div className="md:col-span-6 flex flex-col h-full">
          {generatedReply ? (
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-full min-h-[460px]">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-display">
                    <Sparkles className="w-4 h-4 text-teal-500" />
                    AI Response Draft
                  </span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleGenerate}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                      title="Re-generate"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-[11px] font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy Draft
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Body Content */}
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans whitespace-pre-line bg-slate-50/50 p-4 rounded-2xl max-h-[360px] overflow-y-auto border border-slate-100">
                  {generatedReply}
                </div>
              </div>

              {/* Status footer inside card */}
              <div className="text-[10px] text-slate-400 font-mono text-center border-t border-slate-100 pt-3 mt-4">
                Verify date & recruiter details before sending.
              </div>
            </div>
          ) : (
            /* Blank state placeholder */
            <div className="border border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[460px]">
              <div className="bg-slate-100 text-slate-400 p-4 rounded-full">
                <MailOpen className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-slate-800">Your AI Draft Will Appear Here</h4>
                <p className="text-slate-400 text-xs max-w-xs mx-auto mt-1 leading-relaxed">
                  Provide recruiter details on the left, select a custom professional response tone, and hit compose.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Footer copyright */}
      <div className="max-w-4xl mx-auto w-full text-center text-xs text-slate-400 mt-12">
        SmartCV Builder Correspondence Assistant • Safe, secure, and client-approved
      </div>

    </div>
  );
};
