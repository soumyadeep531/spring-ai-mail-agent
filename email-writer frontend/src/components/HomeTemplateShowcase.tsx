import React, { useState } from "react";
import { ResumePreviewRenderer } from "./ResumeTemplates";
import { SAMPLE_ADMIN_ASSISTANT, SAMPLE_LAWYER, SAMPLE_SENIOR_ANALYST } from "../data/sampleResumes";
import { X } from "lucide-react";
import { Resume } from "../types";

const TEMPLATES = [
  { id: "modern-sidebar", name: "Modern", fixture: SAMPLE_ADMIN_ASSISTANT },
  { id: "classic-centered", name: "Classic", fixture: SAMPLE_LAWYER },
  { id: "executive-photo", name: "Executive", fixture: SAMPLE_SENIOR_ANALYST },
];

const ACCENT_COLORS = [
  { name: "Default (Slate)", value: "#475569" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Navy", value: "#1e3a8a" },
  { name: "Emerald", value: "#10b981" },
  { name: "Indigo", value: "#6366f1" },
];

interface HomeTemplateShowcaseProps {
  onUseTemplate: (id: string, color: string) => void;
}

export const HomeTemplateShowcase: React.FC<HomeTemplateShowcaseProps> = ({ onUseTemplate }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTemplateIndex, setActiveTemplateIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("#14b8a6");

  const openModal = (index: number) => {
    setActiveTemplateIndex(index);
    // Use the default color of the template when opened
    setSelectedColor(TEMPLATES[index].fixture.accentColor || "#14b8a6");
    setModalOpen(true);
  };

  const activeTemplate = TEMPLATES[activeTemplateIndex];

  return (
    <section id="templates" className="px-6 lg:px-16 py-20 bg-slate-50 border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 font-display tracking-tight">
            See it in action
          </h2>
          <p className="text-slate-500 text-sm mt-3">
            Hover to preview, or click to explore the full layout.
          </p>
        </div>

        {/* Thumbnail Row */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-12">
          {TEMPLATES.map((tpl, idx) => (
            <div 
              key={tpl.id}
              onClick={() => openModal(idx)}
              className="relative group cursor-pointer"
            >
              <div className="w-[280px] h-[360px] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group-hover:scale-105 group-hover:shadow-xl group-hover:border-teal-300 transition-all duration-300 flex justify-center items-start pt-3 relative z-10">
                 {/* Scale 0.33 works well for a 280px wide container (800 * 0.33 = 264) */}
                 <div className="transform scale-[0.33] origin-top pointer-events-none w-[800px]">
                    <ResumePreviewRenderer 
                      resume={{ ...tpl.fixture, templateId: tpl.id }} 
                      zoom={100} 
                    />
                 </div>
                 {/* Click interceptor */}
                 <div className="absolute inset-0 z-20 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors"></div>
              </div>
              
              {/* Tooltip on Hover */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <span className="bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap shadow-lg">
                  Click to preview
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setModalOpen(false)}
        >
          {/* Modal Content */}
          <div 
            className="bg-white rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col md:flex-row shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 z-50 p-2 bg-white/80 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition-colors shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Live Preview Pane (Left/Top) */}
            <div className="flex-1 bg-slate-100 overflow-y-auto relative p-4 md:p-8 flex justify-center border-b md:border-b-0 md:border-r border-slate-200 h-[60vh] md:h-full">
              <div className="w-[800px] shadow-md origin-top transform scale-[0.5] sm:scale-[0.7] lg:scale-[0.8] xl:scale-95 transition-transform bg-white">
                <ResumePreviewRenderer 
                  resume={{ ...activeTemplate.fixture, templateId: activeTemplate.id, accentColor: selectedColor }} 
                  zoom={100} 
                />
              </div>
            </div>

            {/* Sidebar Controls (Right/Bottom) */}
            <div className="w-full md:w-80 p-6 md:p-8 flex flex-col justify-center bg-white h-[30vh] md:h-full shrink-0">
              <h3 className="text-2xl font-extrabold text-slate-900 font-display mb-1">{activeTemplate.name}</h3>
              <p className="text-sm text-slate-500 mb-8">Professional ATS-friendly layout.</p>

              {/* Accent Color Selection */}
              <div className="mb-8">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Accent Color</label>
                <div className="flex gap-2">
                  {ACCENT_COLORS.map(c => (
                    <button
                      key={c.value}
                      onClick={() => setSelectedColor(c.value)}
                      className="w-8 h-8 rounded-full border-2 transition-all cursor-pointer"
                      style={{ 
                        backgroundColor: c.value,
                        borderColor: selectedColor === c.value ? c.value : 'transparent',
                        boxShadow: selectedColor === c.value ? `0 0 0 3px white, 0 0 0 4px ${c.value}` : 'none'
                      }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={() => {
                  setModalOpen(false);
                  onUseTemplate(activeTemplate.id, selectedColor);
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 active:scale-[0.98] transition-all"
              >
                Use This Template
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
