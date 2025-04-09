/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable strict mode to avoid double rendering in development
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Disable server components for now to avoid issues
    serverComponents: false,
    // Disable server actions for now to avoid issues
    serverActions: false,
  },
  // Increase the build timeout
  staticPageGenerationTimeout: 180,
  // Disable image optimization during build to speed up the process
  images: {
    unoptimized: true,
  },
  // Disable source maps in production to reduce bundle size
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig
