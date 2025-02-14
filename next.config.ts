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
  webpack(config, { isServer }) {
    if (!isServer) {
      // 只在客户端启用 worker-loader
      config.module.rules.push({
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' },
      });
    }
    return config;
  },
};

export default nextConfig;
