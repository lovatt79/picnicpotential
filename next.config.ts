import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "aahdzynqhkfgrkfpxwbg.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/sendahint",
        destination: "/send-a-hint",
        permanent: true,
      },
      {
        source: "/standard-picnic",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/microparty-picnic",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/packages",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/proposal-picnic",
        destination: "/services#proposals",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
