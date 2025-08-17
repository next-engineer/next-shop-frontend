import { Suspense } from "react"
import SearchContent from "./search-content"

export const metadata = { title: "검색" }

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <Suspense fallback={<div>검색어를 불러오는 중…</div>}>
            <SearchContent />
          </Suspense>
        </div>
      </main>
    </div>
  )
}