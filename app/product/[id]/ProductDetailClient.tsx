"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCart } from "@/app/cart/CartContext"

type Product = {
  id: number
  name: string
  price: number | string
  imageUrl?: string
  description?: string
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const [qty, setQty] = useState<number>(1)

  // 숫자 보장
  const price = Number(product.price ?? 0) || 0

  const dec = () => setQty((q) => Math.max(1, (q | 0) - 1))
  const inc = () => setQty((q) => Math.min(99, (q | 0) + 1))

  // CartContext 시그니처에 맞게 (상품정보, 추가수량) 형태로 호출
  const add = () => {
    addToCart(
        { id: product.id, name: product.name, price, imageUrl: product.imageUrl },
        qty
    )
  }

  const buyNow = () => {
    add()
    window.location.href = "/order"
  }

  return (
      <section className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-900 rounded-xl overflow-hidden aspect-[4/5] relative">
          <Image
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
          />
        </div>

        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-white">{product.name}</h1>
          <div className="text-xl font-bold text-white">{price.toLocaleString()}원</div>
          {product.description && (
              <p className="text-gray-300 whitespace-pre-line">{product.description}</p>
          )}

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center border border-gray-700 rounded-lg overflow-hidden">
              <Button variant="ghost" onClick={dec} className="h-10 w-10 text-white">-</Button>
              <div className="w-12 text-center text-white">{qty}</div>
              <Button variant="ghost" onClick={inc} className="h-10 w-10 text-white">+</Button>
            </div>

            <Button onClick={add} className="bg-white text-black hover:bg-gray-200 h-11 rounded-lg px-6">
              장바구니
            </Button>
            <Button onClick={buyNow} className="bg-gray-200 text-black hover:bg-gray-300 h-11 rounded-lg px-6">
              바로구매
            </Button>
          </div>
        </div>
      </section>
  )
}
