/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [{
      hostname: 'pets-api-staging-assets.s3.eu-west-2.amazonaws.com',
      protocol: 'https',
    }]
  }
};

export default nextConfig;
