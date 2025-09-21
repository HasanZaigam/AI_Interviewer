import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'developers.google.com',
        port: '',
        pathname: '/identity/images/**',
      },
    ],
  },
};

export default nextConfig;
