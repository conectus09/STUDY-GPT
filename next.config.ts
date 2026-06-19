import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Short aliases for uptime monitors — both map to the same lightweight handler.
  async rewrites() {
    return [
      { source: "/health", destination: "/api/health" },
      { source: "/ping", destination: "/api/health" },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/doafv0hxx/**",
      },
    ],
  },
};

export default nextConfig;