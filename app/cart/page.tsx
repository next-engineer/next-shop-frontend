"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getCart, addCartItem, clearCart } from "@/lib/api/purchase"

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
  size: string
  color: string
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await getCart()
        setCartItems(data.items ?? [])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const updateQuantity = async (id: number, newQuantity: number) => {
    const item = cartItems.find(i => i.id === id)
    if (!item) return
    const delta = newQuantity - item.quantity
    if (delta !== 0) await addCartItem(item.id, delta)
    const fresh = await getCart()
    setCartItems(fresh.items ?? [])
  }

  const removeItem = async (id: number) => {
    await addCartItem(id, -999999)
    const fresh = await getCart()
    setCartItems(fresh.items ?? [])
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (loading) {
    return (
        <div className="min-h-screen bg-black text-white">
          <Header />
          <main className="container mx-auto px-4 py-16">로딩...</main>
          <Footer />
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold mb-8">장바구니</h1>

          {cartItems.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 mb-6">장바구니가 비어 있습니다.</p>
                <Link href="/">
                  <Button className="bg-white text-black hover:bg-gray-200">쇼핑하러 가기</Button>
                </Link>
              </div>
          ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center bg-gray-900 rounded-xl p-4 border border-gray-800">
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden mr-4">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-400 mb-1">사이즈 {item.size} · {item.color}</p>
                          <p className="font-bold">{(item.price * item.quantity).toLocaleString()}원</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="icon" className="border-gray-700 text-white hover:bg-gray-800 bg-transparent"
                                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button variant="outline" size="icon" className="border-gray-700 text-white hover:bg-gray-800 bg-transparent"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="border-gray-700 text-white hover:bg-gray-800 bg-transparent"
                                  onClick={() => removeItem(item.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                  ))}
                  <div className="flex justify-end">
                    <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                            onClick={async () => { await clearCart(); const fresh = await getCart(); setCartItems(fresh.items ?? []) }}>
                      장바구니 비우기
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 h-max">
                  <h3 className="text-xl font-bold mb-4">주문 요약</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">상품 금액</span>
                      <span className="text-white">{totalPrice.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">배송비</span>
                      <span className="text-white">{totalPrice >= 50000 ? "무료" : "3,000원"}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-white">총 결제 금액</span>
                      <span className="text-white">{(totalPrice + (totalPrice >= 50000 ? 0 : 3000)).toLocaleString()}원</span>
                    </div>
                  </div>

                  <Link href="/order">
                    <Button className="w-full bg-white text-black hover:bg-gray-200 mb-3">주문하기</Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-800 bg-transparent">
                      쇼핑 계속하기
                    </Button>
                  </Link>
                </div>
              </div>
          )}
        </main>
        <Footer />
      </div>
  )
}
