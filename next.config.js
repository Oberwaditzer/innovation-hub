/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');
const nextConfig = {
  reactStrictMode: false,
  i18n,
  webpack: function (config, options) {
    config.experiments = { layers: true, topLevelAwait: true }
    return config;
  }
}

module.exports = nextConfig
