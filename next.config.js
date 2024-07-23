// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    domains: ["localhost"],
  },
  poweredByHeader: false,
  output: "standalone",
  cleanDistDir: true,
}

module.exports = nextConfig
