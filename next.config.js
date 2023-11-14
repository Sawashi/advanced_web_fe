const isProd = process.env.NODE_ENV === 'production'
const withPWA = require('next-pwa')

module.exports = withPWA({
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL
  },
  pwa: {
    disable: true,
    dest: 'public'
  }
})
