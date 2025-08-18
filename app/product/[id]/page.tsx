import ProductDetailClient from "./ProductDetailClient"

type Product = {
  id: number
  name: string
  price: number | string
  imageUrl?: string
  description?: string
}

const API_ORIGIN =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_PURCHASE_API_BASE_URL ||
    "http://localhost:3000"

function buildUrl(path: string) {
  return new URL(path, API_ORIGIN).toString()
}

async function apiGet<T>(path: string) {
  // ISR로 정적 내보내기 호환
  const res = await fetch(buildUrl(path), { next: { revalidate: 60 } })
  if (!res.ok) throw new Error(await res.text())
  return (await res.json()) as T
}

export const revalidate = 60
export const dynamicParams = false

export function generateStaticParams() {
  const raw = process.env.STATIC_PRODUCT_IDS || "1,2,3,4,5"
  const ids = raw.split(",").map(s => s.trim()).filter(Boolean)
  return ids.map(id => ({ id }))
}

export default async function ProductDetail({ params }: { params: { id: string } }) {
  const { id } = params
  const product = await apiGet<Product>(`/api/products/${id}`)
  return <ProductDetailClient product={product} />
}
