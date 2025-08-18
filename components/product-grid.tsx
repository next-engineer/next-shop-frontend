import Image from "next/image"
import Link from "next/link"

type Product = {
  id: number | string
  name: string
  price: number | string
  imageUrl?: string
  categoryId?: string | number
}
type Page<T> = { content: T[] }

// 백엔드 베이스 URL 결정
const API_ORIGIN =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_PURCHASE_API_BASE_URL ||
    (process.env.NODE_ENV === "development"
        ? "http://localhost:8080"
        : "http://localhost:3000")

function buildUrl(path: string, params?: Record<string, string | number>) {
  const url = new URL(path, API_ORIGIN) // "/api/..." 기준으로 절대 URL 생성
  if (params) {
    url.search = new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)])
    ).toString()
  }
  return url.toString()
}

async function safeApiGet<T>(
    path: string,
    params?: Record<string, string | number>,
    fallback: T | null = null
) {
  try {
    // ISR 캐시 (전역 revalidate=60과 맞춤)
    const res = await fetch(buildUrl(path, params), {
      next: { revalidate: 60 },
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(text || `HTTP ${res.status}`)
    }
    return (await res.json()) as T
  } catch (e) {
    console.error("[product-grid] fetch fail:", e)
    if (fallback !== null) return fallback
    throw e
  }
}

export default async function ProductGrid() {
  const categoryIds = [1, 2, 3, 4, 5]
  const allCategoryProducts: Product[][] = []

  for (const id of categoryIds) {
    const page = await safeApiGet<Page<Product>>(
        "/api/products",
        { categoryId: id, page: 0, size: 3 },
        { content: [] }
    )
    const top3 = [...page.content]
        .sort((a: any, b: any) => Number(b?.id ?? 0) - Number(a?.id ?? 0))
        .slice(0, 3)
    allCategoryProducts.push(top3)
  }

  const shuffled: Product[] = []
  let added = true
  while (added) {
    added = false
    for (const arr of allCategoryProducts) {
      if (arr.length > 0) {
        shuffled.push(arr.shift()!)
        added = true
      }
    }
  }
  const result = shuffled.slice(0, 12)

  return (
      <section className="py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-6">추천 상품</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {result.map((p) => (
                <div
                    key={String(p.id)}
                    className="group relative bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-all duration-300 flex flex-col"
                >
                  <div className="relative w-full aspect-square overflow-hidden">
                    <Link href={`/product/${p.id}`} className="block w-full h-full">
                      <Image
                          src={(p as any).imageUrl || "/placeholder.svg"}
                          alt={p.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                  </div>
                  <div className="p-3 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="font-semibold text-white">{p.name}</div>
                      <div className="text-gray-300">
                        {Number(p.price).toLocaleString()}원
                      </div>
                    </div>
                    <div className="mt-3 text-left">
                      <Link
                          href={`/product/${p.id}`}
                          className="text-blue-400 hover:underline"
                      >
                        상세보기
                      </Link>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </section>
  )
}
