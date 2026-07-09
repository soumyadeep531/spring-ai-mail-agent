import React from "react";
import { Resume } from "../types";

interface TemplateProps {
  resume: Resume;
}

// 1. MODERN TEMPLATE (The precise layout from Screenshot 2)
export const ModernTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, experience, education, skills, languages, certifications, awards, accentColor } = resume;

  return (
    <div className="bg-white p-8 text-slate-800 font-sans min-h-[1050px] shadow-sm relative">
      {/* Decorative Top Accent Tag (Simulated Optimized pill) */}
      <div className="absolute top-4 right-4 bg-emerald-50 text-emerald-700 text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold border border-emerald-200">
        ✓ Optimized
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 uppercase font-display">
          {personalInfo.fullName || "Your Name"}
        </h1>
        <p className="text-lg font-medium mt-1 tracking-wide" style={{ color: accentColor || "#14b8a6" }}>
          {personalInfo.jobTitle || "Your Professional Title"}
        </p>
        
        {/* Contact info banner */}
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-500 mt-3 font-mono">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <span>✉</span> {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <span>📞</span> {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <span>📍</span> {personalInfo.location}
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1">
              <span>🌐</span> {personalInfo.website}
            </span>
          )}
        </div>
      </div>

      {/* Main Solid Divider Line */}
      <div className="h-[2px] bg-slate-900 mb-6"></div>

      {/* Two-Column Grid Layout */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left Column (Experiences & Education) - 65% width */}
        <div className="col-span-8 flex flex-col gap-6">
          
          {/* Work Experience */}
          {experience && experience.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-4 font-display">
                Experience
              </h2>
              <div className="flex flex-col gap-5">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative">
                    <div className="flex justify-between items-start text-sm">
                      <h3 className="font-bold text-slate-900">{exp.role || "Role"}</h3>
                      <span className="text-xs font-mono text-slate-500 whitespace-nowrap bg-slate-50 px-1.5 py-0.5 rounded">
                        {exp.startDate} — {exp.current ? "PRESENT" : exp.endDate}
                      </span>
                    </div>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: accentColor || "#14b8a6" }}>
                      {exp.company || "Company"}
                    </p>
                    <ul className="list-disc ml-4 mt-2 text-xs text-slate-600 flex flex-col gap-1.5 leading-relaxed">
                      {exp.bullets?.map((bullet, idx) => (
                        <li key={idx}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-4 font-display">
                Education
              </h2>
              <div className="flex flex-col gap-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-start text-sm">
                      <h3 className="font-bold text-slate-900">{edu.degree || "Degree"}</h3>
                      <span className="text-xs font-mono text-slate-500 whitespace-nowrap">
                        {edu.startDate} — {edu.endDate}
                      </span>
                    </div>
                    <p className="text-xs font-semibold" style={{ color: accentColor || "#14b8a6" }}>
                      {edu.institution || "Institution"}
                    </p>
                    {edu.score && <p className="text-[11px] font-mono text-slate-500 mt-1">Result: {edu.score}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Skills, Summary, Languages) - 35% width */}
        <div className="col-span-4 flex flex-col gap-6">
          
          {/* Expertise / Skills tags */}
          {skills && skills.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3 font-display">
                Expertise
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-semibold uppercase tracking-wide bg-slate-100 text-slate-800 px-2.5 py-1 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3 font-display">
                Languages
              </h2>
              <div className="flex flex-col gap-2 text-xs">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between">
                    <span className="font-medium text-slate-800">{lang.name}</span>
                    <span className="text-slate-500 font-mono text-[11px]">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3 font-display">
                Certifications
              </h2>
              <div className="flex flex-col gap-3 text-xs">
                {certifications.map((cert) => (
                  <div key={cert.id}>
                    <h3 className="font-bold text-slate-800">{cert.name}</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">{cert.issuer} • {cert.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Awards */}
          {awards && awards.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3 font-display">
                Awards
              </h2>
              <div className="flex flex-col gap-3 text-xs">
                {awards.map((aw) => (
                  <div key={aw.id}>
                    <h3 className="font-bold text-slate-800">{aw.title}</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">{aw.issuer} • {aw.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Summary Section Card */}
          {summary && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 font-mono">
                AI Summary
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "{summary}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


// 2. PROFESSIONAL TEMPLATE (Traditional 1-column layout, highly readable for ATS)
export const ProfessionalTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, experience, education, skills, languages, certifications, awards, accentColor } = resume;

  return (
    <div className="bg-white p-10 text-slate-800 font-sans min-h-[1050px] shadow-sm">
      {/* Centered Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">
          {personalInfo.fullName || "Your Name"}
        </h1>
        <p className="text-sm font-semibold tracking-wide uppercase mt-1" style={{ color: accentColor || "#1e3a8a" }}>
          {personalInfo.jobTitle || "Your Professional Title"}
        </p>
        
        {/* Contact Links */}
        <div className="flex justify-center flex-wrap gap-4 text-xs text-slate-500 mt-3 font-mono">
          {personalInfo.email && <span>✉ {personalInfo.email}</span>}
          {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
          {personalInfo.location && <span>📍 {personalInfo.location}</span>}
          {personalInfo.website && <span>🌐 {personalInfo.website}</span>}
        </div>
      </div>

      <div className="h-[1px] bg-slate-300 mb-6"></div>

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-2 font-display">
            Professional Summary
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed text-justify">
            {summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-3 font-display border-b border-slate-200 pb-1">
            Work History
          </h2>
          <div className="flex flex-col gap-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{exp.role}</span>
                    <span className="text-slate-400 mx-1.5">•</span>
                    <span className="text-xs font-semibold" style={{ color: accentColor || "#1e3a8a" }}>{exp.company}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-500">
                    {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <ul className="list-disc ml-4 mt-2 text-xs text-slate-600 flex flex-col gap-1 leading-relaxed">
                  {exp.bullets?.map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-3 font-display border-b border-slate-200 pb-1">
            Education
          </h2>
          <div className="flex flex-col gap-3">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{edu.degree}</h3>
                  <p className="text-xs text-slate-500">{edu.institution} {edu.score ? `• ${edu.score}` : ""}</p>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  {edu.startDate} — {edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills / Expertise */}
      {skills && skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-3 font-display border-b border-slate-200 pb-1">
            Technical Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, idx) => (
              <span key={idx} className="text-xs bg-slate-50 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-md">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Additional info side by side (Languages / Certs) */}
      <div className="grid grid-cols-2 gap-6 mt-4">
        {languages && languages.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-2 font-display">Languages</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
              {languages.map(lang => (
                <span key={lang.id} className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                  {lang.name} ({lang.proficiency})
                </span>
              ))}
            </div>
          </div>
        )}
        {certifications && certifications.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-2 font-display">Certifications</h3>
            <div className="text-xs text-slate-600 flex flex-col gap-1">
              {certifications.map(cert => (
                <div key={cert.id} className="flex justify-between">
                  <span className="font-medium text-slate-800">{cert.name}</span>
                  <span className="text-slate-400 font-mono text-[10px]">{cert.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// 3. ELEGANT SERIF TEMPLATE (Refined serif style, perfect for writers, consultants, marketers)
export const ElegantTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, experience, education, skills, languages, certifications, accentColor } = resume;

  return (
    <div className="bg-[#FAF9F6] p-10 text-slate-800 font-serif min-h-[1050px] shadow-sm">
      {/* Decorative Border line */}
      <div className="border border-amber-800/20 p-8 min-h-[990px] flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-normal italic text-slate-900 font-display">
              {personalInfo.fullName || "Your Name"}
            </h1>
            <p className="text-xs uppercase tracking-widest mt-1 text-amber-800 font-sans font-semibold">
              {personalInfo.jobTitle || "Your Professional Title"}
            </p>
            <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 mt-4 font-sans border-t border-b border-amber-800/10 py-1.5 max-w-md mx-auto">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.location && <span>{personalInfo.location}</span>}
            </div>
          </div>

          {/* Summary */}
          {summary && (
            <div className="mb-6 max-w-2xl mx-auto text-center italic text-xs text-slate-600 leading-relaxed">
              "{summary}"
            </div>
          )}

          {/* Grid Layout */}
          <div className="grid grid-cols-12 gap-8 mt-6">
            {/* Experience - Column 8 */}
            <div className="col-span-8 flex flex-col gap-6">
              {experience && experience.length > 0 && (
                <div>
                  <h2 className="text-xs uppercase tracking-widest text-amber-800 font-semibold font-sans mb-3 border-b border-amber-800/10 pb-1">
                    Experience
                  </h2>
                  <div className="flex flex-col gap-5">
                    {experience.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-baseline text-xs font-sans font-semibold text-slate-900">
                          <h3 className="text-sm font-serif font-bold text-slate-900">{exp.role}</h3>
                          <span className="font-normal text-slate-500 text-[10px]">{exp.startDate} — {exp.current ? "Present" : exp.endDate}</span>
                        </div>
                        <p className="text-xs font-sans font-medium text-amber-800 mt-0.5">{exp.company}</p>
                        <ul className="list-disc ml-4 mt-2 text-xs text-slate-600 flex flex-col gap-1 leading-relaxed italic">
                          {exp.bullets?.map((bullet, idx) => (
                            <li key={idx}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Column 4 */}
            <div className="col-span-4 flex flex-col gap-6">
              {/* Education */}
              {education && education.length > 0 && (
                <div>
                  <h2 className="text-xs uppercase tracking-widest text-amber-800 font-semibold font-sans mb-3 border-b border-amber-800/10 pb-1">
                    Education
                  </h2>
                  <div className="flex flex-col gap-3">
                    {education.map((edu) => (
                      <div key={edu.id} className="text-xs">
                        <h3 className="font-bold text-slate-900">{edu.degree}</h3>
                        <p className="text-[11px] text-slate-600 font-sans">{edu.institution}</p>
                        <p className="text-[10px] text-slate-400 font-sans">{edu.startDate} — {edu.endDate}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {skills && skills.length > 0 && (
                <div>
                  <h2 className="text-xs uppercase tracking-widest text-amber-800 font-semibold font-sans mb-3 border-b border-amber-800/10 pb-1">
                    Skills
                  </h2>
                  <div className="flex flex-wrap gap-1">
                    {skills.map((skill, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-sans">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {languages && languages.length > 0 && (
                <div>
                  <h2 className="text-xs uppercase tracking-widest text-amber-800 font-semibold font-sans mb-3 border-b border-amber-800/10 pb-1">
                    Languages
                  </h2>
                  <div className="flex flex-col gap-1 text-xs">
                    {languages.map((lang) => (
                      <div key={lang.id} className="flex justify-between">
                        <span>{lang.name}</span>
                        <span className="text-slate-400 italic text-[10px]">{lang.proficiency}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Elegant Footer Signature */}
        <div className="text-center text-[10px] font-sans text-slate-400 border-t border-amber-800/10 pt-4 mt-8">
          Self-certified professional credentials • Generated via SmartCV Builder
        </div>
      </div>
    </div>
  );
};


// 4. MINIMALIST TECH TEMPLATE (Clean, monospace accents, high density, tech-forward)
export const MinimalTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, experience, education, skills, accentColor } = resume;

  return (
    <div className="bg-white p-8 text-neutral-800 font-sans min-h-[1050px] shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-black text-neutral-900 tracking-tighter uppercase">
            {personalInfo.fullName || "Your Name"}
          </h1>
          <p className="text-sm font-mono tracking-widest uppercase mt-1 font-semibold" style={{ color: accentColor || "#10b981" }}>
            // {personalInfo.jobTitle || "Your Title"}
          </p>
        </div>
        <div className="text-right text-xs font-mono text-neutral-500 leading-normal border-l-2 border-neutral-200 pl-4">
          {personalInfo.email && <div>EM: {personalInfo.email}</div>}
          {personalInfo.phone && <div>PH: {personalInfo.phone}</div>}
          {personalInfo.location && <div>LOC: {personalInfo.location}</div>}
          {personalInfo.website && <div>WWW: {personalInfo.website}</div>}
        </div>
      </div>

      <div className="h-[1px] bg-neutral-200 mb-6"></div>

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <p className="text-xs text-neutral-600 leading-relaxed font-mono">
            {summary}
          </p>
        </div>
      )}

      {/* Skills Tags block */}
      {skills && skills.length > 0 && (
        <div className="mb-6">
          <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-2 font-bold">// TECHNOLOGIES</div>
          <div className="flex flex-wrap gap-1.5 font-mono text-xs">
            {skills.map((skill, idx) => (
              <span key={idx} className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Work History */}
      {experience && experience.length > 0 && (
        <div className="mb-6">
          <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-3 font-bold">// WORK_EXPERIENCE</div>
          <div className="flex flex-col gap-4">
            {experience.map((exp) => (
              <div key={exp.id} className="border-l border-neutral-200 pl-4 ml-1">
                <div className="flex justify-between items-baseline text-xs font-mono">
                  <h3 className="font-bold text-neutral-900 text-sm">{exp.role} @ <span style={{ color: accentColor || "#10b981" }}>{exp.company}</span></h3>
                  <span className="text-neutral-400">{exp.startDate} — {exp.current ? "Present" : exp.endDate}</span>
                </div>
                <ul className="list-disc ml-4 mt-2 text-xs text-neutral-600 flex flex-col gap-1 leading-normal font-mono">
                  {exp.bullets?.map((bullet, idx) => (
                    <li key={idx} className="marker:text-neutral-300">{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-6">
          <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-3 font-bold">// EDUCATION</div>
          <div className="flex flex-col gap-3">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start text-xs font-mono">
                <div>
                  <h4 className="font-bold text-neutral-900">{edu.degree}</h4>
                  <p className="text-neutral-500">{edu.institution} {edu.score ? `[${edu.score}]` : ""}</p>
                </div>
                <span className="text-neutral-400">{edu.startDate} — {edu.endDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


// Main Renderer that switches between templates
export const ResumePreviewRenderer: React.FC<{ resume: Resume }> = ({ resume }) => {
  switch (resume.templateId) {
    case "modern":
      return <ModernTemplate resume={resume} />;
    case "professional":
      return <ProfessionalTemplate resume={resume} />;
    case "elegant":
      return <ElegantTemplate resume={resume} />;
    case "minimal":
      return <MinimalTemplate resume={resume} />;
    default:
      return <ModernTemplate resume={resume} />;
  }
};
