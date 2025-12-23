import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['oacuekchmzilyimjasdh.supabase.co', 'lh3.googleusercontent.com'],
    remotePatterns: [
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
