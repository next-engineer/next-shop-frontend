import { HeroSection } from "@/components/hero-section"
import ProductGrid from "@/components/product-grid"
import { RecentlyViewed } from "@/components/recently-viewed"

export const revalidate = 60

export default function HomePage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <main>
                <HeroSection />
                <ProductGrid />
                <RecentlyViewed />
            </main>
        </div>
    )
}
