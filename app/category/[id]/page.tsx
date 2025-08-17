export const dynamicParams = false;

// SSG로 미리 만들 경로들
export async function generateStaticParams() {
  return ['1', '2', '3', '4', '5'].map((id) => ({ id }));
}

// ❗️여기서는 타입 붙이지 말고 any로 받자(Next 15의 PageProps 강제와 충돌 방지)
export default async function CategoryPage(props: any) {
  const p = await Promise.resolve(props?.params);
  const id = p?.id as string;

  // 여기에 원래 쓰던 데이터 호출/렌더링 로직 붙이면 됨
  // const res = await fetch(
  //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/products?categoryId=${id}&page=0&size=12`,
  //   { cache: 'no-store' }
  // );
  // const data = await res.json();
  // return <CategoryView id={id} data={data} />;

  return <div />; // ← 네 JSX로 교체
}
