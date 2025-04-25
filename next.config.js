/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async headers() {
    const isDev = process.env.NODE_ENV === 'development';

    // --- BACKUP OF ORIGINAL CSP ---
    // default-src 'self';
    // script-src 'self' 'unsafe-inline' https://telegram.org https://*.telegram.org https://t.me https://vercel.live${isDev ? " 'unsafe-eval'" : ""};
    // style-src 'self' 'unsafe-inline';
    // img-src 'self' data:;
    // connect-src 'self' https://whalebux-vercel.onrender.com${isDev ? " http://localhost:8080" : ""};
    // font-src 'self';
    // object-src 'none';

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://telegram.org https://*.telegram.org https://t.me;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https://*.telegram.org;
              connect-src 'self' https://whalebux-vercel.onrender.com https://*.telegram.org${isDev ? " http://localhost:8080" : ""};
              font-src 'self';
              object-src 'none';
              frame-src 'self' https://*.telegram.org;
              frame-ancestors 'self' https://*.telegram.org;
            `.replace(/\s{2,}/g, ' ').trim(),
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With',
          },
        ],
      },
    ];
  },

  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = 'cheap-module-source-map';
    }
    return config;
  },
};

module.exports = nextConfig;
