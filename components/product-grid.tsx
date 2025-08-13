import Image from "next/image"
import Link from "next/link"
import { apiGet } from "@/lib/api"

type Product = { id: number; name: string; price: number | string; imageUrl?: string; category: string }
type Page<T> = { content: T[] }

export async function ProductGrid() {
  const page = await apiGet<Page<Product>>("/api/products", { page: 0, size: 100 })
  const products = page.content

  // 1. 카테고리별로 그룹화
  const categoryMap: Record<string, Product[]> = {}
  for (const p of products) {
    if (!categoryMap[p.category]) categoryMap[p.category] = []
    categoryMap[p.category].push(p)
  }

  // 2. 각 카테고리별 최신 2~3개 선택
  const categoryArrays = Object.values(categoryMap).map(arr =>
    arr.sort((a, b) => b.id - a.id).slice(0, 3)
  )

  // 3. 카테고리별 배열을 round-robin 방식으로 섞기
  const shuffled: Product[] = []
  let added
  do {
    added = false
    for (const arr of categoryArrays) {
      if (arr.length > 0) {
        shuffled.push(arr.shift()!)
        added = true
      }
    }
  } while (added)

  // 4. 총 12개까지만
  const result = shuffled.slice(0, 12)

  return (
    <section className="py-12">
      <div className="container">
        <h2 className="text-2xl font-bold mb-6">추천 상품</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {result.map((p) => (
            <div key={p.id} className="group border border-gray-800 rounded-xl overflow-hidden hover:shadow-xl transition-shadow">
              <Link href={`/product/${p.id}`} className="relative aspect-square block">
                <Image
                  src={p.imageUrl || "/placeholder.svg"}
                  alt={p.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </Link>
              <div className="p-3">
                <div className="font-semibold mb-1">{p.name}</div>
                <div className="text-gray-300">{Number(p.price).toLocaleString()}원</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
