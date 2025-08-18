// app/product/product-detail.tsx
"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  ""

type Product = {
  id: number
  name: string
  price: number
  imageUrl: string
  description?: string
}

export default function ProductDetail({ pid }: { pid: string }) {
  const [data, setData] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!pid) { setLoading(false); return }
    ;(async () => {
      try {
        const res = await fetch(`${API_BASE}/products/${pid}`, { cache: "no-store" })
        if (!res.ok) throw new Error("상품 조회 실패")
        const json = (await res.json()) as Product
        setData(json)
      } catch (e) {
        setError("상품을 불러오지 못했어요.")
      } finally {
        setLoading(false)
      }
    })()
  }, [pid])

  if (!pid) return <p className="p-6">잘못된 접근입니다.</p>
  if (loading) return <p className="p-6">불러오는 중…</p>
  if (error) return <p className="p-6 text-red-400">{error}</p>
  if (!data) return null

  return (
    <main className="mx-auto max-w-5xl px-4 pb-16">
      <h1 className="mb-6 text-2xl font-bold">{data.name}</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="relative aspect-square w-full">
          <Image
            src={data.imageUrl}
            alt={data.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div>
          <p className="mb-4 text-xl">{data.price.toLocaleString()}원</p>
          {/* TODO: 장바구니/주문 버튼 연결 */}
        </div>
      </div>
    </main>
  )
}
