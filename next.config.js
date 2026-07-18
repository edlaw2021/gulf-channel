/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow logos referenced from external venue sites (e.g. Saltwater Hippie,
    // Hurricane Eddie's) without needing to download/host them ourselves.
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};
module.exports = nextConfig;
