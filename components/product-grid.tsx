import Image from "next/image"
import Link from "next/link"
import { apiGet } from "@/lib/api"

type Product = { 
  id: number; 
  name: string; 
  price: number | string; 
  imageUrl?: string; 
  categoryId: string 
}
type Page<T> = { content: T[] }

const categoryIds = ["1", "2", "3", "4", "5"]

export default async function ProductGrid() {
  const allCategoryProducts: Product[][] = []

  // 각 카테고리별로 최신 3개씩 가져오기
  for (const id of categoryIds) {
    const page = await apiGet<Page<Product>>("/api/products", { categoryId: id, page: 0, size: 3 })
    const sorted = page.content.sort((a, b) => b.id - a.id).slice(0, 3)
    allCategoryProducts.push(sorted)
  }

  // round-robin 방식으로 섞어서 다양한 카테고리 상품 섞기
  const shuffled: Product[] = []
  let added
  do {
    added = false
    for (const arr of allCategoryProducts) {
      if (arr.length > 0) {
        shuffled.push(arr.shift()!)
        added = true
      }
    }
  } while (added)

  // 최대 12개만 출력
  const result = shuffled.slice(0, 12)

  return (
    <section className="py-12">
      <div className="container">
        <h2 className="text-2xl font-bold mb-6">추천 상품</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {result.map((p) => (
            <div
              key={p.id}
              className="group relative bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-all duration-300 flex flex-col"
            >
              {/* 이미지 영역: aspect-square 유지, 카드 높이 통일 */}
              <div className="relative w-full aspect-square overflow-hidden">
                <Link href={`/product/${p.id}`} className="block w-full h-full">
                  <Image
                    src={p.imageUrl || "/placeholder.svg"}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </div>

              {/* 내용 영역: flex-col + flex-1 + justify-between */}
              <div className="p-3 flex flex-col flex-1 justify-between">
                <div>
                  <div className="font-semibold text-white">{p.name}</div>
                  <div className="text-gray-300">{Number(p.price).toLocaleString()}원</div>
                </div>

                {/* 상세보기 버튼 하단 왼쪽 고정 */}
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
