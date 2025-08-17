"use client";

import { useEffect, useState } from "react";

type Product = { id: number; name: string; price: number | string; imageUrl?: string };

const CATEGORY_IDS = [1, 2, 3, 4, 5]; // 필요에 맞게 조정

export default function ProductGrid() {
  const [itemsByCat, setItemsByCat] = useState<Record<number, Product[]>>({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setErr(null);
      try {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
        const results = await Promise.all(
          CATEGORY_IDS.map(async (cid) => {
            const url = new URL("/api/products", base);
            url.searchParams.set("categoryId", String(cid));
            url.searchParams.set("page", "0");
            url.searchParams.set("size", "3");
            const r = await fetch(url.toString(), { cache: "no-store" });
            if (!r.ok) throw new Error(`/${cid}: ${r.status}`);
            const page = await r.json(); // { content: Product[] } 형태라면 page.content 사용
            const list = Array.isArray(page?.content) ? page.content : (Array.isArray(page) ? page : []);
            return [cid, list as Product[]] as const;
          })
        );
        if (!cancelled) {
          const next: Record<number, Product[]> = {};
          results.forEach(([cid, list]) => (next[cid] = list));
          setItemsByCat(next);
        }
      } catch (e: any) {
        if (!cancelled) setErr(e?.message ?? "fetch 실패");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <div className="py-8">상품 로딩 중…</div>;
  if (err) return <div className="py-8 text-red-500">에러: {err}</div>;

  return (
    <div className="space-y-10">
      {CATEGORY_IDS.map((cid) => {
        const items = itemsByCat[cid] ?? [];
        return (
          <section key={cid}>
            <h2 className="text-xl font-semibold mb-4">카테고리 {cid}</h2>
            {items.length === 0 ? (
              <div className="text-gray-400">상품이 없습니다.</div>
            ) : (
              <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {items.map((p) => (
                  <li key={p.id} className="rounded-md border border-gray-700 p-3">
                    <div className="mb-2 text-sm opacity-80">#{p.id}</div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="opacity-80">{String(p.price)}</div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
