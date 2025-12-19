/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config:any) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      // Ignore optional peer dependencies for unused wallet connectors
      '@react-native-async-storage/async-storage': false,
      '@gemini-wallet/core': false,
      'porto': false,
      'porto/internal': false,
    };
    return config;
  },
}
 
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
 
module.exports = withBundleAnalyzer(nextConfig)