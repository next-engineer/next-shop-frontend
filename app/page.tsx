import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ProductGrid } from "@/components/product-grid"
import { RecentlyViewed } from "@/components/recently-viewed"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header,Footer는 RootLayout에서 렌더링하므로 여기서는 주석 처리 */}
      {/* <Header /> */}

      <main>
        <HeroSection />
        <ProductGrid />
        <RecentlyViewed />
      </main>

      {/* <Footer /> */}
    </div>
  )
}
