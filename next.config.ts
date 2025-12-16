import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

if (process.env.NODE_ENV === 'development') {
  // In development, allow requests from the Cloud Workstation preview URL.
  // This is necessary to prevent cross-origin errors.
  // For more details, see: https://nextjs.org/docs/app/api-reference/config/next-config-js/allowedDevOrigins
  if (process.env.WEB_HOST) {
    nextConfig.experimental = {
      ...nextConfig.experimental,
      allowedDevOrigins: [
        `https://${process.env.WEB_HOST}`,
      ],
    };
  }
}

export default nextConfig;
