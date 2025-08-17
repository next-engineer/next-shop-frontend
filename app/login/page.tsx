"use client"
import { apiFetch } from '@/lib/api';
import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { login } from "@/lib/api/user"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      await login(email, password)
      window.location.href = "/"
    } catch (err: any) {
      setError(err?.message ?? "로그인 실패")
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <div className="min-h-screen bg-black text-white">
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2">MUST DARK</h1>
              <p className="text-gray-400">어둠 속에서 빛나는 스타일</p>
            </div>

            <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-800">
              <h2 className="text-2xl font-bold text-center mb-8">로그인</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300 text-sm font-medium">이메일</Label>
                  <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus-visible:ring-white focus-visible:ring-offset-0 h-12 rounded-lg focus:border-white focus:ring-1 focus:ring-white"
                      placeholder="이메일을 입력하세요"
                      required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300 text-sm font-medium">비밀번호</Label>
                  <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus-visible:ring-white focus-visible:ring-offset-0 h-12 rounded-lg focus:border-white focus:ring-1 focus:ring-white pr-12"
                        placeholder="비밀번호를 입력하세요"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-white text-black hover:bg-gray-200 h-12 rounded-lg font-semibold transition-all duration-200"
                >
                  {isLoading ? "로그인 중..." : "로그인"}
                </Button>

                {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span className="hover:text-white">비밀번호를 잊으셨나요?</span>
                  <Link href="/signup" className="text-white hover:underline">
                    회원가입
                  </Link>
                </div>

                <div className="relative my-8">
                  <Separator className="bg-gray-700" />
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 px-4 text-gray-400 text-sm">
                  또는
                </span>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
  )
}
