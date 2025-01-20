/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // Disable static image optimization since we don't use it
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
