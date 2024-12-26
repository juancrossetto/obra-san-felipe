import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'obrasanfelipe.s3.us-east-2.amazonaws.com',
      },
    ],
  }
};

export default nextConfig;
