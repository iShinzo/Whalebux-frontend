/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/', // Keep this if your main page is `app/page.tsx`
        permanent: true, // Set this to true for permanent redirect
      },
    ];
  },
};

module.exports = nextConfig;
