// app/search/page.tsx
import { Suspense } from "react"

// 클라이언트 컴포넌트는 별도로 분리
function SearchPageInner() {
  "use client"

  import { useState, useEffect, useMemo } from "react"
  import { useSearchParams } from "next/navigation"
  import Image from "next/image"
  import Link from "next/link"
  import { Search } from "lucide-react"
  import { Button } from "@/components/ui/button"
  import { Input } from "@/components/ui/input"
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

  type Product = {
    id: number
    name: string
    price: number
    originalPrice?: number
    image?: string
    imageUrl?: string
    category?: { id?: number; name?: string }
    categoryId?: number
    categoryName?: string
    isNew?: boolean
  }

  const categoryNameToId: Record<string, number> = {
    all: 0,
    // 필요 시 카테고리 매핑 채워넣기
  }

  const normalize = (list: any[]): Product[] => {
    return (list ?? []).map((p) => ({
      id: Number(p.id),
      name: String(p.name ?? ""),
      price: Number(p.price ?? 0),
      originalPrice: p.originalPrice != null ? Number(p.originalPrice) : undefined,
      image: p.image ?? p.imageUrl ?? "/placeholder.svg",
      imageUrl: p.imageUrl ?? p.image,
      category: p.category?.name ? { id: p.category?.id, name: p.category?.name } : undefined,
      categoryId: p.category?.id ?? p.categoryId,
      isNew: Boolean(p.isNew),
    }))
  }

  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const [searchTerm, setSearchTerm] = useState(initialQuery)
  const [sortBy, setSortBy] = useState("latest")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const params: Record<string, string | number> = { page: 0, size: 48 }
      if (searchTerm.trim()) params.q = searchTerm.trim()
      if (categoryFilter !== "all") params.categoryId = categoryNameToId[categoryFilter] ?? ""

      if (sortBy === "price-low") params.sort = "price,asc"
      else if (sortBy === "price-high") params.sort = "price,desc"

      const qs = new URLSearchParams(params as any).toString()
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || ""
      const res = await fetch(`${base}/api/products?${qs}`)
      if (!res.ok) throw new Error(`API ${res.status}`)
      const data = await res.json()
      setProducts(normalize(data?.content ?? data?.items ?? data ?? []))
    } catch (e: any) {
      setError(e?.message ?? "불러오기 실패")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, sortBy, categoryFilter])

  const filteredProducts = useMemo(() => products, [products])
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts]
    switch (sortBy) {
      case "price-low": return list.sort((a, b) => a.price - b.price)
      case "price-high": return list.sort((a, b) => b.price - a.price)
      case "name": return list.sort((a, b) => a.name.localeCompare(b.name))
      default: return list
    }
  }, [filteredProducts, sortBy])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const url = `/search?q=${encodeURIComponent(searchTerm)}`
    window.history.pushState({}, "", url)
    fetchProducts()
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="상품명을 검색하세요"
              className="pl-9 bg-gray-900 border-gray-700 text-white placeholder-gray-500"
            />
          </form>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
              <SelectValue placeholder="카테고리" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700 text-white">
              <SelectItem value="all">전체</SelectItem>
              {/* 필요 시 항목 추가 */}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
              <SelectValue placeholder="정렬" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700 text-white">
              <SelectItem value="latest">최신순</SelectItem>
              <SelectItem value="name">이름순</SelectItem>
              <SelectItem value="price-low">가격낮은순</SelectItem>
              <SelectItem value="price-high">가격높은순</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-gray-400">불러오는 중…</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : sortedProducts.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center">
            <p className="text-gray-300">검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProducts.map((p) => (
              <Link key={p.id} href={`/product/${p.id}`} className="group">
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                  <div className="relative w-full aspect-[4/5]">
                    <Image
                      src={p.image ?? "/placeholder.svg"}
                      alt={p.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                      priority={false}
                      unoptimized
                    />
                  </div>
                  <div className="p-4">
                    {p.isNew && (
                      <span className="inline-block px-2 py-0.5 text-xs bg-green-600/20 text-green-400 rounded-full mb-2">
                        NEW
                      </span>
                    )}
                    <div className="text-white font-medium truncate">{p.name}</div>
                    <div className="text-gray-300 mt-1">
                      {p.price.toLocaleString()}원
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

// 페이지 컴포넌트(서버)에서 Suspense로 감싸기
export default function Page() {
  return (
    <Suspense fallback={<div className="text-gray-400">불러오는 중…</div>}>
      <SearchPageInner />
    </Suspense>
  )
}
