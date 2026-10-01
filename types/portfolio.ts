export interface HeroData {
  name: string;
  title: string;
  subtitle: string;
  avatar: string;
  status: string;
  resumeUrl: string;
  github: string;
  linkedin: string;
  twitter: string;
  email: string;
}

export interface AboutStat {
  label: string;
  value: string;
}

export interface AboutData {
  bio: string;
  stats: AboutStat[];
  highlights: string[];
}

export interface SkillItem {
  name: string;
  level: string;
}

export interface SkillCategory {
  category: string;
  items: SkillItem[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  description: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  grade: string;
  details: string;
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl: string;
  badge: string;
}

export interface ContactData {
  email: string;
  phone: string;
  location: string;
  availability: string;
  socials: {
    github: string;
    linkedin: string;
    twitter: string;
  };
}

export interface PortfolioData {
  hero: HeroData;
  about: AboutData;
  skills: SkillCategory[];
  projects: ProjectItem[];
  experience: ExperienceItem[];
  education: EducationItem[];
  certificates: CertificateItem[];
  contact: ContactData;
  adminPasscode?: string;
}
