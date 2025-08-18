"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// 필요한 만큼 노출할 카테고리 ID들
const CATEGORY_IDS = [1, 2, 3, 4, 5];

// API 응답 타입(필드명은 백엔드 응답에 맞춰 사용)
type Product = {
  id: number;
  name: string;
  price: number | string;
  imageUrl: string;
  categoryId: number;
};

type PageResponse<T> = {
  content: T[];
  totalElements: number;
  number: number;
  size: number;
};

export default function ProductGrid() {
  const [itemsByCat, setItemsByCat] = useState<Record<number, Product[]>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    const fetchAll = async () => {
      try {
        // 홈은 가볍게 각 카테고리 당 12개 정도만
        const pageSize = 12;

        const promises = CATEGORY_IDS.map(async (cid) => {
          const url = `${API_BASE}/products?categoryId=${cid}&page=0&size=${pageSize}`;
          const res = await fetch(url, { cache: "no-store" });
          if (!res.ok) throw new Error(`Fetch failed: ${url}`);
          const json = (await res.json()) as PageResponse<Product>;
          return { cid, list: json.content ?? [] };
        });

        const results = await Promise.all(promises);

        if (!mounted) return;
        const next: Record<number, Product[]> = {};
        results.forEach(({ cid, list }) => (next[cid] = list));
        setItemsByCat(next);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAll();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16">
        <p className="text-sm text-gray-400">불러오는 중…</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16">
      <h2 className="sr-only">추천 상품 섹션</h2>

      {CATEGORY_IDS.map((cid) => {
        const list = itemsByCat[cid] ?? [];
        if (!list.length) return null;

        return (
          <div key={cid} className="mb-12">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">카테고리 {cid}</h3>
              <Link
                href={`/category/${cid}`}
                className="text-sm text-gray-300 hover:underline"
              >
                더 보기
              </Link>
            </div>

            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {list.map((p) => (
                <li
                  key={p.id}
                  className="overflow-hidden rounded-xl border border-white/10 bg-white/5"
                >
                  <Link
                    // ✅ 상세보기 링크는 product-detail?id= 로
                    href={`/product-detail?id=${p.id}`}
                    className="block"
                  >
                    <div className="relative aspect-[4/5] w-full">
                      {/* 외부 이미지라면 next.config의 images.domains 설정 필요 */}
                      <Image
                        src={p.imageUrl}
                        alt={p.name}
                        fill
                        sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                        className="object-cover"
                        priority={false}
                        unoptimized
                      />
                    </div>
                    <div className="p-3">
                      <p className="line-clamp-2 text-sm">{p.name}</p>
                      <p className="mt-1 text-sm font-semibold">
                        {typeof p.price === "number" ? p.price.toLocaleString() : p.price}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </section>
  );
}
