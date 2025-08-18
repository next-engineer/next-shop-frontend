// app/product-detail/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  // 필요한 필드 추가
};

export default function ProductDetailPage() {
  const search = useSearchParams();
  const router = useRouter();
  const id = useMemo(() => search.get("id"), [search]);
  const [data, setData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
    fetch(`${base}/products/${id}`)
      .then((r) => r.ok ? r.json() : Promise.reject(r))
      .then((json) => setData(json))
      .catch(() => {
        // 잘못된 id면 메인으로
        router.replace("/");
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  if (!id) return <div>잘못된 접근입니다.</div>;
  if (loading) return <div>불러오는 중…</div>;
  if (!data) return <div>상품을 찾을 수 없습니다.</div>;

  return (
    <main className="container">
      <div className="detail">
        <Image src={data.imageUrl} alt={data.name} width={800} height={800} />
        <div className="spec">
          <h1>{data.name}</h1>
          <p>{data.price.toLocaleString()}원</p>

          {/* 장바구니/주문 버튼 – 기존 client 컴포넌트(예: ActionButtons) 재사용 */}
          {/* <ActionButtons productId={data.id} /> */}
        </div>
      </div>
    </main>
  );
}
