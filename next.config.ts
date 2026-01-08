import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oacuekchmzilyimjasdh.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
        pathname: '/maps/api/staticmap**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/Home',
      },
    ];
  },
};

export default nextConfig;
