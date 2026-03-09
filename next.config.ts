import type { NextConfig } from "next";

const isGithubPages = process.env.DEPLOY_TARGET === "gh-pages";

// github.repository = "owner/repo"
const repoName = (process.env.REPO_NAME || "terminal-portfolio")
  .split("/")
  .pop();

const nextConfig: NextConfig = {
  output: "export",
  distDir: "dist",
  trailingSlash: true,

  images: {
    unoptimized: true,
  },

  basePath: isGithubPages ? `/${repoName}` : "",
  assetPrefix: isGithubPages ? `/${repoName}/` : "",
};

export default nextConfig;