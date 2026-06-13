// next.config.js
const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' }
    ]
  },
  // PWA configuration
  ...(process.env.NODE_ENV === 'production'
    ? withPWA({
        dest: 'public',
        runtimeCaching,
        register: true,
        skipWaiting: true,
        buildExcludes: [/middleware-manifest.json/]
      })
    : {}),
}

module.exports = nextConfig
