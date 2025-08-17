export const dynamicParams = false;
export async function generateStaticParams() {
  return ['1', '2', '3', '4', '5'].map((id) => ({ id }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const { id } = await Promise.resolve(params);

  // ↓ 기존 상세 호출/렌더링 로직
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${id}`, { cache: 'no-store' });
  // const product = await res.json();
  // return <ProductView product={product} />;

  return <div />; // ← 기존 JSX로 교체
}
