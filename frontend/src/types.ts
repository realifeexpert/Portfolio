export interface Education {
  college: string;
  degree: string;
  location: string;
  timeline: string;
  highlights: string[];
}

export interface Experience {
  company: string;
  role: string;
  location: string;
  timeline: string;
  points: string[];
}

export interface Project {
  title: string;
  timeline: string;
  points: string[];
}

export interface GithubProject {
  id: number;
  name: string;
  description: string;
  htmlUrl: string;
  language: string;
  stars: number;
  updatedAt: string;
}

export interface Certification {
  title: string;
  issuer: string;
  date: string;
  image: string;
}

export interface ResumeData {
  name: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  githubUsername: string;
  profilePhoto: string;
  profile: string;
  resume: string;
  technicalSkills: string[];
  tools: string[];
  education: Education;
  experience: Experience[];
  projects: Project[];
  certifications: Certification[];
}
