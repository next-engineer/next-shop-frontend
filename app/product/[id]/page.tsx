// ProductDetail.tsx (server component)

import ProductDetailClient from "./ProductDetailClient"

type Product = { id: number; name: string; price: number | string; imageUrl?: string; description?: string }

async function apiGet<T>(path: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE || ""
  const res = await fetch(new URL(path, base), { cache: "no-store" })
  if (!res.ok) throw new Error(await res.text())
  return (await res.json()) as T
}

async function fetchProduct(id: string) {
  return await apiGet<Product>(`/api/products/${id}`)
}

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await fetchProduct(id)

  return (
    <main className="w-full py-8 bg-black min-h-screen">
      <ProductDetailClient product={product} />
    </main>
  )
}