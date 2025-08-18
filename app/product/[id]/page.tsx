// app/product/[id]/page.tsx
import ProductClient from "./product-client";

export const dynamicParams = true;

export async function generateStaticParams() {
  return ["1", "2", "3", "4", "5"].map((id) => ({ id }));
}

export default function Page({ params }: { params: { id: string } }) {
  return <ProductClient productId={Number(params.id)} />;
}
