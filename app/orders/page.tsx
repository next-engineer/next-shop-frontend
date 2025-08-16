"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { Search, Calendar, Package, Star, RotateCcw, MessageSquare } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getMyOrders } from "@/lib/api/purchase"

type OrderItem = {
  id?: number
  productId?: number
  name?: string
  price?: number
  quantity?: number
  image?: string
  size?: string
  color?: string
  hasReview?: boolean
}

type Order = {
  id: string
  date: string
  status: "배송완료" | "배송중" | "주문확인" | "취소" | string
  totalAmount: number
  items: OrderItem[]
  trackingNumber?: string
}

function toKSTDateString(d: string | Date | undefined) {
  if (!d) return ""
  const dt = typeof d === "string" ? new Date(d) : d
  if (Number.isNaN(dt.getTime())) return ""
  return dt.toISOString().slice(0, 10)
}

function mapOrder(raw: any): Order {
  const itemsRaw = raw?.items ?? raw?.orderItems ?? []
  const items: OrderItem[] = Array.isArray(itemsRaw)
      ? itemsRaw.map((it: any) => ({
        id: it?.id,
        productId: it?.productId ?? it?.product?.id,
        name: it?.name ?? it?.product?.name ?? `상품 #${it?.productId ?? it?.id ?? ""}`,
        price: Number(it?.price ?? it?.product?.price ?? 0),
        quantity: Number(it?.quantity ?? 0),
        image: it?.imageUrl ?? it?.image ?? "/placeholder.svg",
        size: it?.size,
        color: it?.color,
        hasReview: Boolean(it?.hasReview),
      }))
      : []

  const totalAmount =
      Number(raw?.totalAmount ?? raw?.total_price ?? 0) ||
      items.reduce((sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 0), 0)

  return {
    id: String(raw?.id ?? raw?.orderId ?? ""),
    date: toKSTDateString(raw?.date ?? raw?.createdAt),
    status: raw?.status ?? "주문확인",
    totalAmount,
    items,
    trackingNumber: raw?.trackingNumber,
  }
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState("all")
  const [dateRange, setDateRange] = useState("3months")
  const [selectedTab, setSelectedTab] = useState("all")

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getMyOrders()
        const mapped: Order[] = Array.isArray(data) ? data.map(mapOrder) : []
        setOrders(mapped)
      } catch (e: any) {
        setError(e?.message ?? "주문내역을 불러오지 못했습니다.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filteredOrders = useMemo(() => {
    let list = orders

    if (selectedTab !== "all") {
      list = list.filter((o) => {
        if (selectedTab === "shipping") return o.status === "배송중"
        if (selectedTab === "completed") return o.status === "배송완료"
        if (selectedTab === "confirmed") return o.status === "주문확인"
        if (selectedTab === "canceled") return o.status === "취소"
        return true
      })
    }

    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase()
      list = list.filter((o) => {
        if (searchType === "id") return o.id.toLowerCase().includes(q)
        if (searchType === "name")
          return o.items?.some((it) => (it.name ?? "").toLowerCase().includes(q))
        return (
            o.id.toLowerCase().includes(q) ||
            o.items?.some((it) => (it.name ?? "").toLowerCase().includes(q))
        )
      })
    }

    if (dateRange !== "all") {
      const months = dateRange === "1month" ? 1 : dateRange === "3months" ? 3 : 6
      const now = new Date()
      const cutoff = new Date(now.getFullYear(), now.getMonth() - months, now.getDate())
      list = list.filter((o) => {
        const d = new Date(o.date)
        return !Number.isNaN(d.getTime()) && d >= cutoff
      })
    }

    return list
  }, [orders, selectedTab, searchTerm, searchType, dateRange])

  const tabCounts = useMemo(() => {
    const all = orders.length
    const shipping = orders.filter((o) => o.status === "배송중").length
    const completed = orders.filter((o) => o.status === "배송완료").length
    const confirmed = orders.filter((o) => o.status === "주문확인").length
    const canceled = orders.filter((o) => o.status === "취소").length
    return { all, shipping, completed, confirmed, canceled }
  }, [orders])

  return (
      <div className="min-h-screen bg-black text-white">
        {/* <Header /> */}
        <main className="container mx-auto px-4 py-16">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">주문내역</h1>
            <p className="text-gray-400 mt-2">최근 주문을 확인하고 관리하세요.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1 space-y-6">
              <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                <h2 className="text-lg font-semibold mb-4">검색</h2>
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="주문번호 또는 상품명"
                        className="pl-9 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={searchType} onValueChange={setSearchType}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="검색 유형" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700 text-white">
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="id">주문번호</SelectItem>
                      <SelectItem value="name">상품명</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                <h2 className="text-lg font-semibold mb-4">기간</h2>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="기간 선택" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700 text-white">
                    <SelectItem value="1month">최근 1개월</SelectItem>
                    <SelectItem value="3months">최근 3개월</SelectItem>
                    <SelectItem value="6months">최근 6개월</SelectItem>
                    <SelectItem value="all">전체</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2 text-gray-400 mt-3">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">기간 내 주문만 표시합니다.</span>
                </div>
              </div>
            </aside>

            <section className="lg:col-span-3">
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
                <TabsList className="bg-gray-900 border border-gray-800 rounded-xl p-1">
                  <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-black">
                    전체 ({tabCounts.all})
                  </TabsTrigger>
                  <TabsTrigger value="shipping" className="data-[state=active]:bg-white data-[state=active]:text-black">
                    배송중 ({tabCounts.shipping})
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="data-[state=active]:bg-white data-[state=active]:text-black">
                    배송완료 ({tabCounts.completed})
                  </TabsTrigger>
                  <TabsTrigger value="confirmed" className="data-[state=active]:bg-white data-[state=active]:text-black">
                    주문확인 ({tabCounts.confirmed})
                  </TabsTrigger>
                  <TabsTrigger value="canceled" className="data-[state=active]:bg-white data-[state=active]:text-black">
                    취소 ({tabCounts.canceled})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  {loading ? (
                      <div className="text-gray-400">불러오는 중…</div>
                  ) : error ? (
                      <div className="text-red-500">{error}</div>
                  ) : filteredOrders.length === 0 ? (
                      <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center">
                        <p className="text-gray-300 mb-6">주문 내역이 없습니다.</p>
                        <Button className="bg-white text-black hover:bg-gray-200" onClick={() => (window.location.href = "/")}>
                          쇼핑하러 가기
                        </Button>
                      </div>
                  ) : (
                      <div className="space-y-6">
                        {filteredOrders.map((order) => (
                            <Card key={order.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                              <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                  <CardTitle className="text-white">
                                    주문번호 {order.id}
                                  </CardTitle>
                                  <div className="text-gray-400 text-sm mt-1">
                                    주문일자 {order.date || "-"}
                                  </div>
                                </div>
                                <Badge
                                    className="bg-white text-black hover:bg-white/90"
                                    variant="secondary"
                                >
                                  {order.status}
                                </Badge>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                {order.items?.map((item, idx) => (
                                    <div key={`${item.id ?? idx}`} className="flex items-center gap-4">
                                      <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-800">
                                        <Image
                                            src={item.image || "/placeholder.svg"}
                                            alt={item.name || "상품"}
                                            fill
                                            className="object-cover"
                                        />
                                      </div>
                                      <div className="flex-1">
                                        <div className="text-white font-medium">
                                          {item.name}
                                          <span className="text-gray-400 text-sm ml-2">
                                    {item.size ? `· ${item.size}` : ""}{item.color ? ` · ${item.color}` : ""}
                                  </span>
                                        </div>
                                        <div className="text-gray-400 text-sm">
                                          수량 {item.quantity ?? 0}개
                                        </div>
                                      </div>
                                      <div className="text-white font-semibold">
                                        {(((item.price || 0) * (item.quantity || 0)) || 0).toLocaleString()}원
                                      </div>
                                    </div>
                                ))}

                                <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                                  <div className="text-gray-400 text-sm">
                                    {order.trackingNumber ? `운송장 ${order.trackingNumber}` : ""}
                                  </div>
                                  <div className="text-white font-bold">
                                    합계 {order.totalAmount.toLocaleString()}원
                                  </div>
                                </div>

                                <div className="flex gap-2 justify-end">
                                  {order.status === "배송완료" && (
                                      <Button size="sm" className="bg-white text-black hover:bg-gray-200">
                                        <Star className="w-4 h-4 mr-1" />
                                        리뷰 작성
                                      </Button>
                                  )}
                                  {order.status === "취소" ? (
                                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-400 bg-transparent" disabled>
                                        <MessageSquare className="w-4 h-4 mr-1" />
                                        문의하기
                                      </Button>
                                  ) : (
                                      <Button size="sm" variant="outline" className="border-gray-600 text-white bg-transparent">
                                        <RotateCcw className="w-4 h-4 mr-1" />
                                        주문상세
                                      </Button>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                        ))}
                      </div>
                  )}
                </TabsContent>
              </Tabs>
            </section>
          </div>
        </main>
        {/* <Footer /> */}
      </div>
  )
}
