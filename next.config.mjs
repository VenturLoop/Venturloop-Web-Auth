/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        // port: '', // Not needed unless specific port
        // pathname: '/account123/**', // If paths are specific
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // For Google avatars
      },
      {
        protocol: 'https',
        hostname: 'media.licdn.com', // For LinkedIn avatars (example, verify actual hostname)
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com', // For fallback avatars
      },
    ],
  },
};

export default nextConfig;
