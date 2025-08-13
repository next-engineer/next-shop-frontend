"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

type Product = {
  id: number
  name: string
  price: number | string
  imageUrl?: string
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-all duration-300">
      <Link
        href={`/product/${product.id}`}
        className="block relative aspect-square overflow-hidden"
      >
        <Image
          src={product.imageUrl || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Hover Actions 제거됨 */}

      <div className="p-3">
        <div className="font-semibold text-white">{product.name}</div>
        <div className="text-gray-300">{Number(product.price).toLocaleString()}원</div>
        <Link
          href={`/product/${product.id}`}
          className="block mt-2 text-blue-400 hover:underline"
        >
          상세보기
        </Link>
      </div>
    </div>
  )
}
