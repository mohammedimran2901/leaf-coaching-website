/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.squarespace-cdn.com'],
  },
  experimental: {
    // Paid PDFs live outside /public; make sure Vercel traces them into the
    // download route's serverless bundle.
    outputFileTracingIncludes: {
      '/api/download': ['./private/downloads/**/*'],
    },
  },
}

module.exports = nextConfig