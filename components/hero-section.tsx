export function HeroSection() {
  return (
    <section className="relative h-[70vh] flex items-center justify-center bg-gradient-to-r from-black via-gray-900 to-black">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          MUST DARK
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
          어둠 속에서 빛나는 스타일. 심플하고 고급스러운 패션을 경험하세요.
        </p>
      </div>
    </section>
  )
}