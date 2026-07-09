import React, { useState, useEffect } from "react";
import { ArrowLeft, Check, Download, FileText } from "lucide-react";
import { ResumePreviewRenderer } from "./ResumeTemplates";
import { Resume } from "../types";
import { SAMPLE_ADMIN_ASSISTANT, SAMPLE_LAWYER, SAMPLE_SENIOR_ANALYST } from "../data/sampleResumes";

interface TemplateGalleryProps {
  onBack: () => void;
  onSelectTemplate: (templateId: string, accentColor: string) => void;
}

const ACCENT_COLORS = [
  { name: "Default (Slate)", value: "#475569" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Navy", value: "#1e3a8a" },
  { name: "Emerald", value: "#10b981" },
  { name: "Indigo", value: "#6366f1" },
];

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onBack, onSelectTemplate }) => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("modern-sidebar");
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({
    "modern-sidebar": "#14b8a6",
    "classic-centered": "#1e3a8a",
    "executive-photo": "#10b981",
  });

  const getFixtureForTemplate = (templateId: string): Resume => {
    switch (templateId) {
      case "classic-centered":
        return SAMPLE_LAWYER;
      case "executive-photo":
        return SAMPLE_SENIOR_ANALYST;
      case "modern-sidebar":
      default:
        return SAMPLE_ADMIN_ASSISTANT;
    }
  };

  useEffect(() => {
    fetch((import.meta.env.VITE_API_URL || "") + "/api/templates")
      .then((res) => res.json())
      .then((data) => {
        setTemplates(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load templates:", err);
        setLoading(false);
      });
  }, []);

  const handleColorChange = (templateId: string, color: string) => {
    setSelectedColors((prev) => ({ ...prev, [templateId]: color }));
  };

  const handleDownloadSample = (templateId: string, format: "pdf" | "docx", e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`/api/templates/${templateId}/sample/${format}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col py-12 px-6">
      
      {/* Header rail */}
      <div className="max-w-7xl mx-auto w-full mb-8 flex justify-between items-center">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors bg-white px-3.5 py-2 rounded-xl shadow-sm border border-slate-100"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Go Back
        </button>
        
        {/* Progress bar simulation */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <span className="text-teal-600">Step 1 of 3</span>
          <div className="w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="w-1/3 h-full bg-teal-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Main Core Block */}
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-10">
        
        <div className="text-center flex flex-col gap-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight">
            Choose a Template
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
            Select a base layout to start building. All templates are ATS-optimized and fully customizable later.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {templates.map((tpl) => {
              const isSelected = selectedTemplate === tpl.id;
              const activeColor = selectedColors[tpl.id] || "#14b8a6";
              
              return (
                <div 
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl.id)}
                  className={`bg-white rounded-3xl p-6 transition-all cursor-pointer relative group flex flex-col ${
                    isSelected 
                      ? "ring-2 ring-teal-500 shadow-md border-transparent" 
                      : "border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300"
                  }`}
                >
                  {/* Selected Badge */}
                  {isSelected && (
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center shadow-md z-20">
                      <Check className="w-4 h-4" />
                    </div>
                  )}

                  {/* Header info */}
                  <div className="mb-4">
                    <h3 className="font-display font-bold text-lg text-slate-900">{tpl.name}</h3>
                    <p className="text-xs text-slate-400 capitalize">{tpl.layoutType} layout</p>
                  </div>

                  {/* Live Mini Preview */}
                  <div className="bg-slate-100 rounded-xl overflow-hidden border border-slate-200 mb-6 flex-1 flex justify-center p-2 relative h-[400px]">
                    <div className="transform scale-[0.42] origin-top-left absolute top-4 left-4 pointer-events-none w-[750px]">
                      <ResumePreviewRenderer 
                        resume={{ ...getFixtureForTemplate(tpl.id), templateId: tpl.id, accentColor: activeColor }} 
                        zoom={100} 
                      />
                    </div>
                    {/* Overlay to block clicks inside the preview */}
                    <div className="absolute inset-0 z-10"></div>
                  </div>

                  {/* Footer Controls */}
                  <div className="flex flex-col gap-4 mt-auto">
                    {/* Swatches */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Accent</span>
                      <div className="flex gap-1.5 ml-2">
                        {ACCENT_COLORS.map(c => (
                          <button
                            key={c.value}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleColorChange(tpl.id, c.value);
                            }}
                            className="w-5 h-5 rounded-full border-2 transition-all"
                            style={{ 
                              backgroundColor: c.value,
                              borderColor: activeColor === c.value ? c.value : 'transparent',
                              boxShadow: activeColor === c.value ? `0 0 0 2px white, 0 0 0 3px ${c.value}` : 'none'
                            }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                      {/* Quick Downloads */}
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => handleDownloadSample(tpl.id, "pdf", e)}
                          className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-2 py-1.5 rounded transition-colors"
                        >
                          <FileText className="w-3 h-3" /> PDF
                        </button>
                        <button 
                          onClick={(e) => handleDownloadSample(tpl.id, "docx", e)}
                          className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-2 py-1.5 rounded transition-colors"
                        >
                          <Download className="w-3 h-3" /> DOCX
                        </button>
                      </div>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTemplate(tpl.id, activeColor);
                        }}
                        className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm"
                      >
                        Use Template
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
