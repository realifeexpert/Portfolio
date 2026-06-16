import { AnimatePresence, motion, useScroll, useSpring, Variants } from "framer-motion";
import { SyntheticEvent, useEffect, useState } from "react";
import Section from "./components/Section";
import resumeData from "./data/resumeData";
import { Certification, GithubProject, ResumeData } from "./types";

type ThemeMode = "dark" | "light";

interface GithubRepoApi {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  fork: boolean;
}

const CERT_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='520'%3E%3Crect width='100%25' height='100%25' fill='%230f1632'/%3E%3Ctext x='50%25' y='50%25' fill='%23edf2ff' font-size='34' text-anchor='middle' dominant-baseline='middle'%3EAdd Certificate Image%3C/text%3E%3C/svg%3E";
const PROFILE_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='360'%3E%3Crect width='100%25' height='100%25' fill='%230f1632'/%3E%3Ctext x='50%25' y='50%25' fill='%23edf2ff' font-size='24' text-anchor='middle' dominant-baseline='middle'%3EAdd Profile Photo%3C/text%3E%3C/svg%3E";

const resolveMediaUrl = (url: string) => {
  if (!url) return url;
  if (/^https?:\/\//i.test(url) || url.startsWith("data:")) {
    return url;
  }
  return url;
};

const tryImageFallback = (
  event: SyntheticEvent<HTMLImageElement, Event>,
  finalSrc: string
) => {
  const target = event.currentTarget;
  const original = target.dataset.originalSrc || target.src;
  target.dataset.originalSrc = original;

  const variants = [
    original,
    original.replace(/\.jpg$/i, ".png"),
    original.replace(/\.jpg$/i, ".jpeg"),
    original.replace(/\.jpg$/i, ".webp")
  ];
  const attempted = Number(target.dataset.attemptedIndex || "0");
  const nextIndex = attempted + 1;

  if (nextIndex < variants.length && variants[nextIndex] !== variants[attempted]) {
    target.dataset.attemptedIndex = String(nextIndex);
    target.src = variants[nextIndex];
    return;
  }

  target.src = finalSrc;
};

const getCertificateExtension = (url: string, contentType: string | null) => {
  if (contentType?.includes("pdf")) return "pdf";
  if (contentType?.includes("png")) return "png";
  if (contentType?.includes("jpeg")) return "jpg";
  if (contentType?.includes("webp")) return "webp";

  const match = url.match(/\.([a-zA-Z0-9]+)(?:$|\?)/);
  return match?.[1]?.toLowerCase() || "jpg";
};

const buildDownloadName = (title: string, extension: string) => {
  const safeTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${safeTitle || "certificate"}.${extension}`;
};

const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: "easeOut" }
  }
};

const chipItem: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: "easeOut" }
  }
};

const heroContentStagger: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

const heroContentItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const heroRolePhrases = [
  "Secure Systems Builder",
  "Cyber Security Analyst",
  "SOC Analyst",
];

const blockedRepoTerms = [
  "python-program",
  "python program",
  "python tutorial",
  "python-tutorial",
  "tutorial",
  "cyber-portfolio",
  "portfolio"
];

const pinnedProject: GithubProject = {
  id: -1,
  name: "Supply Chain AI Dashboard",
  description:
    "AI-driven dashboard for monitoring supply chain signals, forecasting trends, and supporting faster operational decisions.",
  htmlUrl: "https://github.com/realifeexpert/supply-chain-ai-dashboard",
  language: "AI / Analytics",
  stars: 0,
  updatedAt: ""
};

function App() {
  const data = resumeData;
  const [githubProjects, setGithubProjects] = useState<GithubProject[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [activeHeroRole, setActiveHeroRole] = useState(0);
  const [downloadingCertificate, setDownloadingCertificate] = useState<string | null>(null);
  const { scrollYProgress } = useScroll();
  const scrollBarScale = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001
  });

  useEffect(() => {
    const storedTheme = localStorage.getItem("portfolio-theme") as ThemeMode | null;
    if (storedTheme === "dark" || storedTheme === "light") {
      setTheme(storedTheme);
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveHeroRole((current) => (current + 1) % heroRolePhrases.length);
    }, 2500);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/users/${data.githubUsername}/repos?sort=updated&per_page=12`,
          {
            headers: {
              Accept: "application/vnd.github+json"
            }
          }
        );

        if (!response.ok) {
          return;
        }

        const repos = (await response.json()) as GithubRepoApi[];
        const projects = repos
          .filter((repo) => {
            if (repo.fork) return false;
            const loweredName = repo.name.toLowerCase();
            return !blockedRepoTerms.some((term) => loweredName.includes(term));
          })
          .map((repo) => ({
            id: repo.id,
            name: repo.name,
            description: repo.description ?? "No description provided yet.",
            htmlUrl: repo.html_url,
            language: repo.language ?? "Not specified",
            stars: repo.stargazers_count,
            updatedAt: repo.updated_at
          }));

        const hasPinnedProject = projects.some(
          (project) => project.htmlUrl.toLowerCase() === pinnedProject.htmlUrl.toLowerCase()
        );

        if (!hasPinnedProject) {
          projects.push(pinnedProject);
        }

        setGithubProjects(projects);
      } catch {
        setGithubProjects([]);
      }
    };

    void loadPortfolio();
  }, [data.githubUsername]);

  const downloadCertificate = async (certificate: Certification) => {
    const certificateUrl = resolveMediaUrl(certificate.image);

    try {
      setDownloadingCertificate(certificate.title);
      const response = await fetch(certificateUrl);
      if (!response.ok) {
        throw new Error("Failed to download certificate file.");
      }

      const blob = await response.blob();
      const extension = getCertificateExtension(certificateUrl, response.headers.get("content-type"));
      const filename = buildDownloadName(certificate.title, extension);
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      // Fallback: open the certificate asset if direct download fails.
      window.open(certificateUrl, "_blank", "noopener,noreferrer");
    } finally {
      setDownloadingCertificate((current) =>
        current === certificate.title ? null : current
      );
    }
  };

  const projectCount = githubProjects.length || data.projects.length;
  const certificationCount = data.certifications.length;
  const skillCount = data.technicalSkills.length;

  return (
    <div className="page">
      <motion.div className="scroll-progress" style={{ scaleX: scrollBarScale }} />
      <div className="animated-bg" />
      <div className="noise-layer" />
      <div className="scanline-layer" />
      <nav className="top-nav">
        <a href="#home">Home</a>
        <a href="#skills">Skills</a>
        <a href="#education">Education</a>
        <a href="#experience">Experience</a>
        <a href="#projects">Projects</a>
        <a href="#certifications">Certifications</a>
        <button
          type="button"
          className="theme-toggle"
          onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? "☀ Light" : "🌙 Dark"}
        </button>
      </nav>
      <main className="container">
        <motion.header
          id="home"
          className="hero"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <div className="hero-layout">
            <img
              src={resolveMediaUrl(data.profilePhoto)}
              alt={`${data.name} profile`}
              className="profile-photo"
              onError={(event) => tryImageFallback(event, PROFILE_PLACEHOLDER)}
            />
            <motion.div
              className="hero-content"
              variants={heroContentStagger}
              initial="hidden"
              animate="show"
            >
              <motion.div className="hero-kicker-wrap" variants={heroContentItem}>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={heroRolePhrases[activeHeroRole]}
                    className="hero-kicker"
                    initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
                    transition={{ duration: 0.42, ease: "easeOut" }}
                  >
                    {heroRolePhrases[activeHeroRole]}
                  </motion.p>
                </AnimatePresence>
              </motion.div>
              <motion.h1 className="hero-name" data-text={data.name} variants={heroContentItem}>{data.name}</motion.h1>
              <motion.p variants={heroContentItem}>{data.profile}</motion.p>
              <motion.div className="hero-metrics" variants={heroContentItem}>
                <motion.div className="metric-card" whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <span className="metric-label">Projects</span>
                  <strong>{projectCount}</strong>
                </motion.div>
                <motion.div className="metric-card" whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <span className="metric-label">Certifications</span>
                  <strong>{certificationCount}</strong>
                </motion.div>
                <motion.div className="metric-card" whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <span className="metric-label">Core Skills</span>
                  <strong>{skillCount}</strong>
                </motion.div>
              </motion.div>
              <motion.div className="contact-links" variants={heroContentItem}>
                <motion.a href={`tel:${data.phone}`} className="btn secondary" whileHover={{ y: -3, scale: 1.03 }} whileTap={{ scale: 0.98 }}>Call</motion.a>
                <motion.a href={`mailto:${data.email}`} className="btn secondary" whileHover={{ y: -3, scale: 1.03 }} whileTap={{ scale: 0.98 }}>Email</motion.a>
                <motion.a href={data.resume} className="btn primary" download whileHover={{ y: -3, scale: 1.03 }} whileTap={{ scale: 0.98 }}>Resume</motion.a>
                <motion.a href={`https://${data.linkedin}`} className="btn secondary" target="_blank" rel="noreferrer" whileHover={{ y: -3, scale: 1.03 }} whileTap={{ scale: 0.98 }}>LinkedIn</motion.a>
                <motion.a href={`https://${data.github}`} className="btn secondary" target="_blank" rel="noreferrer" whileHover={{ y: -3, scale: 1.03 }} whileTap={{ scale: 0.98 }}>GitHub</motion.a>
              </motion.div>
            </motion.div>
          </div>
        </motion.header>

        <Section id="skills" title="Technical Skills">
          <motion.div
            className="chips"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
          >
            {data.technicalSkills.map((skill) => (
              <motion.span key={skill} className="chip skill-chip" variants={chipItem}>{skill}</motion.span>
            ))}
          </motion.div>
          <h3 className="skills-subtitle">Tools</h3>
          <motion.div
            className="chips"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
          >
            {data.tools.map((tool) => (
              <motion.span key={tool} className="chip accent skill-chip" variants={chipItem}>{tool}</motion.span>
            ))}
          </motion.div>
        </Section>

        <Section id="education" title="Education">
          <article className="timeline-item">
            <div>
              <h3>{data.education.college}</h3>
              <p className="muted">{data.education.degree}</p>
            </div>
            <div className="meta">
              <span>{data.education.location}</span>
              <span>{data.education.timeline}</span>
            </div>
          </article>
          <ul>
            {data.education.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>

        <Section id="experience" title="Experience">
          {data.experience.map((exp) => (
            <motion.article
              className="timeline-item block"
              key={`${exp.company}-${exp.role}`}
              variants={fadeUpItem}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              <div>
                <h3>{exp.company}</h3>
                <p className="muted">{exp.role}</p>
              </div>
              <div className="meta">
                <span>{exp.location}</span>
                <span>{exp.timeline}</span>
              </div>
              <ul>
                {exp.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </motion.article>
          ))}
        </Section>

        <Section id="projects" title="Projects">
          <motion.div
            className="project-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.12 }}
          >
            {githubProjects.map((project) => (
              <motion.article
                className="project-card"
                key={project.id}
                variants={fadeUpItem}
                whileHover={{ y: -8, boxShadow: "0 16px 35px rgba(0, 185, 255, 0.25)" }}
              >
                <h3>{project.name}</h3>
                <p className="muted">{project.description}</p>
                <div className="project-meta-row">
                  <span className="chip">{project.language}</span>
                  <span className="chip accent">⭐ {project.stars}</span>
                </div>
                <a className="btn primary" href={project.htmlUrl} target="_blank" rel="noreferrer">
                  View on GitHub
                </a>
              </motion.article>
            ))}

            {!githubProjects.length && data.projects.map((project) => (
              <motion.article
                className="project-card"
                key={project.title}
                variants={fadeUpItem}
                whileHover={{ y: -8, boxShadow: "0 16px 35px rgba(0, 185, 255, 0.25)" }}
              >
                <h3>{project.title}</h3>
                <p className="muted">{project.timeline}</p>
                <ul>
                  {project.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </motion.div>
        </Section>

        <Section id="certifications" title="Certifications">
          <motion.div
            className="cert-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.12 }}
          >
            {data.certifications.map((certificate) => (
              <motion.article
                className="cert-card"
                key={certificate.title}
                variants={fadeUpItem}
                whileHover={{ y: -8, boxShadow: "0 16px 35px rgba(0, 185, 255, 0.25)" }}
              >
                <img
                  src={resolveMediaUrl(certificate.image)}
                  alt={certificate.title}
                  loading="lazy"
                  onError={(event) => {
                    tryImageFallback(event, CERT_PLACEHOLDER);
                  }}
                />
                <h3>{certificate.title}</h3>
                <p className="muted">{certificate.issuer}</p>
                <p className="muted">{certificate.date}</p>
                <div className="cert-actions">
                  <button
                    className="btn secondary"
                    onClick={() => setSelectedCertificate(resolveMediaUrl(certificate.image))}
                  >
                    View Certificate
                  </button>
                  <button
                    className="btn primary"
                    onClick={() => void downloadCertificate(certificate)}
                    disabled={downloadingCertificate === certificate.title}
                  >
                    {downloadingCertificate === certificate.title ? "Downloading..." : "Download Certificate"}
                  </button>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </Section>

        {selectedCertificate && (
          <div className="certificate-modal" onClick={() => setSelectedCertificate(null)}>
            <img
              src={selectedCertificate}
              alt="Selected certificate"
              onError={(event) => tryImageFallback(event, CERT_PLACEHOLDER)}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
