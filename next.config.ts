import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    remote_connection: "",
    local_connection: "http://localhost:8000"
  },
};

export default nextConfig;
