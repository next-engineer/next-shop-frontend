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
    <div
      className="
        group rounded-2xl overflow-hidden flex flex-col
        bg-gradient-to-b from-gray-900 to-gray-800
        hover:from-gray-800 hover:to-gray-700
        transition-all duration-300 shadow-lg hover:shadow-2xl
      "
    >
      {/* 이미지 영역: 높이 고정 */}
      <div className="relative w-full aspect-square overflow-hidden rounded-t-2xl">
        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <Image
            src={product.imageUrl || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, 33vw"
            priority
          />
          {/* 이미지 위에 gradient overlay 추가 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
        </Link>
      </div>

      {/* 내용 영역 */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div className="space-y-1">
          <div
            className="
              font-semibold text-white leading-tight
              text-base sm:text-lg
              line-clamp-2
            "
          >
            {product.name}
          </div>
          <div className="text-gray-300 font-medium text-sm sm:text-base">
            {Number(product.price).toLocaleString()}원
          </div>
        </div>

        {/* 상세보기 버튼 하단 왼쪽 고정 */}
        <div className="mt-4 text-left">
          <Link
            href={`/product/${product.id}`}
            className="
              inline-block px-4 py-2 rounded-full
              bg-gray-700 hover:bg-gray-600
              text-sm sm:text-base text-white font-medium
              transition-colors duration-200
            "
          >
            상세보기
          </Link>
        </div>
      </div>
    </div>
  )
}
