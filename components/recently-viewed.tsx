"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

type RecentProduct = {
  id: number | string
  name: string
  price: number | string
  image?: string
  imageUrl?: string
}

function readRecentlyViewed(): RecentProduct[] {
  if (typeof document === "undefined") return []
  const pair = document.cookie.split(";").find((c) => c.trim().startsWith("recentlyViewed="))
  if (!pair) return []
  try {
    const raw = decodeURIComponent(pair.split("=")[1] || "")
    const arr = JSON.parse(raw)
    if (!Array.isArray(arr)) return []
    return arr.map((p: any) => ({
      id: p?.id ?? p?.productId ?? "",
      name: p?.name ?? "",
      price: p?.price ?? p?.amount ?? 0,
      image: p?.image ?? p?.imageUrl,
      imageUrl: p?.imageUrl ?? p?.image,
    }))
  } catch {
    return []
  }
}

export function RecentlyViewed() {
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([])

  useEffect(() => {
    const list = readRecentlyViewed()

    // 중복 제거(앞쪽 우선 유지), 최대 3개
    const seen = new Set<string | number>()
    const dedup: RecentProduct[] = []
    for (const p of list) {
      const key = p.id
      if (key == null || seen.has(key)) continue
      seen.add(key)
      dedup.push(p)
    }
    setRecentProducts(dedup.slice(0, 3))
  }, [])

  if (recentProducts.length === 0) return null

  return (
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">최근 본 상품</h2>

          <div className="flex space-x-6 overflow-x-auto pb-4">
            {recentProducts.map((product) => (
                <Link key={String(product.id)} href={`/product/${product.id}`} className="flex-shrink-0 group">
                  <div className="w-32 h-32 relative rounded-lg overflow-hidden bg-gray-900 group-hover:bg-gray-800 transition-colors">
                    <Image
                        src={product.imageUrl || product.image || "/placeholder.svg"}
                        alt={product.name || "상품"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="mt-3 w-32">
                    <h3 className="text-white text-sm font-medium truncate group-hover:text-gray-300 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {Number(product.price ?? 0).toLocaleString()}원
                    </p>
                  </div>
                </Link>
            ))}
          </div>
        </div>
      </section>
  )
}
