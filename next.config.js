/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable strict mode to reduce hydration mismatches
  reactStrictMode: false,
  swcMinify: true,
  // Add configuration to optimize page buffer
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
};

module.exports = nextConfig;
