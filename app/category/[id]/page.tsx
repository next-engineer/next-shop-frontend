import CategoryClient from "./category-client";

export const dynamic = "error"; // 정적 export 강제
export const revalidate = 0;    // 페이지 자체는 정적(데이터는 클라이언트에서 가져옴)

export async function generateStaticParams() {
  // ✅ 빌드 타임에 생성할 카테고리 목록을 반환
  const ids = [1, 2, 3, 4, 5]; // ← 실제 운영 범위로 수정
  return ids.map((id) => ({ id: String(id) }));
}

export default function CategoryPage({ params }: { params: { id: string } }) {
  // 서버에서는 데이터 호출 안 함(정적 export 안전)
  return <CategoryClient id={params.id} />;
}