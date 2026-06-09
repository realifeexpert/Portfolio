import cors from "cors";
import fs from "fs";
import express from "express";
import path from "path";
import { resumeData } from "./data/resumeData";

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

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_PUBLIC_DIR = path.resolve(__dirname, "../../frontend/public");
const FRONTEND_DIST_DIR = path.resolve(__dirname, "../../frontend/dist");

app.use(cors());
app.use(express.json());
app.use(
  "/profile",
  express.static(path.join(FRONTEND_PUBLIC_DIR, "profile"))
);
app.use(
  "/certifications",
  express.static(path.join(FRONTEND_PUBLIC_DIR, "certifications"))
);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "Backend is running" });
});

app.get("/api/portfolio", (_req, res) => {
  res.json(resumeData);
});

app.get("/api/github-projects", async (_req, res) => {
  const username = resumeData.githubUsername;
  const blockedRepoTerms = ["python-program", "python program", "python tutorial", "python-tutorial", "tutorial"];
  const pinnedProject = {
    id: -1,
    name: "Supply Chain AI Dashboard",
    description:
      "AI-driven dashboard for monitoring supply chain signals, forecasting trends, and supporting faster operational decisions.",
    htmlUrl: "https://github.com/realifeexpert/supply-chain-ai-dashboard",
    language: "AI / Analytics",
    stars: 0,
    updatedAt: ""
  };

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "cyber-portfolio-backend"
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Failed to fetch repositories from GitHub"
      });
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

    return res.json(projects);
  } catch {
    return res.status(500).json({ error: "Unable to fetch GitHub projects right now" });
  }
});

app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body as {
    name?: string;
    email?: string;
    message?: string;
  };

  if (!name || !email || !message) {
    return res.status(400).json({ error: "name, email and message are required" });
  }

  return res.status(201).json({
    status: "received",
    details: "Thanks for reaching out. Your message has been captured.",
    payload: { name, email }
  });
});

if (fs.existsSync(FRONTEND_DIST_DIR)) {
  app.use(express.static(FRONTEND_DIST_DIR));

  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(path.join(FRONTEND_DIST_DIR, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
