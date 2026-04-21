/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['tesseract.js', 'pdf-parse'],
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version,
  },
}

module.exports = nextConfig
