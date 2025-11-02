import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wtynlgilztvqoikrqncq.supabase.co",
      },
    ],
  },
};

export default nextConfig;
