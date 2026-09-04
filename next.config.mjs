/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",

      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
      },

      {
        protocol: "https",
        hostname: "www.usnews.com",
      },
    ],
  },
};


export default nextConfig;