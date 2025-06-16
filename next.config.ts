import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    remote_connection: "https://api.safersearch.org",
    local_connection: "http://localhost:8000"
  },
  async rewrites() {
    return [
      {
        source: '/api/scrape',
        destination: 'http://18.118.2.9/scrape',
      },
    ];
  },
  pageExtensions: ['ts', 'tsx'],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
