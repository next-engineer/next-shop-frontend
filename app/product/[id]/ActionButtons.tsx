"use client"

type Props = {
  product: {
    id: number
    name: string
    price: number | string
  }
}

export function ActionButtons({ product }: Props) {
  const handleAddToCart = () => {
    alert(`${product.name} 장바구니에 추가되었습니다!`)
  }

  const handleBuyNow = () => {
    alert("구매 페이지로 이동합니다.")
    // router.push("/checkout") 같은 로직 가능
  }

  return (
    <div className="flex gap-2 mt-4">
      <button
        className="flex-1 h-12 border border-white bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-colors"
        onClick={handleAddToCart}
      >
        장바구니
      </button>
      <button
        className="flex-1 h-12 border border-white bg-black text-white text-sm font-semibold hover:bg-gray-900 transition-colors"
        onClick={handleBuyNow}
      >
        구매하기
      </button>
    </div>
  )
}
