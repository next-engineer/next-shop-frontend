// app/product/[id]/product-client.tsx
'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';

type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
};

export default function ProductClient({ product }: { product: Product }) {
  const apiBase = useMemo(() => process.env.NEXT_PUBLIC_API_BASE_URL ?? '', []);
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const imgSrc =
    product.imageUrl?.startsWith('http')
      ? product.imageUrl
      : product.imageUrl ?? '/placeholder.jpg';

  const addToCart = async () => {
    try {
      setAdding(true);
      setMsg(null);
      const res = await fetch(`${apiBase}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 쿠키 인증이면 아래 주석 해제
        // credentials: 'include',
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setMsg('장바구니에 담았습니다.');
    } catch (e: any) {
      setMsg(e?.message ?? '장바구니 담기에 실패했습니다.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative w-full aspect-square bg-neutral-900 rounded-2xl overflow-hidden">
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            unoptimized
          />
        </div>
        <div>
          <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
          <div className="text-lg text-gray-400 mb-6">
            {product.price?.toLocaleString()}원
          </div>

          <button
            disabled={adding}
            onClick={addToCart}
            className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            {adding ? '담는 중…' : '장바구니 담기'}
          </button>

          {msg && <p className="mt-4 text-sm text-gray-300">{msg}</p>}

          {product.description && (
            <div className="mt-8 text-gray-300 leading-relaxed">
              {product.description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
