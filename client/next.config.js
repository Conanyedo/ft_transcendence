
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ['https://cdn.intra.42.fr'],
  },
}

module.exports = nextConfig
