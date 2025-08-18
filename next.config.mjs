/** @type {import('next').NextConfig} */
const trim = (v) => (v || '').replace(/\/+$/, '');

const USER_API = trim(process.env.NEXT_PUBLIC_USER_API_BASE_URL);
const PURCHASE_API = trim(process.env.NEXT_PUBLIC_PURCHASE_API_BASE_URL);

const nextConfig = {
  output: 'export',
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },

  async rewrites() {
    const isDev = process.env.NODE_ENV === 'development';

    const userBase = trim(isDev ? USER_API || 'http://localhost:8081' : USER_API);
    const purchaseBase = trim(isDev ? PURCHASE_API || 'http://localhost:8083' : PURCHASE_API);

    const rules = [];
    if (userBase) {
      rules.push(
          { source: '/api/users/:path*', destination: `${userBase}/api/users/:path*` },
          { source: '/api/auth/:path*', destination: `${userBase}/api/auth/:path*` },
      );
    }
    if (purchaseBase) {
      rules.push(
          { source: '/api/products/:path*', destination: `${purchaseBase}/api/products/:path*` },
          { source: '/api/categories/:path*', destination: `${purchaseBase}/api/categories/:path*` },
          { source: '/api/carts/:path*', destination: `${purchaseBase}/api/carts/:path*` },
          { source: '/api/orders/:path*', destination: `${purchaseBase}/api/orders/:path*` },
          { source: '/api/payments/:path*', destination: `${purchaseBase}/api/payments/:path*` },
          { source: '/api/:path*', destination: `${purchaseBase}/api/:path*` },
      );
    }
    return rules;
  },
};

export default nextConfig;
