/** @type {import('next').NextConfig} */

// 개발용 프록시만 유지 (로컬 개발 편의)
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },

  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [{ source: '/api/:path*', destination: 'http://localhost:8080/api/:path*' }]
    }
    // 프로덕션은 브라우저에서 ALB 도메인을 직접 호출 (rewrites 불필요)
    return []
  },
}

export default nextConfig