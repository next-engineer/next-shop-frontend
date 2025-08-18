// app/product/[id]/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductClient from './product-client';

type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
};

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const apiBase = useMemo(() => process.env.NEXT_PUBLIC_API_BASE_URL ?? '', []);

  useEffect(() => {
    let alive = true;
    async function run() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${apiBase}/products/${id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (alive) setData(json);
      } catch (e: any) {
        if (alive) setError(e?.message ?? '상품을 불러오지 못했습니다.');
      } finally {
        if (alive) setLoading(false);
      }
    }
    if (id) run();
    return () => { alive = false; };
  }, [apiBase, id]);

  if (loading) return <div className="p-8 text-gray-400">불러오는 중…</div>;
  if (error)   return <div className="p-8 text-red-400">오류: {error}</div>;
  if (!data)   return <div className="p-8">상품을 찾을 수 없습니다.</div>;

  return <ProductClient product={data} />;
}
