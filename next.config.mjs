/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', "fr", "de", "it", "fa"],
    defaultLocale: 'en',
  },
  images: {
    domains: ['localhost'],
  },
};

export default nextConfig;
