"use client"

import Image from "next/image"
import Link from "next/link"

type Product = {
  id: number
  name: string
  price: number | string
  imageUrl?: string
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group bg-gray-900 rounded-xl overflow-hidden hover:bg-gray-800 transition-all duration-300 flex flex-col">
      {/* 이미지 영역: 높이 고정 */}
      <div className="relative w-full aspect-square">
        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <Image
            src={product.imageUrl || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>

      {/* 내용 영역 */}
      <div className="p-3 flex flex-col flex-1 justify-between">
        <div>
          <div className="font-semibold text-white">{product.name}</div>
          <div className="text-gray-300">{Number(product.price).toLocaleString()}원</div>
        </div>

        {/* 상세보기 버튼 하단 왼쪽 고정 */}
        <div className="mt-3 text-left">
          <Link
            href={`/product/${product.id}`}
            className="text-blue-400 hover:underline"
          >
            상세보기
          </Link>
        </div>
      </div>
    </div>
  )
}
