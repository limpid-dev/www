/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { domains: ["object.pscloud.io"] },
  async rewrites() {
    return [
      {
        source: "/js/script.js",
        destination: "https://analytics.limpid.kz/js/script.js",
      },
      {
        source: "/api/event",
        destination: "https://analytics.limpid.kz/api/event",
      },
    ];
  },
  transpilePackages: ["react-pdf"],
};

module.exports = nextConfig;
