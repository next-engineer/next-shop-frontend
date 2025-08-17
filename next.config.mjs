/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',               // next export 대체
  trailingSlash: true,            // S3/CloudFront 정적호스팅 안정화
  images: {
    // static export에서는 반드시 최적화 끄기
    unoptimized: true,
    // 외부 이미지 도메인 화이트리스트
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.msscdn.net'
      },
      // (필요 시 여기 추가)
      // { protocol: 'https', hostname: 'img.example.com', pathname: '/**' },
    ],
  },
};

export default nextConfig;