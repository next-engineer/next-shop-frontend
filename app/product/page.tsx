// app/product/page.tsx
import type { PageProps } from "next"
import ProductDetail from "./product-detail"

export default async function ProductPage(
  { searchParams }: PageProps<{}, { pid?: string }>
) {
  const sp = await searchParams             // ✅ Next 15 방식
  const pid = sp?.pid ?? ""
  return <ProductDetail pid={pid} />
}