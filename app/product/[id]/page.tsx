// app/product/[id]/page.tsx
import React from "react"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || ""

type Product = {
  id: number
  name: string
  price: number | string
  description?: string
  imageUrl?: string
}

export const dynamicParams = false
export async function generateStaticParams() {
  // 운영에선 목록 API로 일부 id만 정적으로 생성해도 충분
  return ["1", "2", "3", "4", "5"].map((id) => ({ id }))
}

async function fetchProduct(id: string) {
  const url = `${API_BASE}/products/${id}` // ← 실제 상세 API 경로로 맞추기
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) throw new Error(await res.text())
  return (await res.json()) as Product
}

export default async function ProductPage({
  params,
}: {
  params: { id: string }
}) {
  const p = await fetchProduct(params.id)

  return (
    <main className="container mx-auto px-4 pt-6 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <img
            src={(p as any).detailImageUrl || p.imageUrl || "/placeholder.jpg"}
            alt={p.name}
            className="w-full aspect-square object-cover bg-neutral-100 rounded-lg"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold">{p.name}</h1>
          <div className="mt-2 text-xl font-semibold">
            {typeof p.price === "number" ? p.price.toLocaleString() : p.price}
          </div>
          {p.description && (
            <p className="mt-4 text-sm text-neutral-700 whitespace-pre-line">
              {p.description}
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
