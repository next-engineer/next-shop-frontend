/** @type {import('next').NextConfig} */

// 개발에서만 프록시; 운영은 ALB 도메인 절대경로로 직접 호출
const nextConfig = {
  output: 'export',             // ✅ 정적 내보내기 활성화 (S3 호스팅용)
  trailingSlash: true,          // ✅ S3/CloudFront 경로 호환
  images: { unoptimized: true },// ✅ 이미지 최적화 비활성 (서버 없이 정적 배포)

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        { source: '/api/:path*', destination: 'http://localhost:8080/api/:path*' },
      ]
    }
    return [] // ✅ 운영은 브라우저가 ALB로 직접 호출 (rewrites 불필요)
  },
}

export default nextConfig
