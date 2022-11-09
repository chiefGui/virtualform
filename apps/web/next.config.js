module.exports = {
  reactStrictMode: true,
  experimental: {
    transpilePackages: ['ui'],
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
    ],
  },
}
