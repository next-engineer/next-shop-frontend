"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { CreditCard, Smartphone, MessageCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getCart, createOrder, requestPayment, clearCart } from "@/lib/api/purchase"

export default function OrderPage() {
  const [deliveryInfo, setDeliveryInfo] = useState({ name: "", phone: "", address: "", message: "" })
  const [paymentMethod, setPaymentMethod] = useState<"card" | "kakao" | "naver">("card")
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      const data = await getCart()
      setItems(data.items ?? [])
    })()
  }, [])

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingFee = totalPrice >= 50000 ? 0 : 3000
  const finalPrice = totalPrice + shippingFee

  const handleOrder = async () => {
    setLoading(true)
    try {
      const orderPayload = {
        deliveryInfo,
        items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
        shippingFee,
        totalPrice: finalPrice,
      }
      const order = await createOrder(orderPayload)
      await requestPayment({ orderId: order.id, method: paymentMethod, amount: finalPrice })
      await clearCart()
      alert("주문이 완료되었습니다.")
      window.location.href = "/orders"
    } catch (e) {
      alert("주문 처리 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold mb-8">주문/결제</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <h2 className="text-xl font-bold mb-4">배송 정보</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-300">받는 분</Label>
                    <Input id="name" className="bg-gray-800 border-gray-700 text-white"
                           value={deliveryInfo.name}
                           onChange={(e) => setDeliveryInfo({ ...deliveryInfo, name: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-gray-300">연락처</Label>
                    <Input id="phone" className="bg-gray-800 border-gray-700 text-white"
                           value={deliveryInfo.phone}
                           onChange={(e) => setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })} />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address" className="text-gray-300">주소</Label>
                    <Input id="address" className="bg-gray-800 border-gray-700 text-white"
                           value={deliveryInfo.address}
                           onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })} />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="message" className="text-gray-300">배송 요청사항</Label>
                    <Textarea id="message" className="bg-gray-800 border-gray-700 text-white"
                              value={deliveryInfo.message}
                              onChange={(e) => setDeliveryInfo({ ...deliveryInfo, message: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <h2 className="text-xl font-bold mb-4">결제 수단</h2>
                <RadioGroup value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)} className="space-y-4">
                  <label className="flex items-center justify-between bg-gray-800 p-4 rounded-lg border border-gray-700 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5" />
                      <span>신용/체크카드</span>
                    </div>
                    <RadioGroupItem value="card" id="card" />
                  </label>
                  <label className="flex items-center justify-between bg-gray-800 p-4 rounded-lg border border-gray-700 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="w-5 h-5" />
                      <span>카카오페이</span>
                    </div>
                    <RadioGroupItem value="kakao" id="kakao" />
                  </label>
                  <label className="flex items-center justify-between bg-gray-800 p-4 rounded-lg border border-gray-700 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="w-5 h-5" />
                      <span>네이버페이</span>
                    </div>
                    <RadioGroupItem value="naver" id="naver" />
                  </label>
                </RadioGroup>
              </div>
            </div>

            <div>
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-bold">주문 상품</h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden mr-3">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-gray-400">수량 {item.quantity}</p>
                          </div>
                          <div className="font-bold">{(item.price * item.quantity).toLocaleString()}원</div>
                        </div>
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">상품 금액</span>
                    <span className="text-white">{totalPrice.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">배송비</span>
                    <span className="text-white">{shippingFee === 0 ? "무료" : `${shippingFee.toLocaleString()}원`}</span>
                  </div>
                  <div className="border-t border-gray-700 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-white">총 결제 금액</span>
                      <span className="text-white">{finalPrice.toLocaleString()}원</span>
                    </div>
                  </div>
                  <Button onClick={handleOrder} disabled={loading} className="w-full bg-white text-black hover:bg-gray-200 mt-6">
                    {loading ? "결제 중..." : `${finalPrice.toLocaleString()}원 결제하기`}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
  )
}
