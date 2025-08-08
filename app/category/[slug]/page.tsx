"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Filter, Grid, List } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const categoryData = {
  tops: {
    name: "상의",
    description: "세련된 상의 컬렉션",
    products: [
      { id: 1, name: "미니멀 블랙 티셔츠", price: 45000, originalPrice: 55000, image: "/black-minimal-tshirt.png", isNew: true },
      { id: 6, name: "오버사이즈 후디", price: 75000, image: "/placeholder.svg?height=400&width=300", isNew: true },
      { id: 7, name: "베이직 크루넥", price: 35000, image: "/placeholder.svg?height=400&width=300", isNew: false },
      { id: 8, name: "롱슬리브 티셔츠", price: 42000, image: "/placeholder.svg?height=400&width=300", isNew: false },
    ]
  },
  bottoms: {
    name: "하의",
    description: "스타일리시한 하의",
    products: [
      { id: 2, name: "다크 슬림 진", price: 89000, image: "/dark-slim-jeans.png", isNew: false },
      { id: 9, name: "와이드 팬츠", price: 65000, image: "/placeholder.svg?height=400&width=300", isNew: true },
      { id: 10, name: "조거 팬츠", price: 55000, image: "/placeholder.svg?height=400&width=300", isNew: false },
    ]
  },
  accessories: {
    name: "액세서리",
    description: "포인트 액세서리",
    products: [
      { id: 3, name: "레더 크로스백", price: 120000, image: "/black-leather-crossbag.png", isNew: true },
      { id: 11, name: "미니멀 지갑", price: 45000, image: "/placeholder.svg?height=400&width=300", isNew: false },
      { id: 12, name: "실버 체인", price: 35000, image: "/placeholder.svg?height=400&width=300", isNew: true },
    ]
  },
  hats: {
    name: "모자",
    description: "트렌디한 모자",
    products: [
      { id: 4, name: "베이직 비니", price: 25000, image: "/black-beanie-hat.png", isNew: false },
      { id: 13, name: "볼캡", price: 32000, image: "/placeholder.svg?height=400&width=300", isNew: true },
      { id: 14, name: "버킷햇", price: 28000, image: "/placeholder.svg?height=400&width=300", isNew: false },
    ]
  },
  shoes: {
    name: "신발",
    description: "고급스러운 신발",
    products: [
      { id: 5, name: "첼시 부츠", price: 180000, originalPrice: 220000, image: "/black-chelsea-boots.png", isNew: false },
      { id: 15, name: "스니커즈", price: 95000, image: "/placeholder.svg?height=400&width=300", isNew: true },
      { id: 16, name: "로퍼", price: 125000, image: "/placeholder.svg?height=400&width=300", isNew: false },
    ]
  }
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('latest')
  const [priceRange, setPriceRange] = useState<string[]>([])
  const [showOnlyNew, setShowOnlyNew] = useState(false)

  const category = categoryData[params.slug as keyof typeof categoryData]
  
  if (!category) {
    return <div>카테고리를 찾을 수 없습니다.</div>
  }

  const filteredProducts = category.products.filter(product => {
    if (showOnlyNew && !product.isNew) return false
    if (priceRange.length > 0) {
      const price = product.price
      return priceRange.some(range => {
        switch (range) {
          case 'under50': return price < 50000
          case '50to100': return price >= 50000 && price < 100000
          case '100to200': return price >= 100000 && price < 200000
          case 'over200': return price >= 200000
          default: return true
        }
      })
    }
    return true
  })

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-16">
        {/* 카테고리 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
          <p className="text-gray-400 text-lg">{category.description}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 필터 사이드바 */}
          <div className="lg:w-64 bg-gray-900 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              필터
            </h3>

            {/* 가격 필터 */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">가격대</h4>
              <div className="space-y-2">
                {[
                  { value: 'under50', label: '5만원 미만' },
                  { value: '50to100', label: '5만원 - 10만원' },
                  { value: '100to200', label: '10만원 - 20만원' },
                  { value: 'over200', label: '20만원 이상' },
                ].map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.value}
                      checked={priceRange.includes(option.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setPriceRange([...priceRange, option.value])
                        } else {
                          setPriceRange(priceRange.filter(p => p !== option.value))
                        }
                      }}
                      className="border-gray-600 data-[state=checked]:bg-white data-[state=checked]:border-white"
                    />
                    <Label htmlFor={option.value} className="text-gray-300 text-sm">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* 신상품 필터 */}
            <div className="mb-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="newOnly"
                  checked={showOnlyNew}
                  onCheckedChange={setShowOnlyNew}
                  className="border-gray-600 data-[state=checked]:bg-white data-[state=checked]:border-white"
                />
                <Label htmlFor="newOnly" className="text-gray-300">
                  신상품만 보기
                </Label>
              </div>
            </div>

            {/* 필터 초기화 */}
            <Button
              onClick={() => {
                setPriceRange([])
                setShowOnlyNew(false)
              }}
              variant="outline"
              className="w-full border-gray-600 text-white hover:bg-gray-800 bg-transparent"
            >
              필터 초기화
            </Button>
          </div>

          {/* 상품 목록 */}
          <div className="flex-1">
            {/* 정렬 및 뷰 옵션 */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-400">총 {filteredProducts.length}개 상품</p>
              <div className="flex items-center space-x-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32 bg-gray-900 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="latest">최신순</SelectItem>
                    <SelectItem value="price-low">가격 낮은순</SelectItem>
                    <SelectItem value="price-high">가격 높은순</SelectItem>
                    <SelectItem value="name">이름순</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex border border-gray-700 rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={viewMode === 'grid' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={viewMode === 'list' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* 상품 그리드 */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`group relative bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-all duration-300 ${
                    viewMode === 'list' ? 'flex items-center p-4' : ''
                  }`}
                >
                  <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-24 h-24 flex-shrink-0' : 'aspect-[3/4]'}`}>
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.isNew && (
                      <span className="absolute top-3 left-3 bg-white text-black text-xs font-semibold px-2 py-1 rounded">
                        NEW
                      </span>
                    )}
                    {product.originalPrice && (
                      <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                        SALE
                      </span>
                    )}
                  </div>

                  <div className={`p-4 ${viewMode === 'list' ? 'flex-1 ml-4' : ''}`}>
                    <Link href={`/product/${product.id}`}>
                      <h3 className="text-white font-semibold mb-2 hover:text-gray-300 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-white font-bold">{product.price.toLocaleString()}원</span>
                      {product.originalPrice && (
                        <span className="text-gray-500 line-through text-sm">
                          {product.originalPrice.toLocaleString()}원
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-white text-black hover:bg-gray-200 flex-1">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        장바구니
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
