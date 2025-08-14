"use client"

import React, { useState, useEffect, useRef } from "react"
import { ProductCard } from "./ProductCard"

type Product = { id: number; name: string; price: number | string; imageUrl?: string; createdAt?: string }

type SortOrder = "newest" | "asc" | "desc"

export default function ProductsWithSort({ products }: { products: Product[] }) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest") // 기본값 신상품순
  const [sortedProducts, setSortedProducts] = useState<Product[]>([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!products) return

    let sorted: Product[] = []

    if (sortOrder === "newest") {
      // 신상품순: 최신 날짜 기준 정렬 (createdAt이 없으면 원본 배열 그대로)
      sorted = [...products].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return dateB - dateA
      })
    } else {
      // 가격 기준 정렬
      sorted = [...products].sort((a, b) => {
        const priceA = typeof a.price === "string" ? parseFloat(a.price) : a.price
        const priceB = typeof b.price === "string" ? parseFloat(b.price) : b.price
        return sortOrder === "asc" ? priceA - priceB : priceB - priceA
      })
    }

    setSortedProducts(sorted)
  }, [sortOrder, products])

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownOpen])

  return (
    <>
      <div className="mb-4 flex justify-end items-center relative mb-4" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="px-3 py-1 border rounded bg-gray-800 text-white flex items-center space-x-2"
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
        >
          <span>상품 정렬</span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-gray-800 rounded shadow-lg border border-gray-700 z-10">
            <button
              onClick={() => {
                setSortOrder("newest")
                setDropdownOpen(false)
              }}
              className={`block w-full text-left px-4 py-2 hover:bg-gray-700 ${
                sortOrder === "newest" ? "font-semibold bg-gray-700" : ""
              } text-white`}
            >
              신상품순
            </button>
            <button
              onClick={() => {
                setSortOrder("asc")
                setDropdownOpen(false)
              }}
              className={`block w-full text-left px-4 py-2 hover:bg-gray-700 ${
                sortOrder === "asc" ? "font-semibold bg-gray-700" : ""
              } text-white`}
            >
              가격 낮은순
            </button>
            <button
              onClick={() => {
                setSortOrder("desc")
                setDropdownOpen(false)
              }}
              className={`block w-full text-left px-4 py-2 hover:bg-gray-700 ${
                sortOrder === "desc" ? "font-semibold bg-gray-700" : ""
              } text-white`}
            >
              가격 높은순
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <div>상품이 없습니다.</div>
        )}
      </div>
    </>
  )
}
