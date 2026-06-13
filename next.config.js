// next.config.js
const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['firebasestorage.googleapis.com', 'lh3.googleusercontent.com']
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en'
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
