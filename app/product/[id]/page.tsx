import React from "react"

type Product = {
  id: number | string
  name: string
  price: number | string
  imageUrl?: string
  description?: string
}

export const dynamicParams = false // export 모드에서는 fallback 불가

/**
 * 빌드 타임에 제품 상세 경로를 미리 생성.
 * - 1) /api/products/ids 가 있으면 그걸 먼저 시도
 * - 2) 없으면 /api/products?page&size 로 첫 페이지를 가져와 id 추출
 * 필요시 size/페이지 수를 늘려서 더 많이 프리렌더하세요.
 */
export async function generateStaticParams() {
  const base =
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    ""

  // 1) /api/products/ids (예: [1,2,3,...]) 엔드포인트가 있으면 가장 깔끔
  try {
    const r = await fetch(new URL("/api/products/ids", base).toString())
    if (r.ok) {
      const ids: Array<string | number> = await r.json()
      return ids.map((id) => ({ id: String(id) }))
    }
  } catch (_) {
    // ignore and fallback
  }

  // 2) 목록 페이지에서 첫 페이지만 사용 (필요 시 페이지 루프 확장)
  const url = new URL("/api/products", base)
  url.searchParams.set("page", "0")
  url.searchParams.set("size", "500") // 한 번에 충분히 크게
  const res = await fetch(url.toString())
  if (!res.ok) {
    // 최소 하나라도 만들어두기(빌드 실패 방지)
    return [{ id: "1" }]
  }
  const page: { content: Array<{ id: string | number }> } = await res.json()
  return (page.content ?? []).map((p) => ({ id: String(p.id) }))
}

async function getProduct(id: string) {
  const base =
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    ""
  const res = await fetch(new URL(`/api/products/${id}`, base).toString())
  if (!res.ok) return null
  return (await res.json()) as Product
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (!product) {
    return (
      <main className="container py-10">
        <h1 className="text-xl font-semibold">상품을 찾을 수 없습니다.</h1>
      </main>
    )
  }

  return (
    <main className="container py-10">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          {/* 이미지 경로가 절대/상대 어떤 것이든 img로 간단히 */}
          {/* Next/Image는 export + 외부도메인 설정 필요하므로 기본 img 사용 */}
          <img
            src={product.imageUrl || "/placeholder.png"}
            alt={product.name}
            className="w-full rounded-lg border"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-3">{product.name}</h1>
          <p className="text-lg font-semibold mb-6">
            {typeof product.price === "number" ? product.price.toLocaleString() : product.price} 원
          </p>
          {product.description && <p className="text-gray-600">{product.description}</p>}
        </div>
      </div>
    </main>
  )
}
