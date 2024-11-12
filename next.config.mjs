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
          // You can add more remote patterns if needed, for example:
          // {
          //   protocol: 'https',
          //   hostname: 'example.com',
          //   port: '',
          //   pathname: '/images/**',
          // },
        ],
      },
};

export default nextConfig;
