import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: [
      'www.unstoppable840.cn',
      'images.unsplash.com',
      'assets.aceternity.com',
    ],
  },
  devIndicators: {
    appIsrStatus: false,
  },
};

export default nextConfig;
