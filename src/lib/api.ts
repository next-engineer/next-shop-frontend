// src/lib/api.ts
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!; // 예: https://shop.nextcloudlab.com/api

export async function apiFetch(input: string, init?: RequestInit) {
  const url = input.startsWith('http')
    ? input
    : `${BASE}${input.startsWith('/') ? '' : '/'}${input}`;

  return fetch(url, {
    credentials: 'include', // 로그인/주문 등 쿠키 쓸 때
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
}
