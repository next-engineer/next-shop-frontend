// lib/api.ts
const base =
process.env.NEXT_PUBLIC_API_BASE_URL ||
process.env.NEXT_PUBLIC_API_BASE || // 혹시 남아있을 구버전 대비
"http://localhost:8080"

export async function apiGet(path: string, init?: RequestInit) {
  const res = await fetch(`${base}${path}`, init)
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`)
  return res.json()
}

export async function apiPost(path: string, body: any, init?: RequestInit) {
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    body: JSON.stringify(body),
    ...init,
  })
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`)
  return res.json()
}
