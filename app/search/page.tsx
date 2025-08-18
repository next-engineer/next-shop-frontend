// app/search/page.tsx
import { Suspense } from "react"
import SearchPageClient from "./SearchPageClient"

export default function Page() {
  return (
    <Suspense fallback={<div className="text-gray-400">불러오는 중…</div>}>
      <SearchPageClient />
    </Suspense>
  )
}
