const { i18n } = require("./next-i18next.config");

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,
  output: "standalone",
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: { domains: ["object.pscloud.io"] },
  async rewrites() {
    return [
      // {
      //   source: "/js/script.js",
      //   destination: "https://analytics.limpid.kz/js/script.js",
      // },
      // {
      //   source: "/api/event",
      //   destination: "https://analytics.limpid.kz/api/event",
      // },
    ];
  },
  transpilePackages: ["react-pdf"],
};

module.exports = nextConfig;
