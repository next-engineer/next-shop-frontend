"use client";

import { useEffect, useState } from "react";

type Product = { id: number; name: string; price: number | string; imageUrl?: string };

export default function ProductClient({ id }: { id: string }) {
  const [item, setItem] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setErr(null);
      try {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
        const url = new URL(`/api/products/${id}`, base);
        const res = await fetch(url.toString(), { cache: "no-store" });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        if (!cancelled) setItem(data);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message ?? "상품 조회 실패");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <div className="p-6">상품 로딩 중…</div>;
  if (err) return <div className="p-6 text-red-500">에러: {err}</div>;
  if (!item) return <div className="p-6">상품이 없습니다.</div>;

  return (
    <main className="container py-6">
      <h1 className="text-2xl font-bold mb-4">{item.name}</h1>
      <div className="opacity-80 mb-2">#{item.id}</div>
      <div className="opacity-80">{String(item.price)}</div>
      {/* 필요 시 이미지/옵션 등 추가 */}
    </main>
  );
}
