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
    domains: [
              "lh3.googleusercontent.com",
              "images.unsplash.com",  
              "plus.unsplash.com", 
              "images.unsplash.com",
              "i.pravatar.cc",
              "via.placeholder.com"
    ],
  },
};

export default nextConfig;
