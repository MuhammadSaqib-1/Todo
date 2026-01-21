/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_BACKEND_API_URL: process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000',
  },
  // Enable API proxy for local development
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_BACKEND_API_URL ? `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/:path*` : 'http://localhost:8000/:path*',
      },
    ]
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('bcrypt', 'jsonwebtoken');
    }
    return config;
  },
}

module.exports = nextConfig