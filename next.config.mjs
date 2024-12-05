/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'event-management-suraj.s3.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      // Add more remote patterns if needed
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // Disables ESLint during builds
  },
};

export default nextConfig;
