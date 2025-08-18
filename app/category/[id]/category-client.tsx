// app/category/[id]/category-client.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type Product = {
  id: number;
  name: string;
  price: number | string;
  imageUrl?: string;
};

export default function CategoryClient({ categoryId }: { categoryId: number }) {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let aborted = false;
    (async () => {
      setLoading(true);
      try {
        const url = `${API_BASE}/products?categoryId=${categoryId}&page=0&size=12`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.content ?? []);
        if (!aborted) setItems(list);
      } catch (e) {
        console.error("[category] fetch fail", e);
        if (!aborted) setItems([]);
      } finally {
        if (!aborted) setLoading(false);
      }
    })();
    return () => {
      aborted = true;
    };
  }, [categoryId]);

  if (loading) return <div className="p-8">로딩 중…</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-4">
      {items.map((p) => (
        <div key={p.id} className="rounded-xl border p-3">
          {p.imageUrl ? (
            // static export + 외부도메인 대응: <img> 사용
            <img
              src={p.imageUrl}
              alt={p.name}
              className="w-full aspect-square object-cover rounded-lg"
            />
          ) : (
            <div className="w-full aspect-square bg-gray-200 rounded-lg" />
          )}
          <div className="mt-3 font-medium">{p.name}</div>
          <div className="text-sm text-gray-500">
            {Number(p.price).toLocaleString()}원
          </div>
          <Link
            href={`/product-detail?id=${p.id}`}
            className="mt-3 inline-block px-3 py-2 rounded-md bg-black text-white"
          >
            상세보기
          </Link>
        </div>
      ))}
      {items.length === 0 && (
        <div className="col-span-full text-center text-gray-500">
          상품이 없습니다.
        </div>
      )}
    </div>
  );
}