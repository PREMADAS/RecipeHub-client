/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: 'https', hostname: 'i.pinimg.com' },
      { protocol: "https", hostname: "www.usnews.com" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_URL}/api/:path*`, // server URL, NEXT_PUBLIC_ ছাড়া
      },
    ];
  },
};

export default nextConfig;