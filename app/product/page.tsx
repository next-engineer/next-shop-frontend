'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  // 필요 필드 이어서...
};

export default function ProductDetailPage() {
  const searchParams = useSearchParams();
  const pid = searchParams.get('pid');
  const [data, setData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pid) return;
    const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
    fetch(`${base}/products/${pid}`)
      .then((res) => {
        if (!res.ok) throw new Error('failed');
        return res.json();
      })
      .then((json) => setData(json))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [pid]);

  if (!pid) return <div style={{ padding: 24 }}>잘못된 접근입니다.</div>;
  if (loading) return <div style={{ padding: 24 }}>불러오는 중…</div>;
  if (!data) return <div style={{ padding: 24 }}>상품을 찾을 수 없습니다.</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{data.name}</h1>
      {data.imageUrl && (
        // next/image를 쓰면 도메인 화이트리스트가 필요합니다.
        // <Image src={data.imageUrl} alt={data.name} width={600} height={600} />
        <img src={data.imageUrl} alt={data.name} style={{ maxWidth: 600 }} />
      )}
      <p className="mt-2">{data.price.toLocaleString()}원</p>

      {/* 장바구니/주문 API 호출 버튼은 기존 로직 재사용 */}
      {/* 예: <AddToCartButton productId={data.id} /> */}
    </div>
  );
}