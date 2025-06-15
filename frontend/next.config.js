/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['159.223.26.190'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Disable static page generation
  staticPageGenerationTimeout: 0,
  // Force server-side rendering
  experimental: {
    serverActions: true,
  },
  // Disable static optimization
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
