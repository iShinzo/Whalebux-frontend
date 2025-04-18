/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async headers() {
    return [
      {
        source: '/(.*)', // Apply to all routes
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'nonce-<GENERATED_NONCE>';
              style-src 'self' 'unsafe-inline';
              img-src 'self' data:;
              connect-src 'self' https://whalebux-vercel.onrender.com;
              font-src 'self';
              object-src 'none';
            `.replace(/\s{2,}/g, ' ').trim(), // Minify the CSP string
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;