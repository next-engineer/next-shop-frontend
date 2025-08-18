// app/category/[id]/page.tsx
import CategoryClient from "./category-client";


// SSG용 기본 경로(필요 없으면 범위를 줄이거나 삭제해도 됨)
export async function generateStaticParams() {
  return ["1", "2", "3", "4", "5"].map((id) => ({ id }));
}

// ✅ params 는 Promise 아님! (Next 15 표준)
export default function Page({ params }: { params: { id: string } }) {
  const idNum = Number(params.id);
  return <CategoryClient categoryId={idNum} />;
}