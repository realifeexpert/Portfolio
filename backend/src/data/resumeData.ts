import { ResumeData } from "../types";

export const resumeData: ResumeData = {
  name: "Harshal Borhade",
  phone: "+919321610285",
  email: "hborhade2714@gmail.com",
  linkedin: "www.linkedin.com/in/harshal-borhade-687798319",
  github: "github.com/realifeexpert",
  githubUsername: "realifeexpert",
  profilePhoto: "/profile/passport-photo.jpg",
  profile:
    "A software engineer skilled in developing secure systems with a strong understanding of cybersecurity principles and practices.",
  technicalSkills: ["Python", "Java", "C/C++", "JavaScript", "Node.js", "React", "Flask"],
  tools: ["Wireshark", "Nmap", "Web Security", "Computer Networks"],
  education: {
    college: "Padmabhushan Vasantdada Patil College of Engineering",
    degree: "Bachelor of Engineering in Information Technology",
    location: "Mumbai",
    timeline: "2022 - 2026",
    highlights: [
      "Current CGPA: 7.35",
      "Additional Honours degree in the field of Cyber Security"
    ]
  },
  experience: [
    {
      company: "IBM SkillBuild",
      role: "Data Analytics",
      location: "Mumbai, India",
      timeline: "June 2024 - August 2024",
      points: [
        "Analyzed structured datasets using Python and Excel to generate insights, identify trends, and support decision-making.",
        "Applied SQL and visualization tools (Tableau/Power BI) to clean, transform, and present data through clear dashboards."
      ]
    },
    {
      company: "Edunet Foundation",
      role: "Cyber Security Analyst",
      location: "Mumbai, India",
      timeline: "January 2025 - February 2025",
      points: [
        "Identified and analyzed common security threats and incident-response strategies.",
        "Worked on real-time case studies to understand practical cybersecurity implementation."
      ]
    }
  ],
  projects: [
    {
      title: "Sentimental Analysis of Electronic Product",
      timeline: "December 2024 - February 2025",
      points: [
        "Collected and analyzed customer reviews to capture user opinions and product feedback.",
        "Used NLP techniques to classify sentiment into positive, negative, and neutral categories."
      ]
    },
    {
      title: "Supply Chain Management",
      timeline: "August 2024 - October 2025",
      points: [
        "Developed modules for stock tracking, order processing, and supplier management.",
        "Improved workflow efficiency through real-time inventory and operations visibility."
      ]
    }
  ],
  certifications: [
    {
      title: "Certification in Python Programming",
      issuer: "Programming Institute",
      date: "Jan 2025",
      image: "/certifications/python-programming.jpg"
    },
    {
      title: "Oracle Cloud Certification in DevOps Professional",
      issuer: "Oracle",
      date: "Sept 2025",
      image: "/certifications/oracle-devops.jpg"
    },
    {
      title: "Introduction to Cyber Security",
      issuer: "Cisco Networking Academy",
      date: "2025",
      image: "/certifications/cisco-cyber-security.jpg"
    },
    {
      title: "Building Modern Web Applications with MERN Stack",
      issuer: "Edunet Foundation",
      date: "2025",
      image: "/certifications/mern-stack-certificate.jpg"
    }
  ]
};
