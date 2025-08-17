"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type Product = { id: number; name: string; price: number | string; imageUrl?: string };

export default function SearchContent() {
  const sp = useSearchParams();
  const q = useMemo(() => sp.get("q") ?? "", [sp]);

  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!q) { setItems([]); return; }
      setLoading(true);
      setError(null);
      try {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
        const url = new URL("/api/products/search", base);
        url.searchParams.set("q", q);
        const res = await fetch(url.toString(), { cache: "no-store" }); // 런타임 호출
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        const list = Array.isArray(data?.content) ? data.content : (Array.isArray(data) ? data : []);
        if (!cancelled) setItems(list);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "검색 실패");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [q]);

  if (!q) return <div>검색어를 입력해 주세요.</div>;
  if (loading) return <div>검색 중…</div>;
  if (error) return <div className="text-red-500">에러: {error}</div>;
  if (items.length === 0) return <div>“{q}”에 대한 결과가 없습니다.</div>;

  return (
    <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((p) => (
        <li key={p.id} className="rounded-md border border-gray-700 p-3">
          <div className="mb-2 text-sm opacity-80">#{p.id}</div>
          <div className="font-semibold">{p.name}</div>
          <div className="opacity-80">{String(p.price)}</div>
        </li>
      ))}
    </ul>
  );
}