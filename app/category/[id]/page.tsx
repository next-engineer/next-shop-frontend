import CategoryClient from "./category-client";

export const dynamic = "error"; // 정적 export 강제
export const revalidate = 0;    // 페이지 자체는 정적(데이터는 클라이언트에서 가져옴)

export async function generateStaticParams() {
  // 최소한 보여줄 카테고리 id를 하드코딩 (백엔드 호출 없이)
  return ['1', '2', '3', '4', '5'].map((id) => ({ id }));
}

export default function CategoryPage({ params }: { params: { id: string } }) {
  // 서버에서는 데이터 호출 안 함(정적 export 안전)
  return <CategoryClient id={params.id} />;
}