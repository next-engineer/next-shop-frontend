// app/category/[id]/page.tsx
import Image from "next/image"
import Link from "next/link"

export const dynamicParams = false; // 정적 export에서는 동적 파라미터 허용 X

export function generateStaticParams() {
  // 카테고리 id가 1~5 라고 가정 (필요시 여기 목록만 수정)
  return ["1", "2", "3", "4", "5"].map((id) => ({ id }))
}

type Props = { params: { id: string } }

// 카테고리별 상품 30개 요청
async function getCategoryProducts(id: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL!
  const res = await fetch(
    `${base}/products?categoryId=${id}&page=0&size=30`,
    {
      // 정적 export에서 빌드 타임 고정
      cache: "force-cache",
    }
  )
  if (!res.ok) {
    throw new Error("카테고리 상품 조회 실패")
  }
  return res.json()
}

export default async function Page({ params }: Props) {
  const { id } = params
  const data = await getCategoryProducts(id)
  const items = data?.content ?? []

  return (
    <main className="container mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-xl font-semibold mb-6">카테고리 {id}</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((p: any) => (
          <Link
            key={p.id}
            // 상세 페이지는 query-string 방식으로 이동 (정적 export 호환)
            href={`/product-detail?id=${p.id}`}
            className="block group"
          >
            {/* next/image 사용 시 외부 도메인이면 next.config의 images 설정 필요 */}
            <Image
              src={p.imageUrl}
              alt={p.name}
              width={600}
              height={600}
              className="rounded-lg object-cover aspect-square"
            />
            <div className="mt-2">
              <div className="text-sm">{p.name}</div>
              <div className="text-base font-semibold">
                {p.price?.toLocaleString?.() ?? p.price}원
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
