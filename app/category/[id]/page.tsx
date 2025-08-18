// app/category/[id]/page.tsx
import type { PageProps } from "next"
import Image from "next/image"
import Link from "next/link"

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  ""

export const dynamicParams = false // static export와 함께 사용

export function generateStaticParams() {
  // 배포에 포함할 카테고리 경로(예시)
  return [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }]
}

type Product = {
  id: number
  name: string
  price: number
  imageUrl: string
  categoryId: number
}

export default async function CategoryPage(
  { params }: PageProps<{ id: string }>
) {
  const { id } = await params // ✅ Next 15 방식

  const res = await fetch(
    `${API_BASE}/products?categoryId=${id}&page=0&size=30`, // ✅ 30개
    { cache: "no-store" }
  )
  const { content = [] } = await res.json() as { content: Product[] }

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16">
      <h1 className="mb-6 text-2xl font-bold">카테고리 {id}</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {content.map((p) => (
          <article key={p.id} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <Link href={`/product/${p.id}`} className="block">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={p.imageUrl}
                  alt={p.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 25vw"
                  unoptimized
                />
              </div>
              <div className="space-y-1 p-4">
                <h4 className="line-clamp-2 text-sm font-medium">{p.name}</h4>
                <p className="text-sm text-white/70">{p.price.toLocaleString()}원</p>
                <span className="inline-flex items-center gap-1 text-xs text-blue-400 underline">
                  상세보기
                </span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}