import { ResumeData } from "../types";

const resumeData: ResumeData = {
  name: "Harshal Borhade",
  phone: "+919321610285",
  email: "hborhade2714@gmail.com",
  linkedin: "www.linkedin.com/in/harshal-borhade-687798319",
  github: "github.com/realifeexpert",
  githubUsername: "realifeexpert",
  profilePhoto: "/profile/passport-photo.jpg",
  profile:
    "A software engineer skilled in developing secure systems with a strong understanding of cybersecurity principles and practices.",
  resume: "/resume.pdf",
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
      title: "Python Programs",
      timeline: "2024",
      points: [
        "Collection of Python programming examples and utilities.",
        "Demonstrates various Python concepts and best practices."
      ]
    },
    {
      title: "Python Tutorials",
      timeline: "2024",
      points: [
        "Comprehensive tutorials covering Python concepts and fundamentals.",
        "Includes practical examples and code walkthroughs for learning."
      ]
    },
    {
      title: "Steganography Project",
      timeline: "2024",
      points: [
        "Implemented encryption and decryption techniques for data hiding.",
        "Developed steganography methods to conceal information within digital media."
      ]
    },
    {
      title: "GymX Fitness",
      timeline: "2024",
      points: [
        "Built a fitness application using JavaScript.",
        "Provides tools and features for workout tracking and fitness management."
      ]
    },
    {
      title: "Password Strength Analyzer",
      timeline: "2024",
      points: [
        "Python-based cybersecurity tool for analyzing password strength using entropy calculations.",
        "Identifies security vulnerabilities through pattern detection and strength evaluation."
      ]
    },
    {
      title: "AI-Based Supply Chain Dashboard",
      timeline: "2024",
      points: [
        "Developed a TypeScript-based dashboard for supply chain management.",
        "Leveraged AI to optimize logistics, inventory, and operations visibility."
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

export default resumeData;