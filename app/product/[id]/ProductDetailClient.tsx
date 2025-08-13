"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
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
  const { addToCart, cartItems } = useCart()
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [cartTotal, setCartTotal] = useState(0)

  const sizes = ["S", "M", "L", "XL"]
  const colors: { name: string; hex: string }[] = [
    { name: "White", hex: "#ffffff" },
    { name: "Black", hex: "#000000" },
    { name: "Gray", hex: "#808080" },
  ]

  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    )
    setCartTotal(total)
  }, [cartItems])

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert("사이즈와 색상을 선택해주세요.")
      return
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
    })

    alert(`${product.name} (${selectedSize}, ${selectedColor}) 장바구니에 추가됨!`)
  }

  return (
    <div className="max-w-7xl mx-auto py-8 flex flex-row gap-8 min-h-[600px] bg-black">
      {/* 이미지 */}
      <div className="relative flex-shrink-0 w-[60%] min-h-[600px] rounded-2xl overflow-hidden bg-black flex items-center justify-center">
        <Image
          src={product.imageUrl || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 60vw"
          priority
        />
      </div>

      {/* 상세 정보 */}
      <div className="flex flex-col w-[40%] justify-start gap-6 text-white -ml-8">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <div className="text-xl text-gray-300">{Number(product.price).toLocaleString()}원</div>

        {/* 사이즈 선택 */}
        <div>
          <h2 className="font-semibold mb-2 text-white">사이즈 선택</h2>
          <div className="flex space-x-2">
            {sizes.map((size) => (
              <button
                key={size}
                className={`px-4 py-2 border rounded transition-all duration-300
                  ${
                    selectedSize === size
                      ? "bg-white text-black border-white scale-105 shadow-[0_0_6px_#fff] hover:shadow-[0_0_10px_#fff] hover:animate-pulse"
                      : "bg-black text-white border-white hover:bg-gray-800"
                  }
                `}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* 색상 선택 */}
        <div>
          <h2 className="font-semibold mb-2 text-white">색상 선택</h2>
          <div className="flex space-x-3">
            {colors.map((color) => (
              <button
                key={color.name}
                className={`w-8 h-8 rounded-full border-2 transform transition-all duration-300 ease-out
                  ${
                    selectedColor === color.name
                      ? "border-white scale-110 shadow-[0_0_6px_#fff] hover:shadow-[0_0_10px_#fff] hover:animate-pulse"
                      : "border-gray-400 scale-100"
                  }
                `}
                style={{ backgroundColor: color.hex }}
                onClick={() => setSelectedColor(color.name)}
              />
            ))}
          </div>
        </div>

        {/* 버튼 및 무료배송 안내 */}
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex space-x-4">
            <Button
              onClick={handleAddToCart}
              className="flex items-center border border-white bg-black text-white hover:bg-gray-800"
              size="lg"
            >
              장바구니 담기
            </Button>
            <Button
              className="border border-white bg-black text-white hover:bg-gray-800"
              size="lg"
            >
              구매하기
            </Button>
          </div>

          {/* 장바구니 합계 기준 무료배송 안내 */}
          {cartTotal >= 50000 ? (
            <p className="text-white text-sm mt-2">무료배송 적용!</p>
          ) : (
            <p className="text-white text-sm mt-2">
              {50000 - cartTotal}원 추가 구매 시 무료배송
            </p>
          )}
        </div>

        {product.description && (
          <p className="text-gray-400 leading-relaxed mt-4">{product.description}</p>
        )}
      </div>
    </div>
  )
}
