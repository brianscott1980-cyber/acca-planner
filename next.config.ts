import type { NextConfig } from "next";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH;
const projectBasePath =
  configuredBasePath ?? (repositoryName ? `/${repositoryName}` : "");

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: projectBasePath,
  },
  basePath: projectBasePath,
  assetPrefix: projectBasePath || undefined,
};

export default nextConfig;
