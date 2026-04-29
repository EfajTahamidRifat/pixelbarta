/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Allow the /api/feed route up to 30s on Vercel (prevents timeout on cold starts)
  serverExternalPackages: ['rss-parser'],
}

export default nextConfig
