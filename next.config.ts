import type { NextConfig } from "next";

const isNetlifyBuild =
  process.env.NETLIFY === "true" ||
  process.env.NETLIFY_STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isNetlifyBuild
    ? {
        output: "export" as const,
        trailingSlash: true,
        images: {
          unoptimized: true,
        },
      }
    : {}),
};

export default nextConfig;
