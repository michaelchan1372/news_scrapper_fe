import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    remote_connection: "https://safersearch.org",
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
};

export default nextConfig;
