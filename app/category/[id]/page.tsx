// app/category/[id]/page.tsx
import React from "react"
import Link from "next/link"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || ""

type Product = {
  id: number
  name: string
  price: number | string
  imageUrl?: string
}

type Page<T> = { content?: T[]; items?: T[] }

async function fetchProductsByCategoryId(categoryId: string) {
  const url = `${API_BASE}/products/category/${categoryId}?page=0&size=30`
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) throw new Error(await res.text())
  const data: Page<Product> | Product[] = await res.json()
  const list =
    Array.isArray(data) ? data
    : Array.isArray(data?.content) ? data.content!
    : Array.isArray((data as Page<Product>)?.items) ? (data as Page<Product>).items!
    : []
  return list
}

export const dynamicParams = false
export async function generateStaticParams() {
  return ["1", "2", "3", "4", "5"].map((id) => ({ id }))
}

const categoryNames: Record<string, string> = {
  "1": "모자", "2": "상의", "3": "하의", "4": "아우터", "5": "신발",
}

export default async function CategoryPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params
  const products = await fetchProductsByCategoryId(id)
  const categoryName = categoryNames[id] || `카테고리 #${id}`

  return (
    <main className="container mx-auto px-4 pt-6 pb-16">
      <h1 className="text-2xl font-bold mb-6">{categoryName}</h1>

      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/product/${p.id}`}
            className="block rounded-lg overflow-hidden border hover:shadow"
          >
            <img
              src={(p as any).thumbnailUrl || (p as any).thumbnail || p.imageUrl || "/placeholder.jpg"}
              alt={p.name}
              loading="lazy"
              className="w-full h-52 object-cover bg-neutral-100"
              referrerPolicy="no-referrer"
            />
            <div className="p-3">
              <div className="text-sm line-clamp-2">{p.name}</div>
              <div className="mt-1 font-semibold">
                {typeof p.price === "number" ? p.price.toLocaleString() : p.price}
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  )
}
