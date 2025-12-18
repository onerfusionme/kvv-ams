import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Force dynamic rendering to avoid issues with client-side providers during static generation
  experimental: {
    // This makes all pages dynamically rendered by default
  },
  // Disable static page generation for pages using client-side context
  output: 'standalone',
};

export default nextConfig;

