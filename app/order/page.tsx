"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { CreditCard, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/app/cart/CartContext"
import { checkoutOrder, createOrder, requestPayment } from "@/lib/api/purchase"

export default function OrderPage() {
  const router = useRouter()
  const { cartItems } = useCart()

  const [submitting, setSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"CARD" | "TRANSFER">("CARD")
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: "", phone: "", address: "", detailAddress: "", zipCode: "", memo: "",
  })
  const [cardNumber, setCardNumber] = useState("")
  const [accountNumber, setAccountNumber] = useState("")

  const totalPrice = useMemo(
      () => cartItems.reduce((s, it) => s + Number(it.price) * it.quantity, 0),
      [cartItems]
  )
  const shippingFee = totalPrice >= 50000 ? 0 : 3000
  const finalPrice = totalPrice + shippingFee

  const onlyDigits = (v: string) => v.replace(/\D/g, "")
  const canSubmit =
      !!deliveryInfo.name && !!deliveryInfo.phone && !!deliveryInfo.address &&
      (paymentMethod === "CARD" ? cardNumber.length >= 12 : accountNumber.length >= 1)

  const handleOrder = async () => {
    if (!canSubmit) {
      alert("정보를 입력하세요.")
      return
    }
    setSubmitting(true)
    try {
      const deliveryAddress = `${deliveryInfo.address} ${deliveryInfo.detailAddress}`.trim()

      let orderId: number | null = null
      try {
        const o = await checkoutOrder({
          deliveryAddress,
          receiverName: deliveryInfo.name,
          receiverPhone: deliveryInfo.phone,
          memo: deliveryInfo.memo ?? "",
        })
        orderId = Number(o?.id ?? o?.orderId)
      } catch {
        const items = cartItems.map(it => ({ productId: Number(it.id), quantity: Number(it.quantity) }))
        const o = await createOrder({
          items,
          deliveryAddress,
          receiverName: deliveryInfo.name,
          receiverPhone: deliveryInfo.phone,
          memo: deliveryInfo.memo ?? "",
        })
        orderId = Number(o?.id ?? o?.orderId)
      }
      if (!orderId) throw new Error("주문 번호가 없습니다.")

      const paymentInfo =
          paymentMethod === "CARD"
              ? onlyDigits(cardNumber)
              : onlyDigits(accountNumber)

      await requestPayment({
        orderId,
        paymentMethod,
        paymentInfo,
      })

      router.push(`/orders?paid=${orderId}`)
    } catch (e: any) {
      const raw = e?.response?.data
      console.error("checkout/payment error:", { status: e?.response?.status, data: raw, message: e?.message })
      alert(raw?.message || e?.message || "주문/결제 처리 중 오류가 발생했습니다.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
      <div className="min-h-screen bg-black text-white">
        <main className="container mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold mb-8">주문/결제</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader><CardTitle className="text-white">배송 정보</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-300">받는 분</Label>
                      <Input id="name" value={deliveryInfo.name}
                             onChange={(e) => setDeliveryInfo({ ...deliveryInfo, name: e.target.value })}
                             className="bg-gray-800 border-gray-700 text-white mt-2" />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-gray-300">연락처</Label>
                      <Input id="phone" value={deliveryInfo.phone}
                             onChange={(e) => setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })}
                             className="bg-gray-800 border-gray-700 text-white mt-2" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-gray-300">주소</Label>
                    <Input id="address" value={deliveryInfo.address}
                           onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                           className="bg-gray-800 border-gray-700 text-white mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="detailAddress" className="text-gray-300">상세 주소</Label>
                    <Input id="detailAddress" value={deliveryInfo.detailAddress}
                           onChange={(e) => setDeliveryInfo({ ...deliveryInfo, detailAddress: e.target.value })}
                           className="bg-gray-800 border-gray-700 text-white mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="memo" className="text-gray-300">배송 메모</Label>
                    <Textarea id="memo" value={deliveryInfo.memo}
                              onChange={(e) => setDeliveryInfo({ ...deliveryInfo, memo: e.target.value })}
                              className="bg-gray-800 border-gray-700 text-white mt-2" rows={3} />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader><CardTitle className="text-white">결제 방법</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)}>
                    <div className="flex items-center space-x-3 p-4 border border-gray-700 rounded-lg">
                      <RadioGroupItem value="CARD" id="card" className="border-gray-600 text-white" />
                      <Label htmlFor="card" className="flex items-center text-white cursor-pointer">
                        <CreditCard className="w-5 h-5 mr-2" />신용카드
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border border-gray-700 rounded-lg">
                      <RadioGroupItem value="TRANSFER" id="transfer" className="border-gray-600 text-white" />
                      <Label htmlFor="transfer" className="flex items-center text-white cursor-pointer">
                        <MessageCircle className="w-5 h-5 mr-2" />계좌이체
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "CARD" ? (
                      <div className="mt-2">
                        <Label htmlFor="cardNumber" className="text-gray-300">카드번호(숫자)</Label>
                        <Input id="cardNumber" inputMode="numeric" pattern="\d*"
                               value={cardNumber}
                               onChange={(e) => setCardNumber(onlyDigits(e.target.value).slice(0, 19))}
                               className="bg-gray-800 border-gray-700 text-white mt-2"
                               placeholder="숫자만" />
                      </div>
                  ) : (
                      <div className="mt-2">
                        <Label htmlFor="accountNumber" className="text-gray-300">계좌번호(숫자)</Label>
                        <Input id="accountNumber" inputMode="numeric" pattern="\d*"
                               value={accountNumber}
                               onChange={(e) => setAccountNumber(onlyDigits(e.target.value).slice(0, 24))}
                               className="bg-gray-800 border-gray-700 text-white mt-2"
                               placeholder="숫자만" />
                      </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader><CardTitle className="text-white">주문 상품</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((it) => (
                      <div key={`${it.id}-${it.size}-${it.color}`} className="flex items-center space-x-3">
                        <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                          <Image src={it.imageUrl || "/placeholder.svg"} alt={it.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-medium text-sm">{it.name}</h4>
                          <p className="text-gray-400 text-xs">{it.size} | {it.color} | {it.quantity}개</p>
                          <p className="text-white font-bold text-sm">
                            {(Number(it.price) * it.quantity).toLocaleString()}원
                          </p>
                        </div>
                      </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader><CardTitle className="text-white">결제 금액</CardTitle></CardHeader>
                <CardContent className="space-y-3">
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
                  <Button
                      onClick={handleOrder}
                      disabled={submitting || cartItems.length === 0 || !canSubmit}
                      className="w-full bg-white text-black hover:bg-gray-200 mt-6"
                  >
                    {submitting ? "처리 중..." : `${finalPrice.toLocaleString()}원 결제하기`}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
  )
}
