// 서버 컴포넌트: 정적 export 전용
import ProductClient from "./product-client";

export const dynamic = "error";     // 런타임 동적 렌더링 금지 (정적만 허용)
export const dynamicParams = false; // generateStaticParams로 만든 것만 허용
export const revalidate = 0;        // 페이지 자체는 정적

// ✅ 빌드 타임에 만들어둘 상품 ID 목록
export function generateStaticParams() {
  // CodeBuild 환경변수로 제어 가능: STATIC_PRODUCT_IDS="101,102,103"
  const raw =
    process.env.STATIC_PRODUCT_IDS ??
    process.env.NEXT_PUBLIC_STATIC_PRODUCT_IDS; // 혹시 기존 변수 쓰고 있으면 사용
  const ids = (raw ? raw.split(",") : ["1", "2", "3"])
    .map((s) => s.trim())
    .filter(Boolean);

  return ids.map((id) => ({ id }));
}

export default function ProductPage({ params }: { params: { id: string } }) {
  // 데이터 호출은 클라이언트에서 (정적 export 안전)
  return <ProductClient id={params.id} />;
}
