import React from "react"
import ProductsWithSort from "./ProductsWithSort"

type Product = { id: number; name: string; price: number | string; imageUrl?: string; createdAt?: string }
type Page<T> = { content: T[] }

// ✅ 정적 export에서는 빌드 타임에 만들 수 있는 경로만 허용
export const dynamicParams = false

// 카테고리 이름(정적): 빌드 시 경로 생성에도 사용
const categoryNames: Record<string, string> = {
  "1": "모자",
  "2": "신발",
  "3": "상의",
  "4": "하의",
  "5": "아우터",
}

// ✅ 정적 경로 사전 생성 (export 모드 필수)
export function generateStaticParams() {
  // 필요하면 여기서 API를 호출해 동적으로 id 목록을 만들어도 됨.
  // 하지만 정적 export 안정성을 위해 현재는 고정된 id를 사용.
  return Object.keys(categoryNames).map((id) => ({ id }))
}

async function apiGet<T>(path: string, params?: Record<string, string | number>) {
  // ✅ 서버(빌드 타임)용 우선, 없으면 클라이언트용 공개변수 사용
  const base =
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    ""

  const url = new URL(path, base)
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)))

  // 정적 export에선 빌드 타임 fetch. 캐시는 기본값으로 두어도 무방.
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(await res.text())
  return (await res.json()) as T
}

async function fetchProductsByCategoryId(id: string) {
  // 백엔드가 categoryId 쿼리로 필터링을 지원한다고 가정
  const page = await apiGet<Page<Product>>("/api/products", { categoryId: id, page: 0, size: 30 })
  return page.content
}

export default async function CategoryPage({ params }: { params: { id: string } }) {
  const { id } = params
  const products = await fetchProductsByCategoryId(id)
  const categoryName = categoryNames[id] || `카테고리 #${id}`

  return (
    <main className="container pt-4 pb-12">
      <h1 className="text-2xl font-bold mb-4">{categoryName}</h1>
      {/* @ts-expect-error Async Server Component -> 클라이언트 컴포넌트 */}
      <ProductsWithSort products={products} categoryName={categoryName} />
    </main>
  )
}
