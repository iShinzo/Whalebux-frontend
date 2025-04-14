/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/page',
        permanent: true, // Set this to true if the redirect is permanent.
      },
    ];
  },
};

module.exports = nextConfig;
