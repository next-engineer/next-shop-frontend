export async function apiGet<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>
) {
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";
  const url = new URL(path, base);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    });
  }
  console.log("fetch URL:", url.toString()); // 확인용 로그
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status} ${res.statusText}: ${body}`);
  }
  return (await res.json()) as T;
}
