// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
    // 필요하면 원격 이미지 도메인 추가:
    // remotePatterns: [{ protocol: "https", hostname: "shop.nextcloudlab.com" }],
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;