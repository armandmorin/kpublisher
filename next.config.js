/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add transpilePackages to handle react-quill
  transpilePackages: ['react-quill'],
  // Configure webpack to handle CSS files
  webpack: (config) => {
    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    });
    return config;
  },
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
    // Use valid Next.js 15 experimental options
    appDir: true,
    serverActions: {
      allowedOrigins: ['localhost:3000', 'netlify.app'],
    },
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
