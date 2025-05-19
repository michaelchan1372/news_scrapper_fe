import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    remote_connection: "http://18.118.2.9",
    local_connection: "http://localhost:8000"
  },
};

export default nextConfig;
