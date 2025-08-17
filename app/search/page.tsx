import { Suspense } from "react";
import SearchContent from "./search-content";

export const metadata = { title: "검색" };

export default function SearchPage() {
  // ✅ 서버 컴포넌트: 여기에서는 useSearchParams 같은 클라이언트 훅 절대 사용 금지
  return (
    <main className="container pt-6 pb-12">
      <h1 className="text-2xl font-bold mb-4">검색</h1>
      {/* ✅ 클라이언트 컴포넌트를 반드시 Suspense로 감싼다 */}
      <Suspense fallback={<div>검색어를 불러오는 중…</div>}>
        <SearchContent />
      </Suspense>
    </main>
  );
}