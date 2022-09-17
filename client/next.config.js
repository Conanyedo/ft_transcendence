
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ['robohash.org', 'cdn.intra.42.fr'],
    formats: ['image/avif', 'image/webp'],
  },
}

module.exports = nextConfig
