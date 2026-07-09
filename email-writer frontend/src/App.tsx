import React, { useState, useEffect } from "react";
import { LandingPage } from "./components/LandingPage";
import { OnboardingPage } from "./components/OnboardingPage";
import { BuilderPage } from "./components/BuilderPage";
import { EmailGenerator } from "./components/EmailGenerator";
import { TemplateGallery } from "./components/TemplateGallery";
import { Resume } from "./types";
import { Loader2, LogOut } from "lucide-react";
import { AuthForm } from "./components/AuthForm";

type PageState = "landing" | "onboarding" | "templates" | "builder" | "email-generator";

export default function App() {
  const [page, setPage] = useState<PageState>("landing");
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [activeResume, setActiveResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [pendingTemplateSelection, setPendingTemplateSelection] = useState<{ id: string, color: string } | null>(null);

  const handleLogin = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    if (pendingTemplateSelection) {
      createBlankDraft(pendingTemplateSelection.id, pendingTemplateSelection.color);
      setPendingTemplateSelection(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setPage("landing");
  };

  // Load resumes from our local Express server database on mount
  const fetchResumes = async () => {
    if (!token) {
        setLoading(false);
        return;
    }
    try {
      const res = await fetch("/api/resumes", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setResumes(data);
      }
    } catch (err) {
      console.error("Failed to load resumes on mount:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
        fetchResumes();
    } else {
        setLoading(false);
    }
  }, [token]);

  const handleSelectResume = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/resumes/${id}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const resumeData = await res.json();
        setActiveResume(resumeData);
        setPage("builder");
      }
    } catch (err) {
      console.error("Error loading specific draft:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResume = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/resumes/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        fetchResumes(); // refresh dashboard
      }
    } catch (err) {
      console.error("Error deleting resume:", err);
    }
  };

  const handleDuplicateResume = async (id: string) => {
    if (!token) return;
    try {
      // Fetch existing
      const res = await fetch(`/api/resumes/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) return;
      const resumeData = await res.json();
      
      // Remove ID and modify title
      const newDraft = { ...resumeData, id: undefined, title: `${resumeData.title} (Copy)` };
      
      // POST as new
      const createRes = await fetch("/api/resumes", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(newDraft)
      });
      
      if (createRes.ok) {
        fetchResumes();
      }
    } catch (err) {
      console.error("Error duplicating resume:", err);
    }
  };

  const createBlankDraft = (templateId: string = "modern-sidebar", accentColor: string = "#14b8a6") => {
    const blank: Resume = {
      id: "resume-new-" + Date.now().toString(36),
      title: "My Custom Resume Draft",
      templateId,
      accentColor,
      personalInfo: {
        fullName: "",
        jobTitle: "",
        email: "",
        phone: "",
        location: "",
        website: ""
      },
      summary: "",
      experience: [],
      education: [],
      skills: [],
      languages: [],
      certifications: [],
      awards: [],
      score: 55
    };
    
    setActiveResume(blank);
    setPage("builder");
  };

  const handleStartWithParsedData = (parsedData: any) => {
    const parsedDraft: Resume = {
      id: "resume-parsed-" + Date.now().toString(36),
      title: `${parsedData.fullName || "Imported"} Resume Draft`,
      templateId: "modern",
      accentColor: "#14b8a6",
      personalInfo: {
        fullName: parsedData.fullName || "",
        jobTitle: parsedData.jobTitle || "",
        email: parsedData.email || "",
        phone: parsedData.phone || "",
        location: parsedData.location || "",
        website: parsedData.website || ""
      },
      summary: parsedData.summary || "",
      experience: parsedData.experience || [],
      education: parsedData.education || [],
      skills: parsedData.skills || [],
      languages: parsedData.languages || [],
      certifications: [],
      awards: [],
      score: 75
    };

    // Save parsed draft immediately to local Express db
    fetch("/api/resumes", {
      method: "POST",
      headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify(parsedDraft)
    })
      .then(res => res.json())
      .then((savedResume) => {
        setActiveResume(savedResume);
        setPage("builder");
        fetchResumes(); // refresh dashboard cache
      })
      .catch((err) => {
        console.error("Error saving parsed draft to database:", err);
        // Fallback to offline state editing
        setActiveResume(parsedDraft);
        setPage("builder");
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
        <div className="text-center">
          <p className="text-sm font-bold text-slate-800">Booting Workspace...</p>
          <p className="text-xs text-slate-400 mt-1">Initializing AI-Powered CV Builder environment</p>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // ROUTING RENDERER (Clean, state-based, high performance)
  // ----------------------------------------------------------------------

  const PageRenderer = () => {
    switch (page) {
    case "landing":
      return (
        <LandingPage 
          resumes={resumes}
          onCreateNew={() => {
            if (!token) {
              setPage("onboarding"); // This will show AuthForm since it's guarded below, wait, let's guard onboarding
            } else {
              setPage("onboarding");
            }
          }}
          onImproveExisting={() => setPage("onboarding")}
          onSelectResume={handleSelectResume}
          onDeleteResume={handleDeleteResume}
          onDuplicateResume={handleDuplicateResume}
          onUseTemplate={(id, color) => {
            if (!token) {
              setPendingTemplateSelection({ id, color });
              setPage("builder"); // This triggers auth form
            } else {
              createBlankDraft(id, color);
            }
          }}
          onEmailAssistance={() => setPage("email-generator")}
        />
      );
    case "onboarding":
      if (!token) return <AuthForm onLogin={handleLogin} />;
      return (
        <OnboardingPage 
          onBack={() => setPage("landing")}
          onStartBlank={() => setPage("templates")}
          onStartWithParsedData={(data) => {
             // For parsed data, we also go through the template gallery but we need to retain the data.
             // To keep it simple, we'll just use a default template if they import.
             // Or they can change template later in the builder.
             handleStartWithParsedData(data);
          }}
        />
      );
    case "templates":
      return (
        <TemplateGallery 
          onBack={() => setPage("onboarding")}
          onSelectTemplate={(templateId, accentColor) => createBlankDraft(templateId, accentColor)}
        />
      );
    case "builder":
      if (!token) return <AuthForm onLogin={handleLogin} />;
      if (!activeResume) {
        setPage("landing");
        return null;
      }
      return (
        <BuilderPage 
          initialResume={activeResume}
          onBackToDashboard={() => {
            fetchResumes(); // refresh database records
            setPage("landing");
          }}
          onGoToCorrespondence={() => setPage("email-generator")}
        />
      );
    case "email-generator":
      return (
        <EmailGenerator 
          onBack={() => setPage(activeResume ? "builder" : "landing")}
        />
      );
    default:
      return (
        <LandingPage 
          resumes={resumes}
          onCreateNew={() => {
            if (!token) setPage("onboarding");
            else setPage("onboarding");
          }}
          onImproveExisting={() => setPage("onboarding")}
          onSelectResume={handleSelectResume}
          onDeleteResume={handleDeleteResume}
          onDuplicateResume={handleDuplicateResume}
          onUseTemplate={(id, color) => {
            if (!token) {
              setPendingTemplateSelection({ id, color });
              setPage("builder");
            } else {
              createBlankDraft(id, color);
            }
          }}
          onEmailAssistance={() => setPage("email-generator")}
        />
      );
  }
  };

  return (
    <>
        {token && (
          <div className="absolute top-4 right-4 z-50">
              <button onClick={handleLogout} className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 bg-white p-2 rounded-md shadow-sm border border-slate-200">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
              </button>
          </div>
        )}
        <PageRenderer />
    </>
  );
}
