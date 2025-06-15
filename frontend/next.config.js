/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', '159.223.26.190'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/api/images/**',
      },
      {
        protocol: 'http',
        hostname: '159.223.26.190',
        port: '8000',
        pathname: '/api/images/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
}

module.exports = nextConfig
