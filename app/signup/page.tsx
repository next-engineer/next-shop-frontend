"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Check, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Footer } from "@/components/footer"

export default function SignupPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    address: {
      mainAddress: "",
      detailAddress: "",
    },
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    marketing: false,
  })

  const [validation, setValidation] = useState({
    email: { isValid: false, message: "" },
    password: { isValid: false, message: "" },
    confirmPassword: { isValid: false, message: "" },
    name: { isValid: false, message: "" },
    phone: { isValid: false, message: "" },
  })

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("address.")) {
      const key = field.split(".")[1]
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [key]: value }
      }))
      return
    }

    setFormData(prev => ({ ...prev, [field]: value }))

    switch (field) {
      case 'email': validateEmail(value); break
      case 'password': validatePassword(value); break
      case 'confirmPassword': validateConfirmPassword(value); break
      case 'name': validateName(value); break
      case 'phone': validatePhone(value); break
    }
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setValidation(prev => ({
      ...prev,
      email: emailRegex.test(email)
        ? { isValid: true, message: "사용 가능한 이메일입니다." }
        : { isValid: false, message: "올바른 이메일 형식이 아닙니다." }
    }))
  }

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/
    setValidation(prev => ({
      ...prev,
      password: passwordRegex.test(password)
        ? { isValid: true, message: "사용 가능한 비밀번호입니다." }
        : { isValid: false, message: "영문, 숫자, 특수문자 포함 8자 이상이어야 합니다." }
    }))
  }

  const validateConfirmPassword = (confirmPassword: string) => {
    setValidation(prev => ({
      ...prev,
      confirmPassword: confirmPassword === formData.password
        ? { isValid: true, message: "비밀번호가 일치합니다." }
        : { isValid: false, message: "비밀번호가 일치하지 않습니다." }
    }))
  }

  const validateName = (name: string) => {
    const nameRegex = /^[가-힣]{3,6}$/;
    setValidation(prev => ({
      ...prev,
      name: nameRegex.test(name)
        ? { isValid: true, message: "사용 가능한 이름입니다." }
        : { isValid: false, message: "한글 3~6글자여야 합니다." }
    }))
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^01[016789]-?\d{3,4}-?\d{4}$/;
    setValidation(prev => ({
      ...prev,
      phone: phoneRegex.test(phone)
        ? { isValid: true, message: "사용 가능한 전화번호입니다." }
        : { isValid: false, message: "올바른 전화번호 형식이 아닙니다." }
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreements.terms || !agreements.privacy) {
      alert("필수 약관에 동의해주세요.")
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      alert("가입 완료되었습니다!")
      router.push("/")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between">
      <main className="container mx-auto px-4 py-16 flex-1">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">MUST DARK</h1>
            <p className="text-gray-400">새로운 스타일의 시작</p>
          </div>

          <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-800">
            <h2 className="text-2xl font-bold text-center mb-8">회원가입</h2>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* 이메일 */}
              <div className="space-y-2 relative">
                <Label htmlFor="email">이메일 *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="이메일을 입력하세요"
                  required
                  className="bg-gray-800 border-gray-700 text-white h-12 rounded-lg pr-10"
                />
                <div className="absolute right-3 top-9">
                  {validation.email.isValid ? <Check className="text-green-500" /> : formData.email && <X className="text-red-500" />}
                </div>
              </div>

              {/* 이름 */}
              <div className="space-y-2 relative">
                <Label htmlFor="name">이름 *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="이름을 입력하세요"
                  required
                  className="bg-gray-800 border-gray-700 text-white h-12 rounded-lg pr-10"
                />
                <div className="absolute right-3 top-9">
                  {validation.name.isValid ? <Check className="text-green-500" /> : formData.name && <X className="text-red-500" />}
                </div>
              </div>

              {/* 전화번호 */}
              <div className="space-y-2 relative">
                <Label htmlFor="phone">전화번호 *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="전화번호를 입력하세요"
                  required
                  className="bg-gray-800 border-gray-700 text-white h-12 rounded-lg pr-10"
                />
                <div className="absolute right-3 top-9">
                  {validation.phone.isValid ? <Check className="text-green-500" /> : formData.phone && <X className="text-red-500" />}
                </div>
              </div>

              {/* 주소 */}
              <div className="space-y-2">
                <Label htmlFor="mainAddress">주소 *</Label>
                <Input
                  id="mainAddress"
                  value={formData.address.mainAddress}
                  onChange={(e) => handleInputChange('address.mainAddress', e.target.value)}
                  placeholder="주소를 입력하세요"
                  required
                  className="bg-gray-800 border-gray-700 text-white h-12 rounded-lg"
                />

                <Label htmlFor="detailAddress">상세주소 *</Label>
                <Input
                  id="detailAddress"
                  value={formData.address.detailAddress}
                  onChange={(e) => handleInputChange('address.detailAddress', e.target.value)}
                  placeholder="상세주소를 입력하세요"
                  required
                  className="bg-gray-800 border-gray-700 text-white h-12 rounded-lg"
                />
              </div>

              {/* 비밀번호 */}
              <div className="space-y-2 relative">
                <Label htmlFor="password">비밀번호 *</Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  required
                  className="bg-gray-800 border-gray-700 text-white h-12 rounded-lg pr-10"
                />
                <div
                  className="absolute right-3 top-9 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </div>
                <div className="absolute right-10 top-9">
                  {validation.password.isValid ? <Check className="text-green-500" /> : formData.password && <X className="text-red-500" />}
                </div>
              </div>

              {/* 비밀번호 확인 */}
              <div className="space-y-2 relative">
                <Label htmlFor="confirmPassword">비밀번호 확인 *</Label>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="비밀번호를 다시 입력하세요"
                  required
                  className="bg-gray-800 border-gray-700 text-white h-12 rounded-lg pr-10"
                />
                <div
                  className="absolute right-3 top-9 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </div>
                <div className="absolute right-10 top-9">
                  {validation.confirmPassword.isValid ? <Check className="text-green-500" /> : formData.confirmPassword && <X className="text-red-500" />}
                </div>
              </div>

              {/* 약관 동의 */}
              <div className="space-y-2 mt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreements.terms}
                    onCheckedChange={(checked) => setAgreements(prev => ({ ...prev, terms: !!checked }))}
                  />
                  <Label htmlFor="terms" className="text-white">
                    [필수] 서비스 이용약관 동의
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="privacy"
                    checked={agreements.privacy}
                    onCheckedChange={(checked) => setAgreements(prev => ({ ...prev, privacy: !!checked }))}
                  />
                  <Label htmlFor="privacy" className="text-white">
                    [필수] 개인정보 처리방침 동의
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="marketing"
                    checked={agreements.marketing}
                    onCheckedChange={(checked) => setAgreements(prev => ({ ...prev, marketing: !!checked }))}
                  />
                  <Label htmlFor="marketing" className="text-white">
                    [선택] 마케팅 정보 수신 동의              
                  </Label>
                </div>
              </div>

              <Button type="submit" className="w-full h-12 mt-4">{isLoading ? "가입중..." : "회원가입"}</Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
