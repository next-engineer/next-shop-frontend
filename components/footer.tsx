import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">MUST DARK</h3>
            <p className="text-gray-400 mb-4 max-w-md">
              어둠 속에서 빛나는 스타일. 심플하고 고급스러운 패션을 통해 당신만의 개성을 표현하세요.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">빠른 링크</h4>
            <div className="flex flex-col space-y-2">
              <Link href="/about">
                <button className="text-gray-400 hover:text-white transition-colors text-left">
                  브랜드 소개
                </button>
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4">고객 서비스</h4>
            <div className="flex flex-col space-y-2 text-gray-400">
              <span> <a href="tel:01012341234" className="hover:text-white transition-colors">010-1234-1234</a></span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">© 2024 MUST DARK. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
