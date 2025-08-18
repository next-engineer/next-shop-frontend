// app/search/search-client.tsx
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
    category?: string
    categoryId?: number
    isNew?: boolean
}

const categoryNameToId: Record<string, number> = { 모자:1, 신발:2, 상의:3, 하의:4, 아우터:5 }

async function apiGet<T>(path: string, params?: Record<string, string | number>) {
    const qs = params ? "?" + new URLSearchParams(Object.entries(params).map(([k,v]) => [k, String(v)])).toString() : ""
    const res = await fetch(`${path}${qs}`, { cache: "no-store" })
    if (!res.ok) throw new Error(await res.text())
    return (await res.json()) as T
}

function normalizeProducts(data: any): Product[] {
    const list: any[] = Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : []
    return list.map((p) => ({
        id: Number(p.id),
        name: String(p.name ?? ""),
        price: Number(p.price ?? 0),
        originalPrice: p.originalPrice != null ? Number(p.originalPrice) : undefined,
        image: p.image ?? p.imageUrl ?? "/placeholder.svg",
        imageUrl: p.imageUrl ?? p.image,
        category: p.category?.name ?? p.categoryName,
        categoryId: p.category?.id ?? p.categoryId,
        isNew: Boolean(p.isNew),
    }))
}

export default function SearchClient() {
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
            else params.sort = "createdAt,desc"
            const data = await apiGet<any>("/api/products", params)
            setProducts(normalizeProducts(data))
        } catch (e: any) {
            setError(e?.message ?? "검색에 실패했습니다.")
            setProducts([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialQuery])

    useEffect(() => {
        if (!initialQuery) fetchProducts()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryFilter, sortBy])

    const filteredProducts = useMemo(() => {
        const q = searchTerm.trim().toLowerCase()
        return q ? products.filter((p) => p.name.toLowerCase().includes(q)) : products
    }, [products, searchTerm])

    const sortedProducts = useMemo(() => {
        const list = [...filteredProducts]
        switch (sortBy) {
            case "price-low": return list.sort((a,b)=>a.price-b.price)
            case "price-high": return list.sort((a,b)=>b.price-a.price)
            case "name": return list.sort((a,b)=>a.name.localeCompare(b.name))
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
        <>
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
                        <SelectItem value="모자">모자</SelectItem>
                        <SelectItem value="신발">신발</SelectItem>
                        <SelectItem value="상의">상의</SelectItem>
                        <SelectItem value="하의">하의</SelectItem>
                        <SelectItem value="아우터">아우터</SelectItem>
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
                                        src={p.imageUrl || p.image || "/placeholder.svg"}
                                        alt={p.name}
                                        fill
                                        className="object-cover group-hover:scale-[1.02] transition-transform"
                                    />
                                </div>
                                <div className="p-4">
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
        </>
    )
}
