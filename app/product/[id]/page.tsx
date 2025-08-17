type PageProps = { params: Promise<{ id: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  // 초기 프리렌더할 상품 id들
  return ['1', '2', '3', '4', '5'].map((id) => ({ id }));
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params; // ✅ await
  // 기존 상세 호출/렌더링 로직
  return <div />; // 기존 JSX로 교체
}
