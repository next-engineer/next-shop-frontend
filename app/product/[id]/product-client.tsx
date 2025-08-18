// app/product/[id]/product-client.tsx
"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type Product = {
  id: number;
  name: string;
  description?: string;
  price: number | string;
  imageUrl?: string;
};

export default function ProductClient({ productId }: { productId: number }) {
  const [data, setData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/products/${productId}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const d = await res.json();
        if (!aborted) setData(d);
      } catch (e) {
        console.error("[product] fetch fail", e);
        if (!aborted) setData(null);
      } finally {
        if (!aborted) setLoading(false);
      }
    })();
    return () => {
      aborted = true;
    };
  }, [productId]);

  if (loading) return <div className="p-8">로딩 중…</div>;
  if (!data) return <div className="p-8">상품을 찾을 수 없습니다.</div>;

  return (
    <div className="p-6 grid md:grid-cols-2 gap-8">
      {data.imageUrl ? (
        <img
          src={data.imageUrl}
          alt={data.name}
          className="w-full rounded-xl object-cover"
        />
      ) : (
        <div className="aspect-square bg-gray-200 rounded-xl" />
      )}
      <div>
        <h1 className="text-2xl font-semibold">{data.name}</h1>
        <div className="mt-2 text-xl">
          {Number(data.price).toLocaleString()}원
        </div>
        {data.description && (
          <p className="mt-4 text-gray-700 whitespace-pre-line">
            {data.description}
          </p>
        )}
      </div>
    </div>
  );
}