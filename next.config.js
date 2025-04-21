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
        source: '/(.*)', // Apply to all routes
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' https://telegram.org https://*.telegram.org https://t.me https://vercel.live${isDev ? " 'unsafe-eval'" : ""};
              style-src 'self' 'unsafe-inline';
              img-src 'self' data:;
              connect-src 'self' https://whalebux-vercel.onrender.com${isDev ? " http://localhost:8080" : ""};
              font-src 'self';
              object-src 'none';
            `.replace(/\s{2,}/g, ' ').trim(), // Minify the CSP string
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
