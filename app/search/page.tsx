// app/search/page.tsx
import { Suspense } from "react"
import SearchClient from "./search-client"

export const revalidate = 60

export default function SearchPage() {
  return (
      <div className="min-h-screen bg-black text-white">
        <main className="container mx-auto px-4 py-12">
          <h1 className="text-2xl font-bold mb-6">검색</h1>
          <Suspense fallback={<div className="text-gray-400">검색어 읽는 중…</div>}>
            <SearchClient />
          </Suspense>
        </main>
      </div>
  )
}
