"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/app/cart/CartContext"

export default function CartPage() {
    const { cartItems, addToCart, removeFromCart } = useCart()

    const updateQuantity = (
        id: number,
        size: string | undefined,
        color: string | undefined,
        newQuantity: number
    ) => {
        const item = cartItems.find((i) => i.id === id && i.size === size && i.color === color)
        if (!item) return
        if (newQuantity <= 0) return removeFromCart(id, size, color)
        addToCart(
            {
                id: item.id,
                name: item.name,
                price: item.price,
                imageUrl: item.imageUrl,
                size: item.size,
                color: item.color,
            },
            newQuantity - item.quantity
        )
    }

    const totalPrice = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
    const shippingFee = totalPrice >= 50000 ? 0 : 3000

    return (
        <div className="min-h-screen bg-black text-white">
            <main className="container mx-auto px-4 py-16">
                <h1 className="text-3xl font-bold mb-8">장바구니</h1>

                {cartItems.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-400 text-lg mb-4">장바구니가 비어있습니다.</p>
                        <Link href="/">
                            <Button className="bg-white text-black hover:bg-gray-200">쇼핑 계속하기</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* 상품 목록 */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item, idx) => (
                                <div
                                    key={`${item.id}-${item.size || "no-size"}-${item.color || "no-color"}-${idx}`}
                                    className="bg-gray-900 rounded-lg p-6 flex items-center space-x-4"
                                >
                                    <div className="w-24 h-24 relative rounded-lg overflow-hidden">
                                        <Image
                                            src={item.imageUrl || "/placeholder.svg"}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-white font-semibold mb-2">{item.name}</h3>
                                        <p className="text-gray-400 text-sm mb-2">
                                            사이즈: {item.size || "-"} | 색상: {item.color || "-"}
                                        </p>
                                        <p className="text-white font-bold">
                                            {Number(item.price).toLocaleString()}원
                                        </p>
                                    </div>

                                    {/* 수량 조절 */}
                                    <div className="flex items-center space-x-3">
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                updateQuantity(item.id, item.size, item.color, item.quantity - 1)
                                            }
                                            className="bg-gray-700 hover:bg-gray-600 text-white w-8 h-8 p-0"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </Button>
                                        <span className="text-white font-semibold w-8 text-center">
                      {item.quantity}
                    </span>
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                updateQuantity(item.id, item.size, item.color, item.quantity + 1)
                                            }
                                            className="bg-gray-700 hover:bg-gray-600 text-white w-8 h-8 p-0"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>

                                    {/* 삭제 버튼 */}
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => removeFromCart(item.id, item.size, item.color)}
                                        className="text-gray-400 hover:text-red-400"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        {/* 주문 요약 */}
                        <div className="bg-gray-900 rounded-lg p-6 h-fit">
                            <h2 className="text-xl font-bold mb-6">주문 요약</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">상품 금액</span>
                                    <span className="text-white">{totalPrice.toLocaleString()}원</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">배송비</span>
                                    <span className="text-white">
                    {shippingFee === 0 ? "무료" : `${shippingFee.toLocaleString()}원`}
                  </span>
                                </div>
                                <div className="border-t border-gray-700 pt-3">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span className="text-white">총 결제 금액</span>
                                        <span className="text-white">
                      {(totalPrice + shippingFee).toLocaleString()}원
                    </span>
                                    </div>
                                </div>
                            </div>

                            {totalPrice < 50000 && (
                                <p className="text-sm text-gray-400 mb-4">
                                    50,000원 이상 구매 시 무료배송
                                </p>
                            )}

                            <Link href="/order">
                                <Button className="w-full bg-white text-black hover:bg-gray-200 mb-3">
                                    주문하기
                                </Button>
                            </Link>
                            <Link href="/">
                                <Button
                                    variant="outline"
                                    className="w-full border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                                >
                                    쇼핑 계속하기
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
