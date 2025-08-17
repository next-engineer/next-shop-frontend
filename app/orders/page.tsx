"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getMyOrders, getPaymentsByOrder } from "@/lib/api/purchase"

type OrderItem = {
  productId: number
  name: string
  imageUrl?: string
  price: number
  quantity: number
  size?: string
  color?: string
}
type Order = {
  id: number
  status: string
  createdAt?: string
  items: OrderItem[]
  totalPrice: number
}

type Payment = {
  id: number
  orderId: number
  amount: number
  method: string
  maskedCardNumber?: string
  pgTransactionId?: string
  createdAt?: string
  status?: string
}

const statusMap: Record<
    string,
    { label: string; tab: "all" | "confirmed" | "shipping" | "completed" | "canceled" }
> = {
  CREATED:   { label: "주문확인", tab: "confirmed" },
  PAID:      { label: "결제완료", tab: "confirmed" },
  FAILED:    { label: "결제실패", tab: "confirmed" },
  SHIPPING:  { label: "배송중",   tab: "shipping" },
  DELIVERED: { label: "배송완료", tab: "completed" },
  CANCELLED: { label: "취소",     tab: "canceled"  },
}

function mapOrder(raw: any): Order {
  const rawStatus = String(raw?.status ?? "")
  const mapped = statusMap[rawStatus] ?? { label: rawStatus || "주문확인", tab: "confirmed" }
  const rawItems = Array.isArray(raw?.items) ? raw.items : Array.isArray(raw?.orderItems) ? raw.orderItems : []

  const items: OrderItem[] = rawItems.map((it: any) => {
    const product = it?.product ?? {}
    return {
      productId: Number(it?.productId ?? product?.id),
      name: String(it?.name ?? product?.name ?? ""),
      imageUrl: it?.imageUrl ?? product?.imageUrl ?? "/placeholder.svg",
      price: Number(it?.price ?? product?.price ?? 0),
      quantity: Number(it?.quantity ?? 0),
      size: it?.size,
      color: it?.color,
    }
  })

  const totalPrice =
      Number(raw?.totalPrice) ||
      items.reduce((s, it) => s + Number(it.price) * Number(it.quantity), 0)

  return {
    id: Number(raw?.id ?? raw?.orderId),
    status: mapped.label,
    createdAt: raw?.createdAt,
    items,
    totalPrice,
  }
}

export default function OrdersPage() {
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedTab, setSelectedTab] = useState<"all" | "confirmed" | "shipping" | "completed" | "canceled">("all")
  const [searchType, setSearchType] = useState<"all" | "id" | "name">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [openPayments, setOpenPayments] = useState<Record<number, boolean>>({})
  const [payments, setPayments] = useState<Record<number, Payment[]>>({})
  const [loadingPaymentOrderId, setLoadingPaymentOrderId] = useState<number | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        const res = await getMyOrders()
        const rows = Array.isArray(res) ? res : Array.isArray(res?.content) ? res.content : []
        setOrders(rows.map(mapOrder))
      } catch (e) {
        alert("주문 목록을 불러오지 못했습니다.")
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const filtered = useMemo(() => {
    let list = [...orders]

    if (selectedTab !== "all") {
      list = list.filter((o) => {
        if (selectedTab === "confirmed") return o.status === "주문확인" || o.status === "결제완료" || o.status === "결제실패"
        if (selectedTab === "shipping") return o.status === "배송중"
        if (selectedTab === "completed") return o.status === "배송완료"
        if (selectedTab === "canceled") return o.status === "취소"
        return true
      })
    }

    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase()
      list = list.filter((o) => {
        if (searchType === "id") return String(o.id).toLowerCase().includes(q)
        if (searchType === "name")
          return o.items?.some((it) => (it.name ?? "").toLowerCase().includes(q))
        return (
            String(o.id).toLowerCase().includes(q) ||
            o.items?.some((it) => (it.name ?? "").toLowerCase().includes(q))
        )
      })
    }

    return list
  }, [orders, selectedTab, searchType, searchTerm])

  const togglePayments = async (orderId: number) => {
    const nextOpen = !openPayments[orderId]
    setOpenPayments((prev) => ({ ...prev, [orderId]: nextOpen }))
    if (!nextOpen) return
    if (payments[orderId]) return
    setLoadingPaymentOrderId(orderId)
    try {
      const res = await getPaymentsByOrder(orderId)
      const rows: Payment[] = Array.isArray(res) ? res : Array.isArray(res?.content) ? res.content : [res].filter(Boolean)
      setPayments((prev) => ({ ...prev, [orderId]: rows }))
    } catch (e) {
      alert("결제 내역을 불러오지 못했습니다.")
    } finally {
      setLoadingPaymentOrderId(null)
    }
  }

  return (
      <div className="min-h-screen bg-black text-white">
        <main className="container mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold mb-8">주문 내역</h1>

          <div className="flex items-center gap-3 mb-6">
            <Select value={searchType} onValueChange={(v: any) => setSearchType(v)}>
              <SelectTrigger className="w-36 bg-gray-900 border-gray-800 text-white">
                <SelectValue placeholder="검색 기준" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 text-white border-gray-800">
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="id">주문번호</SelectItem>
                <SelectItem value="name">상품명</SelectItem>
              </SelectContent>
            </Select>
            <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="검색어를 입력하세요"
                className="bg-gray-900 border-gray-800 text-white"
            />
          </div>

          <Tabs value={selectedTab} onValueChange={(v: any) => setSelectedTab(v)} className="mb-8">
            <TabsList className="bg-gray-900 border border-gray-800">
              <TabsTrigger value="all">전체</TabsTrigger>
              <TabsTrigger value="confirmed">주문확인</TabsTrigger>
              <TabsTrigger value="shipping">배송중</TabsTrigger>
              <TabsTrigger value="completed">배송완료</TabsTrigger>
              <TabsTrigger value="canceled">취소</TabsTrigger>
            </TabsList>
            <TabsContent value={selectedTab} />
          </Tabs>

          {loading ? (
              <p className="text-gray-400">불러오는 중...</p>
          ) : filtered.length === 0 ? (
              <p className="text-gray-400">주문이 없습니다.</p>
          ) : (
              <div className="space-y-6">
                {filtered.map((order) => (
                    <Card key={order.id} className="bg-gray-900 border-gray-800">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-white">주문번호 #{order.id}</CardTitle>
                        <div className="flex items-center gap-3">
                          <Badge className="bg-white text-black hover:bg-white/90" variant="secondary">
                            {order.status}
                          </Badge>
                          {order.status === "결제완료" && (
                              <span className="text-green-400 text-sm">결제 확인됨</span>
                          )}
                          <Button
                              variant="outline"
                              className="border-gray-700 text-white"
                              onClick={() => togglePayments(order.id)}
                          >
                            {openPayments[order.id] ? "결제내역 닫기" : "결제내역"}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          {order.items.map((item, idx) => (
                              <div key={`${order.id}-${item.productId}-${idx}`} className="flex items-center gap-3">
                                <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                                  <Image
                                      src={item.imageUrl || "/placeholder.svg"}
                                      alt={item.name}
                                      fill
                                      className="object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm text-white">{item.name}</div>
                                  <div className="text-xs text-gray-400">
                                    {item.size} {item.color ? `| ${item.color}` : ""} | {item.quantity}개
                                  </div>
                                </div>
                                <div className="text-white font-semibold">
                                  {(Number(item.price) * Number(item.quantity)).toLocaleString()}원
                                </div>
                              </div>
                          ))}
                        </div>

                        <div className="border-t border-gray-800 pt-3 flex items-center justify-between">
                          <span className="text-gray-400">총 결제 금액</span>
                          <span className="text-white text-lg font-bold">
                      {Number(order.totalPrice).toLocaleString()}원
                    </span>
                        </div>

                        {openPayments[order.id] && (
                            <div className="mt-4 border-t border-gray-800 pt-4">
                              {loadingPaymentOrderId === order.id ? (
                                  <p className="text-gray-400">결제내역 불러오는 중...</p>
                              ) : (payments[order.id]?.length ?? 0) === 0 ? (
                                  <p className="text-gray-400">결제내역이 없습니다.</p>
                              ) : (
                                  <div className="space-y-2">
                                    {payments[order.id]!.map((pay) => (
                                        <div key={pay.id} className="flex items-center justify-between text-sm">
                                          <div className="text-gray-300">
                                            <span className="mr-2">결제ID: {pay.id}</span>
                                            <span className="mr-2">방법: {pay.method}</span>
                                            {pay.maskedCardNumber && <span className="mr-2">{pay.maskedCardNumber}</span>}
                                            {pay.pgTransactionId && <span className="mr-2">승인: {pay.pgTransactionId}</span>}
                                            {pay.status && <span className="mr-2">상태: {pay.status}</span>}
                                          </div>
                                          <div className="text-white font-semibold">
                                            {Number(pay.amount).toLocaleString()}원
                                          </div>
                                        </div>
                                    ))}
                                  </div>
                              )}
                            </div>
                        )}
                      </CardContent>
                    </Card>
                ))}
              </div>
          )}
        </main>
      </div>
  )
}
