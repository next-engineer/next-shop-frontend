"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { register } from "@/lib/api/user"

export default function SignupPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    addressMain: "",
    addressDetail: "",
  })
  const [showPw, setShowPw] = useState(false)
  const [showPwC, setShowPwC] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const onChange =
      (k: keyof typeof form) =>
          (e: React.ChangeEvent<HTMLInputElement>) =>
              setForm((s) => ({ ...s, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (form.password !== form.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.")
      return
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("이메일 형식을 확인하세요.")
      return
    }
    if (!form.phone) {
      setError("전화번호를 입력하세요.")
      return
    }

    const delivery_address = [form.addressMain, form.addressDetail].filter(Boolean).join(" ")
    setIsLoading(true)
    try {
      await register({
        email: form.email,
        password: form.password,
        name: form.name,
        delivery_address,
        phone_number: form.phone,
      })
      setSuccess("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.")
      setTimeout(() => (window.location.href = "/login"), 800)
    } catch (err: any) {
      setError(err?.message ?? "회원가입 실패")
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <div className="min-h-screen bg-black text-white">
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2">MUST DARK</h1>
              <p className="text-gray-400">어둠 속에서 빛나는 스타일</p>
            </div>

            <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-800">
              <h2 className="text-2xl font-bold text-center mb-8">회원가입</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300 text-sm font-medium">
                    이메일
                  </Label>
                  <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={onChange("email")}
                      placeholder="이메일을 입력하세요"
                      required
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus-visible:ring-white focus-visible:ring-offset-0 h-12 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-300 text-sm font-medium">
                      비밀번호
                    </Label>
                    <div className="relative">
                      <Input
                          id="password"
                          type={showPw ? "text" : "password"}
                          value={form.password}
                          onChange={onChange("password")}
                          placeholder="비밀번호"
                          required
                          className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus-visible:ring-white focus-visible:ring-offset-0 h-12 rounded-lg pr-12"
                      />
                      <button
                          type="button"
                          onClick={() => setShowPw((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-300 text-sm font-medium">
                      비밀번호 확인
                    </Label>
                    <div className="relative">
                      <Input
                          id="confirmPassword"
                          type={showPwC ? "text" : "password"}
                          value={form.confirmPassword}
                          onChange={onChange("confirmPassword")}
                          placeholder="비밀번호 확인"
                          required
                          className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus-visible:ring-white focus-visible:ring-offset-0 h-12 rounded-lg pr-12"
                      />
                      <button
                          type="button"
                          onClick={() => setShowPwC((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPwC ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300 text-sm font-medium">
                    이름
                  </Label>
                  <Input
                      id="name"
                      value={form.name}
                      onChange={onChange("name")}
                      placeholder="이름"
                      required
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus-visible:ring-white focus-visible:ring-offset-0 h-12 rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300 text-sm font-medium">
                    전화번호
                  </Label>
                  <Input
                      id="phone"
                      value={form.phone}
                      onChange={onChange("phone")}
                      placeholder="010-0000-0000"
                      required
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus-visible:ring-white focus-visible:ring-offset-0 h-12 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="addressMain" className="text-gray-300 text-sm font-medium">
                      주소
                    </Label>
                    <Input
                        id="addressMain"
                        value={form.addressMain}
                        onChange={onChange("addressMain")}
                        placeholder="기본 주소"
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus-visible:ring-white focus-visible:ring-offset-0 h-12 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="addressDetail" className="text-gray-300 text-sm font-medium">
                      상세주소
                    </Label>
                    <Input
                        id="addressDetail"
                        value={form.addressDetail}
                        onChange={onChange("addressDetail")}
                        placeholder="상세 주소"
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus-visible:ring-white focus-visible:ring-offset-0 h-12 rounded-lg"
                    />
                  </div>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-white text-black hover:bg-gray-200 h-12 rounded-lg font-semibold transition-all duration-200"
                >
                  {isLoading ? "가입 중..." : "회원가입"}
                </Button>

                {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                {success && <p className="text-sm text-emerald-400 text-center">{success}</p>}
              </form>
            </div>
          </div>
        </main>
      </div>
  )
}
