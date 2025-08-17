/** @type {import('next').NextConfig} */

// 개발에서만 프록시; 운영은 ALB 도메인 절대경로로 직접 호출
const nextConfig = {
  output: 'export',             // ✅ 정적 내보내기 활성화 (S3 호스팅용)
  trailingSlash: true,          // ✅ S3/CloudFront 경로 호환
  images: { unoptimized: true },// ✅ 이미지 최적화 비활성 (서버 없이 정적 배포)

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },


};

export default nextConfig;
