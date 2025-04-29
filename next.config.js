/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  api: {
    responseLimit: false,
  },
  experimental: {
    serverComponentsExternalPackages: ['puppeteer-core', 'chrome-aws-lambda'],
  },
}

module.exports = nextConfig
