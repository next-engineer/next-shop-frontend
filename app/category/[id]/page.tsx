import ProductsWithSort from "./ProductsWithSort"

type Product = { id: number; name: string; price: number | string; imageUrl?: string; createdAt?: string }
type Page<T> = { content: T[] }

const API_ORIGIN =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_PURCHASE_API_BASE_URL ||
    "http://localhost:3000"

function buildUrl(path: string, params?: Record<string, string | number>) {
    const url = new URL(path, API_ORIGIN)
    if (params) url.search = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString()
    return url.toString()
}

async function apiGet<T>(path: string, params?: Record<string, string | number>) {
    // ISR로 정적 내보내기 호환
    const res = await fetch(buildUrl(path, params), { next: { revalidate: 60 } })
    if (!res.ok) throw new Error(await res.text())
    return (await res.json()) as T
}

async function fetchProductsByCategoryId(id: string) {
    const page = await apiGet<Page<Product>>("/api/products", { categoryId: id, page: 0, size: 30 })
    return page.content
}

export const revalidate = 60
export const dynamicParams = false

export function generateStaticParams() {
    const raw = process.env.STATIC_PRODUCT_IDS || "1,2,3,4,5"
    const ids = raw.split(",").map(s => s.trim()).filter(Boolean)
    return ids.map(id => ({ id }))
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
