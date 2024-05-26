/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "images.pexels.com",
      "www.pexels.com",
      "images.unsplash.com",
      "lh3.googleusercontent.com",
      "firebasestorage.googleapis.com",
      "res.cloudinary.com",
    ],
  },
};

module.exports = nextConfig;
