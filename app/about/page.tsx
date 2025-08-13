import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            MUST DARK
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">어둠 속에서 빛나는 스타일</p>
          <div className="w-24 h-1 bg-white mx-auto"></div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">브랜드 스토리</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                MUST DARK는 2020년 서울에서 시작된 프리미엄 패션 브랜드입니다. 우리는 단순함 속에서 찾는 완벽함, 어둠 속에서 발견하는 빛을 추구합니다.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                모든 제품은 최고급 소재와 정교한 디테일로 완성되며, 현대인의 라이프스타일에 완벽하게 어울리는 미니멀한 디자인을 지향합니다.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                MUST DARK와 함께 당신만의 독특한 스타일을 완성해보세요.
              </p>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300">
              <Image src="/minimalist-dark-fashion-studio.png" alt="MUST DARK 브랜드 이미지" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">브랜드 가치</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "M", title: "미니멀리즘", desc: "불필요한 요소를 제거하고 본질에 집중하는 디자인 철학" },
              { icon: "Q", title: "품질", desc: "최고급 소재와 정교한 제작 과정을 통한 완벽한 품질 구현" },
              { icon: "S", title: "지속가능성", desc: "환경을 생각하는 지속가능한 패션과 책임감 있는 생산" },
            ].map((item) => (
              <div key={item.title} className="text-center p-6 bg-gray-800 rounded-lg transition transform hover:-translate-y-2 hover:scale-105 hover:shadow-xl group">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-black text-2xl font-bold">{item.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-4 transition-all duration-300 group-hover:text-white group-hover:scale-105 inline-block">
                  {item.title}
                </h3>
                <p className="text-gray-300 transition-colors duration-300 group-hover:text-gray-100">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">팀 소개</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { emoji: "👨‍💼", name: "TAMI", role: "Creative Director", desc: "15년간의 패션 업계 경험을 바탕으로 MUST DARK의 창조적 비전을 이끌고 있습니다." },
              { emoji: "👩‍💼", name: "MARY", role: "Design Director", desc: "미니멀 디자인의 전문가로서 MUST DARK만의 독특한 스타일을 완성합니다." },
            ].map((member) => (
              <div key={member.name} className="p-6 bg-gray-900 rounded-lg transition transform hover:-translate-y-2 hover:scale-105 hover:shadow-2xl group">
                <div className="w-32 h-32 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">{member.emoji}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 transition-all duration-300 group-hover:text-white group-hover:scale-105 inline-block">{member.name}</h3>
                <p className="text-gray-400 mb-4 transition-colors duration-300 group-hover:text-gray-200">{member.role}</p>
                <p className="text-gray-300 transition-colors duration-300 group-hover:text-gray-100">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}