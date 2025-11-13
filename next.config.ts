import type { NextConfig } from 'next';

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
        port: '', // leave empty
        pathname: '/maps/api/staticmap**', // optional, can leave as '*' too
      },
    ],
  },
};
export default nextConfig;
