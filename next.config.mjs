// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    remotePatterns: [
          { protocol: 'https', hostname: 'image.msscdn.net' },
          { protocol: 'https', hostname: 'images.msscdn.net' }, // 혹시 쓰면 대비
          { protocol: 'https', hostname: 'img.msscdn.net' },    // 혹시 쓰면 대비
          // 필요시 더 추가: { protocol: 'https', hostname: '***.musinsa.com' } 등
        ],
        unoptimized: false,
      },
};

export default nextConfig;