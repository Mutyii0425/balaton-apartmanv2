/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // EZ AZ ÚJ RÉSZ:
  async redirects() {
    return [
      {
        source: '/',
        destination: '/info', // Itt add meg azt az útvonalat, ami az információs oldalad (pl. /info vagy /gyik)
        permanent: true,
      },
    ]
  },
};

export default nextConfig;