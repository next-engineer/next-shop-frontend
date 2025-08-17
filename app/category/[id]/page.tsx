// SSG용: 사전 생성할 카테고리 id들 (필요하면 수정)
export const dynamicParams = false;
export async function generateStaticParams() {
  return ['1', '2', '3', '4', '5'].map((id) => ({ id }));
}

export default async function CategoryPage({
  // ✅ PageProps 쓰지 말고, union으로 받아서 내부에서 정규화
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const { id } = await Promise.resolve(params); // ✅ Promise든 아니든 통일

  // ↓ 기존 데이터 호출/렌더링 로직 그대로 두세요
  // const res = await fetch(
  //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/products?categoryId=${id}&page=0&size=3`,
  //   { cache: 'no-store' }
  // );
  // const data = await res.json();
  // return <CategoryView id={id} data={data} />;

  return <div />; // ← 여기를 기존 JSX로 바꿔 넣기
}
