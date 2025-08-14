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
    email: "", password: "", confirmPassword: "",
    name: "", phone: "", address: { mainAddress: "", detailAddress: "" }
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [agreements, setAgreements] = useState({ terms: false, privacy: false, marketing: false })
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
      setFormData(prev => ({ ...prev, address: { ...prev.address, [key]: value } }))
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
      email: emailRegex.test(email) ? { isValid: true, message: "" } : { isValid: false, message: "" }
    }))
  }
  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/
    setValidation(prev => ({
      ...prev,
      password: passwordRegex.test(password) ? { isValid: true, message: "" } : { isValid: false, message: "" }
    }))
  }
  const validateConfirmPassword = (confirmPassword: string) => {
    setValidation(prev => ({
      ...prev,
      confirmPassword: confirmPassword === formData.password ? { isValid: true, message: "" } : { isValid: false, message: "" }
    }))
  }
  const validateName = (name: string) => {
    const nameRegex = /^[가-힣]{3,6}$/
    setValidation(prev => ({
      ...prev,
      name: nameRegex.test(name) ? { isValid: true, message: "" } : { isValid: false, message: "" }
    }))
  }
  const validatePhone = (phone: string) => {
    const phoneRegex = /^01[016789]-?\d{3,4}-?\d{4}$/
    setValidation(prev => ({
      ...prev,
      phone: phoneRegex.test(phone) ? { isValid: true, message: "" } : { isValid: false, message: "" }
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreements.terms || !agreements.privacy) { alert("필수 약관에 동의해주세요."); return }
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      alert("가입 완료되었습니다!")
      router.push("/")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between">
      <main className="flex-1 flex justify-center items-center p-4">
        <div className="w-full max-w-md bg-gray-900 rounded-2xl p-6 md:p-8 shadow-2xl border border-gray-800 flex flex-col gap-4 md:gap-6">

          <div className="text-center mb-2">
            <h1 className="text-3xl md:text-4xl font-bold">MUST DARK</h1>
            <p className="text-gray-400 text-sm md:text-base">새로운 스타일의 시작</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:gap-4">

            {/** 이메일 */}
            <div className="relative">
              <Label htmlFor="email">이메일 *</Label>
              <Input id="email" type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)}
                placeholder="이메일" required className="bg-gray-800 border-gray-700 text-white h-12 rounded-lg pr-10"/>
              <div className="absolute right-3 top-9">{validation.email.isValid ? <Check className="text-green-500"/> : formData.email && <X className="text-red-500"/>}</div>
            </div>

            {/** 이름 */}
            <div className="relative">
              <Label htmlFor="name">이름 *</Label>
              <Input id="name" type="text" value={formData.name} onChange={e => handleInputChange('name', e.target.value)}
                placeholder="이름" required className="bg-gray-800 border-gray-700 text-white h-12 rounded-lg pr-10"/>
              <div className="absolute right-3 top-9">{validation.name.isValid ? <Check className="text-green-500"/> : formData.name && <X className="text-red-500"/>}</div>
            </div>

            {/** 전화번호 */}
            <div className="relative">
              <Label htmlFor="phone">전화번호 *</Label>
              <Input id="phone" type="tel" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)}
                placeholder="전화번호" required className="bg-gray-800 border-gray-700 text-white h-12 rounded-lg pr-10"/>
              <div className="absolute right-3 top-9">{validation.phone.isValid ? <Check className="text-green-500"/> : formData.phone && <X className="text-red-500"/>}</div>
            </div>

            {/** 주소 */}
            <div className="relative">
              <Label htmlFor="inAddress">주소 *</Label>
            <Input id="mainAddress" value={formData.address.mainAddress} onChange={e => handleInputChange('address.mainAddress', e.target.value)}
              placeholder="주소" required className="bg-gray-800 border-gray-700 text-white h-12 rounded-lg"/>
            </div>  
            <div>          
            <Input id="detailAddress" value={formData.address.detailAddress} onChange={e => handleInputChange('address.detailAddress', e.target.value)}
              placeholder="상세주소" required className="bg-gray-800 border-gray-700 text-white h-12 rounded-lg"/>
            </div>

            {/** 비밀번호 */}
            <div className="relative">
              <Label htmlFor="password">비밀번호 *</Label>
              <Input id="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={e => handleInputChange('password', e.target.value)}
                placeholder="비밀번호" required className="bg-gray-800 border-gray-700 text-white h-12 rounded-lg pr-10"/>
              <div className="absolute right-3 top-9 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff/> : <Eye/>}
              </div>
              <div className="absolute right-10 top-9">{validation.password.isValid ? <Check className="text-green-500"/> : formData.password && <X className="text-red-500"/>}</div>
            </div>

            {/** 비밀번호 확인 */}
            <div className="relative">
              <Label htmlFor="confirmPassword">비밀번호 확인 *</Label>
              <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={e => handleInputChange('confirmPassword', e.target.value)}
                placeholder="비밀번호 확인" required className="bg-gray-800 border-gray-700 text-white h-12 rounded-lg pr-10"/>
              <div className="absolute right-3 top-9 cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff/> : <Eye/>}
              </div>
              <div className="absolute right-10 top-9">{validation.confirmPassword.isValid ? <Check className="text-green-500"/> : formData.confirmPassword && <X className="text-red-500"/>}</div>
            </div>

            {/** 약관 동의 */}
            <div className="flex flex-col gap-1 mt-2">
              <div className="flex items-center gap-2"><Checkbox id="terms" checked={agreements.terms} onCheckedChange={c => setAgreements(prev => ({...prev, terms: !!c}))}/><Label htmlFor="terms" className="text-white text-sm">[필수] 서비스 이용약관</Label></div>
              <div className="flex items-center gap-2"><Checkbox id="privacy" checked={agreements.privacy} onCheckedChange={c => setAgreements(prev => ({...prev, privacy: !!c}))}/><Label htmlFor="privacy" className="text-white text-sm">[필수] 개인정보 처리방침</Label></div>
              <div className="flex items-center gap-2"><Checkbox id="marketing" checked={agreements.marketing} onCheckedChange={c => setAgreements(prev => ({...prev, marketing: !!c}))}/><Label htmlFor="marketing" className="text-white text-sm">[선택] 마케팅 정보 수신</Label></div>
            </div>

            <Button
             type="submit"
             className="w-full h-12 mt-4 bg-gray-700 text-white font-semibold hover:bg-white hover:text-black transition-colors duration-300"
              disabled={isLoading}
            >
             {isLoading ? "가입 중..." : "회원가입"}
            </Button>

            {/* 체크 아이콘 */}
              <div className="absolute right-10 top-9">
                 {validation.password.isValid ? <Check className="text-emerald-500" /> : formData.password && <X className="text-red-500" />}
              </div>
          </form>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  )
}
