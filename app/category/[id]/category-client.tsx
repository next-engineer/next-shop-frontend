"use client";

import { useEffect, useState } from "react";

type Product = { id: number; name: string; price: number | string; imageUrl?: string };

export default function CategoryClient({ id }: { id: string }) {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setErr(null);
      try {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
        const url = new URL("/api/products", base);
        url.searchParams.set("categoryId", id);
        url.searchParams.set("page", "0");
        url.searchParams.set("size", "12");
        const res = await fetch(url.toString(), { cache: "no-store" });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        const list = Array.isArray(data?.content) ? data.content : (Array.isArray(data) ? data : []);
        if (!cancelled) setItems(list);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message ?? "불러오기 실패");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <div className="p-6">상품 로딩 중…</div>;
  if (err) return <div className="p-6 text-red-500">에러: {err}</div>;
  if (items.length === 0) return <div className="p-6">해당 카테고리의 상품이 없습니다.</div>;

  return (
    <main className="container py-6">
      <h1 className="text-2xl font-bold mb-4">카테고리 {id}</h1>
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((p) => (
          <li key={p.id} className="rounded-md border border-gray-700 p-3">
            <div className="mb-2 text-sm opacity-80">#{p.id}</div>
            <div className="font-semibold">{p.name}</div>
            <div className="opacity-80">{String(p.price)}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}
