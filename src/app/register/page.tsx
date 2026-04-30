'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Phone, ArrowRight, ArrowLeft, User, Building2, MapPin, CheckCircle } from 'lucide-react'
import { CITIES, BUSINESS_TYPES } from '@/types'
import { signUpWithEmail, createEmployerProfile } from '@/lib/services'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    city: '',
    companyName: '',
    businessType: '',
  })

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleNext = () => {
    if (step === 1) {
      if (!form.name || !form.email || !form.phone || !form.password) {
        setError('Please fill in all required fields')
        return
      }
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match')
        return
      }
      if (form.password.length < 6) {
        setError('Password must be at least 6 characters')
        return
      }
    }
    if (step === 2) {
      if (!form.city) {
        setError('Please select your city')
        return
      }
    }
    setStep((prev) => prev + 1)
    setError('')
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreedToTerms) {
      setError('Please agree to the terms and conditions')
      return
    }
    setLoading(true)
    setError('')

    const { data: authData, error: authError } = await signUpWithEmail(form.email, form.password, {
      full_name: form.name,
      phone: form.phone,
      role: 'employer',
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (authData.user) {
      const { error: profileError } = await createEmployerProfile(authData.user.id, {
        full_name: form.name,
        phone: form.phone,
        city: form.city,
        company_name: form.companyName,
        business_type: form.businessType,
      })

      if (profileError) {
        setError('Account created but profile setup failed. Please contact support.')
        setLoading(false)
        return
      }

      router.push('/dashboard')
    }
  }

  const stepLabels = ['Basic Info', 'Location', 'Business']

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-6 pt-14 pb-12 rounded-b-[36px] relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full" />
        <div className="max-w-md mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">MazdoorPing</h1>
              <p className="text-blue-200 text-xs font-medium">Employer Portal</p>
            </div>
          </div>
          <h2 className="text-xl font-bold text-white">Create Account</h2>
          <p className="text-blue-100 text-sm mt-1">
            Step {step} of 3 — {stepLabels[step - 1]}
          </p>
          <div className="mt-4 flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  s < step ? 'bg-white' : s === step ? 'bg-white w-full' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 -mt-4 pb-8">
        <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/60 p-6 max-w-md mx-auto border border-gray-100/50">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-5 text-sm animate-fade-in">
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); handleNext() }} className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={(e) => updateForm('name', e.target.value)}
                    className="pl-11 h-12 bg-gray-50/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => updateForm('email', e.target.value)}
                    className="pl-11 h-12 bg-gray-50/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="tel"
                    placeholder="+92 300 1234567"
                    value={form.phone}
                    onChange={(e) => updateForm('phone', e.target.value)}
                    className="pl-11 h-12 bg-gray-50/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="password"
                    placeholder="Min 6 characters"
                    value={form.password}
                    onChange={(e) => updateForm('password', e.target.value)}
                    className="pl-11 h-12 bg-gray-50/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Confirm Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="password"
                    placeholder="Re-enter password"
                    value={form.confirmPassword}
                    onChange={(e) => updateForm('confirmPassword', e.target.value)}
                    className="pl-11 h-12 bg-gray-50/50"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/25 mt-2"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={(e) => { e.preventDefault(); handleNext() }} className="space-y-4">
              <div className="space-y-2">
                <Label>City *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Select
                    value={form.city}
                    onChange={(e) => updateForm('city', e.target.value)}
                    className="pl-11 h-12 bg-gray-50/50 appearance-none"
                  >
                    <option value="">Select your city</option>
                    {CITIES.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/25"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="w-full h-12 rounded-xl font-semibold text-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label>
                  Company Name <span className="text-gray-400 font-normal">(Optional)</span>
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Your company name"
                    value={form.companyName}
                    onChange={(e) => updateForm('companyName', e.target.value)}
                    className="pl-11 h-12 bg-gray-50/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Business Type</Label>
                <Select
                  value={form.businessType}
                  onChange={(e) => updateForm('businessType', e.target.value)}
                  className="h-12 bg-gray-50/50 appearance-none"
                >
                  <option value="">Select business type</option>
                  {BUSINESS_TYPES.map((bt) => (
                    <option key={bt.value} value={bt.value}>{bt.label}</option>
                  ))}
                </Select>
              </div>

              <div className="bg-blue-50 rounded-2xl p-4 text-sm text-gray-600 border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="font-semibold text-gray-800">Employer Account</p>
                </div>
                <p className="text-xs text-gray-500 ml-10">Post jobs, hire workers, and manage your workforce.</p>
              </div>

              <label className="flex items-start gap-3 cursor-pointer group" onClick={() => setAgreedToTerms(!agreedToTerms)}>
                <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  agreedToTerms ? 'bg-primary border-primary' : 'border-gray-300'
                }`}>
                  {agreedToTerms && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
                <span className="text-xs text-gray-500 leading-relaxed">
                  I agree to the{' '}
                  <span className="text-primary font-medium">Terms of Service</span> and{' '}
                  <span className="text-primary font-medium">Privacy Policy</span>
                </span>
              </label>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/25"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(2)}
                className="w-full h-12 rounded-xl font-semibold text-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </form>
          )}
        </div>

        <div className="max-w-md mx-auto mt-6 text-center">
          {step === 1 && (
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <button
                onClick={() => router.push('/login')}
                className="text-primary font-semibold hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
