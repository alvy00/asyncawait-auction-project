import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "images.unsplash.com",
      "plus.unsplash.com",
      "i.pravatar.cc",
      "via.placeholder.com",
      'cdn.pixabay.com',
    ],
  },
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@frontend": path.resolve(__dirname, "../frontend"),
      "@backend": path.resolve(__dirname, "../backend"),
      "@docs": path.resolve(__dirname, "../docs"),
      "@types": path.resolve(__dirname, "../frontend/types"),
    };
    return config;
  },
};

export default nextConfig;
