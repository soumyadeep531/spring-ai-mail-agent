export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  avatarUrl?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  score?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
}

export interface Resume {
  id: string;
  title: string;
  templateId: string;
  accentColor: string;
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages: Language[];
  certifications: Certification[];
  awards: Award[];
  score: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ATSSuggestion {
  title: string;
  description: string;
  category: "completeness" | "formatting" | "keywords" | string;
}

export interface ScoreData {
  score: number;
  subScores: {
    completeness: number;
    formatting: number;
    keywords: number;
  };
  suggestions: ATSSuggestion[];
}
