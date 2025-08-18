// app/category/[id]/page.tsx
import Image from "next/image"
import Link from "next/link"

export const dynamicParams = false; // 정적 export 필수(동적 매개변수 허용 X)

export function generateStaticParams() {
  // 카테고리 id가 1~5 라고 가정
  return ["1","2","3","4","5"].map((id) => ({ id }));
}

type Props = { params: { id: string } };

async function getCategoryProducts(id: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
  // 30개 요청 (이전엔 12개만 보였던 원인)
  const res = await fetch(`${base}/products?categoryId=${id}&page=0&size=30`, {
    // 정적 export에서도 API 호출을 빌드타임에 고정하고 싶으면 revalidate 제거
    // 혹은 next: { revalidate: 60 } 등으로 주기적 재생성
    cache: "force-cache",
  });
  if (!res.ok) throw new Error("failed to fetch");
  return res.json();
}

export default async function Page({ params }: Props) {
  const { id } = params;
  const data = await getCategoryProducts(id);
  const items = data?.content ?? [];

  return (
    <main className="container">
      <h1>카테고리 {id}</h1>
      <div className="grid">
        {items.map((p: any) => (
          <Link
            key={p.id}
            href={`/product-detail?id=${p.id}`} // 상세는 query 방식(아래 3번 참고)
            className="card"
          >
            <Image src={p.imageUrl} alt={p.name} width={600} height={600} />
            <div className="info">
              <div>{p.name}</div>
              <div>{p.price}</div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
