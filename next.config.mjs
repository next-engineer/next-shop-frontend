/** @type {import('next').NextConfig} */
const API_BASE = process.env.NEXT_PUBLIC_TEST_API_BASE || '';

const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },

  async rewrites() {
    // 개발: 백엔드 로컬 8080
    if (process.env.NODE_ENV === 'development') {
      return [{ source: '/api/:path*', destination: 'http://localhost:8080/api/:path*' }];
    }
    // 운영: 환경변수에 넣어둔 백엔드 도메인으로 프록시
    if (API_BASE) {
      return [{ source: '/api/:path*', destination: `${API_BASE}/api/:path*` }];
    }
    return [];
  },
}

export default nextConfig
