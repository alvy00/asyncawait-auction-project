import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["lh3.googleusercontent.com", "images.unsplash.com","ui-avatars.com",  "plus.unsplash.com"],
  },
};

export default nextConfig;
