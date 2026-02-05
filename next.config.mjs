/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! FIGYELEM: Ez engedi át a hibás kódot is !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // !! FIGYELEM: Ez engedi át a formázási hibákat is !!
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;