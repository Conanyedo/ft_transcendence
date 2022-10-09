
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SERVER_URL: process.env?.SERVER_URL,
    GAME_URL: process.env?.GAME_URL,
    SERVER_URL_LOCAL: process.env?.SERVER_URL_LOCAL,
    GAME_URL_LOCAL: process.env?.GAME_URL_LOCAL
  },
  reactStrictMode: false,
  swcMinify: true,
  images: {
		remotePatterns: [
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    domains: ['robohash.org', 'cdn.intra.42.fr', 'lh3.googleusercontent.com', 'localhost', 'ui-avatarsx70.com', 'e1r7p11.1337.ma'],
    formats: ['image/avif', 'image/webp'],
  },
}

module.exports = nextConfig
