import React from "react"
import ProductsWithSort from "./ProductsWithSort"  // 경로 확인하세요

type Product = { id: number; name: string; price: number | string; imageUrl?: string }
type Page<T> = { content: T[] }

async function apiGet<T>(path: string, params?: Record<string, string | number>) {
  const base = process.env.NEXT_PUBLIC_API_BASE || ""
  const url = new URL(path, base)
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)))
  const res = await fetch(url.toString(), { cache: "no-store" })
  if (!res.ok) throw new Error(await res.text())
  return (await res.json()) as T
}

async function fetchProductsByCategoryId(id: string) {
  const page = await apiGet<Page<Product>>("/api/products", { categoryId: id, page: 0, size: 30 })
  return page.content
}

const categoryNames: Record<string, string> = {
  "1": "모자",
  "2": "신발",
  "3": "상의",
  "4": "하의",
  "5": "아우터",
}

export default async function CategoryPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const products = await fetchProductsByCategoryId(id)

  const categoryName = categoryNames[id] || `카테고리 #${id}`

  return (
    <main className="container py-8">
      <h1 className="text-2xl font-bold mb-6">{categoryName}</h1>
      {/* @ts-expect-error Async Server Component -> 클라이언트 컴포넌트 */}
      <ProductsWithSort products={products} />
    </main>
  )
}
