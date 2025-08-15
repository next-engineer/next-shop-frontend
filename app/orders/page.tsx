"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Search, Calendar, Star, RotateCcw, MessageSquare } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getMyOrders, cancelPayment } from "@/lib/api/purchase"

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [q, setQ] = useState("")
  const [status, setStatus] = useState<string>("all")

  useEffect(() => {
    ;(async () => {
      const data = await getMyOrders()
      setOrders(data.orders ?? [])
    })()
  }, [])

  const filtered = orders.filter((o) => {
    const nameHit = o.items?.some((i: any) => (i.name || "").toLowerCase().includes(q.toLowerCase()))
    const statusHit = status === "all" ? true : o.status === status
    return nameHit && statusHit
  })

  return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold mb-8">주문 내역</h1>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 flex items-center gap-2 bg-gray-900 rounded-lg p-2 border border-gray-800">
              <Search className="w-5 h-5 text-gray-400" />
              <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="상품명으로 검색"
                  className="bg-transparent border-0 text-white focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[180px] bg-gray-900 border-gray-800 text-white">
                <SelectValue placeholder="상태" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-800 text-white">
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="PAID">결제완료</SelectItem>
                <SelectItem value="PREPARING">상품준비중</SelectItem>
                <SelectItem value="SHIPPED">배송중</SelectItem>
                <SelectItem value="DELIVERED">배송완료</SelectItem>
                <SelectItem value="CANCELED">취소</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-6">
            {filtered.map((order) => (
                <Card key={order.id} className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-300">{order.createdAt}</span>
                      </div>
                      <Badge className="bg-white text-black hover:bg-white">{order.status}</Badge>
                    </div>

                    <div className="space-y-4">
                      {order.items?.map((item: any) => (
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

                    <div className="flex items-center justify-end gap-2 mt-4">
                      <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800 bg-transparent">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        문의하기
                      </Button>
                      <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800 bg-transparent">
                        <Star className="w-4 h-4 mr-2" />
                        리뷰쓰기
                      </Button>
                      {order.paymentId && (
                          <Button
                              variant="outline"
                              className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                              onClick={async () => {
                                await cancelPayment(order.paymentId)
                                const data = await getMyOrders()
                                setOrders(data.orders ?? [])
                              }}
                          >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            결제취소
                          </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
            ))}
          </div>
        </main>
        <Footer />
      </div>
  )
}
