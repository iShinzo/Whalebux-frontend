/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable production source maps
  productionBrowserSourceMaps: false,

  async headers() {
    // Always use production settings
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src * 'self' data: blob: 'unsafe-inline' 'unsafe-eval';
              script-src * 'self' data: blob: 'unsafe-inline' 'unsafe-eval' https://telegram.org https://*.telegram.org;
              connect-src * 'self' data: blob: 'unsafe-inline' https://whalebux-vercel.onrender.com https://*.telegram.org https://api.telegram.org;
              img-src * 'self' data: blob: https://*.telegram.org https://t.me;
              frame-src * 'self' data: blob: https://*.telegram.org https://t.me;
              style-src * 'self' data: blob: 'unsafe-inline';
              font-src * 'self' data: blob: https://*.telegram.org;
              worker-src 'self' blob:;
            `.replace(/\s{2,}/g, ' ').trim(),
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With, x-telegram-bot-api-secret-token',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          // Add security headers
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Production optimizations
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig;
