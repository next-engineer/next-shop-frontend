import ProductDetailClient from "./ProductDetailClient"

type Product = {
  id: number
  name: string
  price: number | string
  imageUrl?: string
  description?: string
}

const API_ORIGIN =
    process.env.NEXT_PUBLIC_TEST_API_BASE ||
    process.env.NEXT_PUBLIC_API_BASE ||
    "http://localhost:3000"

function buildUrl(path: string) {
  return new URL(path, API_ORIGIN).toString()
}

async function apiGet<T>(path: string) {
  const res = await fetch(buildUrl(path), { cache: "no-store" })
  if (!res.ok) throw new Error(await res.text())
  return (await res.json()) as T
}

export default async function ProductDetail({
                                              params,
                                            }: {

  params: Promise<{ id: string }>
}) {

  const { id } = await params
  const product = await apiGet<Product>(`/api/products/${id}`)
  return <ProductDetailClient product={product} />
}
