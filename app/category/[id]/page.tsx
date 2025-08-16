import ProductsWithSort from "./ProductsWithSort"

type Product = { id: number; name: string; price: number | string; imageUrl?: string; createdAt?: string }
type Page<T> = { content: T[] }

const API_ORIGIN =
    process.env.NEXT_PUBLIC_TEST_API_BASE ||
    process.env.NEXT_PUBLIC_API_BASE ||
    "http://localhost:3000"

function buildUrl(path: string, params?: Record<string, string | number>) {
  const url = new URL(path, API_ORIGIN)
  if (params) url.search = new URLSearchParams(Object.entries(params).map(([k,v])=>[k,String(v)])).toString()
  return url.toString()
}

async function apiGet<T>(path: string, params?: Record<string, string | number>) {
  const res = await fetch(buildUrl(path, params), { cache: "no-store" })
  if (!res.ok) throw new Error(await res.text())
  return (await res.json()) as T
}

async function fetchProductsByCategoryId(id: string) {
  const page = await apiGet<Page<Product>>("/api/products", { categoryId: id, page: 0, size: 30 })
  return page.content
}

const categoryNames: Record<string, string> = { "1": "모자", "2": "신발", "3": "상의", "4": "하의", "5": "아우터" }

export default async function CategoryPage({ params }: { params: { id: string } }) {
  const { id } = params
  const products = await fetchProductsByCategoryId(id)
  const categoryName = categoryNames[id] || `카테고리 #${id}`
  return (
      <main className="container pt-4 pb-12">
        <h1 className="text-2xl font-bold mb-4">{categoryName}</h1>
        <ProductsWithSort products={products} categoryName={categoryName} />
      </main>
  )
}
