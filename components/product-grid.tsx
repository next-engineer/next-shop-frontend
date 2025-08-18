// components/product-grid.tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

// 배포 환경에서는 NEXT_PUBLIC_API_BASE_URL을 최우선 사용.
// 없으면 동일 도메인의 /api 로 폴백.
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (typeof window !== "undefined" ? `${window.location.origin}/api` : "")

type Product = {
  id: number
  name: string
  price: number
  imageUrl: string
  categoryId: number
}

export default function ProductGrid() {
  const [data, setData] = useState<Record<number, Product[]>>({})
  const categoryIds = [1, 2, 3, 4, 5]

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const entries = await Promise.all(
          categoryIds.map(async (cid) => {
            const res = await fetch(
              `${API_BASE}/products?categoryId=${cid}&page=0&size=8`,
              { cache: "no-store" }
            )
            const json = await res.json()
            return [cid, (json.content ?? []) as Product[]] as const
          })
        )
        if (!cancelled) {
          setData(Object.fromEntries(entries))
        }
      } catch (e) {
        console.error("Failed to load products:", e)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16">
      <h2 className="sr-only">추천 상품 섹션</h2>

      {categoryIds.map((cid) => (
        <div key={cid} className="mb-12">
          <h3 className="mb-4 text-lg font-semibold">카테고리 {cid}</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {(data[cid] ?? []).map((p) => (
              <article
                key={p.id}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5"
              >
                <Link href={`/product/${p.id}`} className="block">
                  <div className="relative aspect-[4/3] w-full">
                    {p.imageUrl ? (
                      <Image
                        src={p.imageUrl}
                        alt={p.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 25vw"
                        priority={false}
                        unoptimized={true}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-white/60">
                        이미지 없음
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 p-4">
                    <h4 className="line-clamp-2 text-sm font-medium">{p.name}</h4>
                    <p className="text-sm text-white/70">{p.price.toLocaleString()}원</p>
                    <span className="inline-flex items-center gap-1 text-xs text-blue-400 underline">
                      상세보기
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
