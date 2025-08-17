export const dynamicParams = false;

export async function generateStaticParams() {
  return ['1', '2', '3', '4', '5'].map((id) => ({ id }));
}

export default async function ProductPage(props: any) {
  const p = await Promise.resolve(props?.params);
  const id = p?.id as string;

  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${id}`, { cache: 'no-store' });
  // const product = await res.json();
  // return <ProductView product={product} />;

  return <div />; // ← 네 JSX로 교체
}
