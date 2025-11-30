import type { NextConfig } from 'next';

const nextConfig = {
  images: {
    domains: ['oacuekchmzilyimjasdh.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
        port: '', // leave empty
        pathname: '/maps/api/staticmap**', // optional, can leave as '*' too
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/leafletHome_panel_super',
      },
    ];
  },
};

export default nextConfig;
