import { Resume } from "../types";

export const SAMPLE_ADMIN_ASSISTANT: Resume = {
  id: "sample-modern",
  title: "Sample Modern",
  templateId: "modern-sidebar",
  accentColor: "#14b8a6",
  score: 95,
  personalInfo: {
    fullName: "Kelly Blackwell",
    jobTitle: "Administrative Assistant",
    email: "kelly.blackwell@example.com",
    phone: "(555) 123-4567",
    location: "Austin, TX",
    website: "linkedin.com/in/kblackwell"
  },
  summary: "Highly organized Administrative Assistant with over 5 years of experience streamlining office operations and supporting executive teams. Proven track record of improving workflow efficiency by 30% through the implementation of digital filing systems. Exceptional communicator with a strong foundation in customer relations and calendar management.",
  experience: [
    {
      id: "exp1",
      company: "TechNova Solutions",
      role: "Executive Assistant",
      startDate: "2021",
      endDate: "Present",
      current: true,
      bullets: [
        "Managed complex calendars, domestic travel, and expense reports for the CEO and CTO.",
        "Transitioned the office to a fully paperless filing system, reducing supply costs by 15%.",
        "Coordinated quarterly off-site meetings for 50+ remote employees, handling logistics and catering."
      ]
    },
    {
      id: "exp2",
      company: "Apex Financial",
      role: "Administrative Assistant",
      startDate: "2018",
      endDate: "2021",
      current: false,
      bullets: [
        "Greeted over 100 clients daily and managed the front desk communication systems.",
        "Drafted professional correspondence and created spreadsheet reports for the finance department.",
        "Maintained office supplies inventory, preventing shortages during peak audit seasons."
      ]
    }
  ],
  education: [
    {
      id: "edu1",
      institution: "Texas State University",
      degree: "B.A. in Communications",
      startDate: "2014",
      endDate: "2018",
      score: "3.7 GPA"
    }
  ],
  skills: ["Office Management", "Calendar Coordination", "Microsoft Office Suite", "Travel Logistics", "Data Entry", "Client Relations"],
  languages: [],
  certifications: [],
  awards: []
};

export const SAMPLE_LAWYER: Resume = {
  id: "sample-classic",
  title: "Sample Classic",
  templateId: "classic-centered",
  accentColor: "#1e3a8a",
  score: 98,
  personalInfo: {
    fullName: "Howard Jones, Esq.",
    jobTitle: "Corporate Counsel",
    email: "hjones@examplelaw.com",
    phone: "(212) 555-8901",
    location: "New York, NY",
    website: ""
  },
  summary: "Dedicated Corporate Counsel with 8+ years of experience specializing in intellectual property, contract negotiation, and regulatory compliance. Expert at advising C-suite executives on risk mitigation strategies and overseeing high-stakes corporate litigation. Adept at fostering collaborative relationships with external counsel and government agencies.",
  experience: [
    {
      id: "exp1",
      company: "Global Health Inc.",
      role: "Senior Corporate Counsel",
      startDate: "2019",
      endDate: "Present",
      current: true,
      bullets: [
        "Led negotiations for a $50M international vendor agreement, minimizing liability exposure.",
        "Established an internal IP compliance program, reducing trademark disputes by 40%.",
        "Advised the executive board during the acquisition of two regional biotech startups."
      ]
    },
    {
      id: "exp2",
      company: "Sterling & Vance LLP",
      role: "Associate Attorney",
      startDate: "2015",
      endDate: "2019",
      current: false,
      bullets: [
        "Drafted over 200 software licensing agreements and non-disclosure contracts.",
        "Represented corporate clients in commercial dispute mediation sessions.",
        "Conducted extensive due diligence for M&A transactions exceeding $100M."
      ]
    }
  ],
  education: [
    {
      id: "edu1",
      institution: "Columbia Law School",
      degree: "Juris Doctor (J.D.)",
      startDate: "2012",
      endDate: "2015",
      score: "Cum Laude"
    },
    {
      id: "edu2",
      institution: "New York University",
      degree: "B.A. in Political Science",
      startDate: "2008",
      endDate: "2012",
      score: "3.9 GPA"
    }
  ],
  skills: ["Contract Negotiation", "Intellectual Property", "M&A Due Diligence", "Regulatory Compliance", "Risk Management", "Litigation Strategy"],
  languages: [
    { id: "lang1", name: "French", proficiency: "Professional Working" }
  ],
  certifications: [
    { id: "cert1", name: "New York State Bar", issuer: "NYSBA", date: "2016" }
  ],
  awards: []
};

export const SAMPLE_SENIOR_ANALYST: Resume = {
  id: "sample-executive",
  title: "Sample Executive",
  templateId: "executive-photo",
  accentColor: "#10b981",
  score: 92,
  personalInfo: {
    fullName: "Samantha Williams",
    jobTitle: "Senior Financial Analyst",
    email: "swilliams@example.com",
    phone: "(312) 555-3421",
    location: "Chicago, IL",
    website: "github.com/swilliams-data"
  },
  summary: "Strategic Senior Financial Analyst with a decade of expertise in financial modeling, variance analysis, and data visualization. Passionate about translating complex datasets into actionable business strategies. Proven leader in driving cost-saving initiatives and optimizing quarterly forecasting cycles for Fortune 500 companies.",
  experience: [
    {
      id: "exp1",
      company: "FinTech Partners",
      role: "Senior Financial Analyst",
      startDate: "2020",
      endDate: "Present",
      current: true,
      bullets: [
        "Developed an automated forecasting model using Python, reducing monthly reporting time by 15 hours.",
        "Identified $2M in operational inefficiencies through deep-dive expense variance analysis.",
        "Presented quarterly financial dashboards to the Board of Directors using Tableau."
      ]
    },
    {
      id: "exp2",
      company: "Market Dynamics Corp",
      role: "Financial Analyst",
      startDate: "2015",
      endDate: "2020",
      current: false,
      bullets: [
        "Built comprehensive P&L statements for 3 new product launches, leading to a 20% ROI.",
        "Collaborated with the marketing team to optimize ad spend budget allocation.",
        "Mentored two junior analysts in advanced Excel modeling techniques."
      ]
    }
  ],
  education: [
    {
      id: "edu1",
      institution: "University of Chicago",
      degree: "M.S. in Finance",
      startDate: "2013",
      endDate: "2015",
      score: "3.8 GPA"
    }
  ],
  skills: ["Financial Modeling", "Python", "Tableau", "SQL", "Variance Analysis", "Forecasting", "Advanced Excel"],
  languages: [],
  certifications: [
    { id: "cert1", name: "Chartered Financial Analyst (CFA)", issuer: "CFA Institute", date: "2018" }
  ],
  awards: [
    { id: "awd1", name: "Analyst of the Year", issuer: "Market Dynamics Corp", date: "2019" }
  ]
};
