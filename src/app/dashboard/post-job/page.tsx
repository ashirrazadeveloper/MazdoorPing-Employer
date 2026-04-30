'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowLeft, ArrowRight, Check, MapPin, Calendar, Clock, DollarSign,
  FileText, Users, Tag,
} from 'lucide-react'
import Header from '@/components/layout/Header'
import { useAuth } from '@/components/auth/AuthProvider'
import { getCategories, postJob } from '@/lib/services'
import { cn, formatPKR } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent } from '@/components/ui/dialog'
import type { Category, BudgetType, UrgencyLevel } from '@/types'
import { CITIES } from '@/types'

const steps = [
  { label: 'Category', icon: Tag },
  { label: 'Details', icon: FileText },
  { label: 'Location', icon: MapPin },
  { label: 'Schedule', icon: Calendar },
  { label: 'Requirements', icon: Users },
]

export default function PostJobPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { employerProfile } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const initialCategory = searchParams.get('category') || ''

  const [form, setForm] = useState({
    categoryId: '',
    title: '',
    description: '',
    budgetType: 'fixed' as BudgetType,
    budgetAmount: '',
    city: '',
    area: '',
    address: '',
    date: '',
    time: '',
    urgency: 'normal' as UrgencyLevel,
    skillsRequired: [] as string[],
    workersNeeded: '1',
    duration: '',
  })

  const [skillInput, setSkillInput] = useState('')

  useEffect(() => {
    const fetchCategories = async () => {
      const cats = await getCategories()
      setCategories(cats)
      if (initialCategory) {
        const cat = cats.find((c) => c.name === initialCategory)
        if (cat) setForm((prev) => ({ ...prev, categoryId: cat.id }))
      }
    }
    fetchCategories()
  }, [initialCategory])

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const addSkill = () => {
    if (skillInput.trim() && !form.skillsRequired.includes(skillInput.trim())) {
      setForm((prev) => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, skillInput.trim()],
      }))
      setSkillInput('')
    }
  }

  const removeSkill = (skill: string) => {
    setForm((prev) => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter((s) => s !== skill),
    }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0: return !!form.categoryId
      case 1: return !!form.title && !!form.description && !!form.budgetAmount
      case 2: return !!form.city
      case 3: return !!form.date
      case 4: return true
      default: return false
    }
  }

  const handlePost = async () => {
    if (!employerProfile) return
    setLoading(true)
    const { error } = await postJob(employerProfile.id, {
      category_id: form.categoryId,
      title: form.title,
      description: form.description,
      budget_type: form.budgetType,
      budget_min: form.budgetType === 'negotiable' ? null : Number(form.budgetAmount),
      budget_max: form.budgetType === 'negotiable' ? null : Number(form.budgetAmount),
      city: form.city,
      area: form.area || null,
      address: form.address || null,
      urgency: form.urgency,
      workers_needed: Number(form.workersNeeded),
      duration: form.duration || null,
      skills_required: form.skillsRequired.length > 0 ? form.skillsRequired : null,
      scheduled_date: form.date || null,
      scheduled_time: form.time || null,
    })

    setLoading(false)
    if (error) return
    setShowSuccess(true)
  }

  const selectedCategory = categories.find((c) => c.id === form.categoryId)

  const budgetTypes: { value: BudgetType; label: string }[] = [
    { value: 'hourly', label: 'Hourly' },
    { value: 'daily', label: 'Daily' },
    { value: 'fixed', label: 'Fixed' },
    { value: 'negotiable', label: 'Negotiable' },
  ]

  const urgencies: { value: UrgencyLevel; label: string; color: string; activeColor: string }[] = [
    { value: 'normal', label: 'Normal', color: 'border-gray-100 text-gray-500', activeColor: 'bg-green-50 text-green-700 border-green-200' },
    { value: 'urgent', label: 'Urgent', color: 'border-gray-100 text-gray-500', activeColor: 'bg-orange-50 text-orange-700 border-orange-200' },
    { value: 'emergency', label: 'Emergency', color: 'border-gray-100 text-gray-500', activeColor: 'bg-red-50 text-red-700 border-red-200' },
  ]

  return (
    <>
      <Header title="Post a Job" showBack />
      <div className="px-4 py-4 space-y-5">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex gap-1.5 mb-3">
            {steps.map((step, idx) => (
              <div
                key={step.label}
                className={cn(
                  'h-2 flex-1 rounded-full transition-all duration-300',
                  idx < currentStep ? 'bg-primary' : idx === currentStep ? 'bg-primary w-full' : 'bg-gray-100'
                )}
              />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">Step {currentStep + 1} of {steps.length}</p>
            <p className="text-xs font-bold text-primary">{steps[currentStep].label}</p>
          </div>
        </div>

        {currentStep === 0 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-bold text-gray-900">Select Category</h2>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => updateForm('categoryId', cat.id)}
                  className={cn(
                    'flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left active:scale-[0.98]',
                    form.categoryId === cat.id
                      ? 'border-primary bg-blue-50 shadow-sm shadow-blue-100'
                      : 'border-gray-100 bg-white hover:border-blue-200'
                  )}
                >
                  <span className="text-2xl">{cat.icon || '🔧'}</span>
                  <span className="text-sm font-medium">{cat.name}</span>
                  {form.categoryId === cat.id && <Check className="w-4 h-4 text-primary ml-auto" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-bold text-gray-900">Job Details</h2>
            <div className="space-y-2">
              <Label>Job Title *</Label>
              <Input
                placeholder="e.g., Bathroom Pipe Repair"
                value={form.title}
                onChange={(e) => updateForm('title', e.target.value)}
                className="h-12 bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                rows={4}
                placeholder="Describe the job in detail..."
                value={form.description}
                onChange={(e) => updateForm('description', e.target.value)}
                className="bg-white resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label>Budget Type</Label>
              <div className="grid grid-cols-2 gap-2">
                {budgetTypes.map((bt) => (
                  <button
                    key={bt.value}
                    onClick={() => updateForm('budgetType', bt.value)}
                    className={cn(
                      'px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all active:scale-[0.98]',
                      form.budgetType === bt.value
                        ? 'border-primary bg-blue-50 text-primary'
                        : 'border-gray-100 text-gray-600 hover:border-blue-200'
                    )}
                  >
                    {bt.label}
                  </button>
                ))}
              </div>
            </div>
            {form.budgetType !== 'negotiable' && (
              <div className="space-y-2">
                <Label>Budget Amount (PKR) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={form.budgetAmount}
                    onChange={(e) => updateForm('budgetAmount', e.target.value)}
                    className="pl-11 h-12 bg-white"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-bold text-gray-900">Location</h2>
            <div className="space-y-2">
              <Label>City *</Label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Select
                  value={form.city}
                  onChange={(e) => updateForm('city', e.target.value)}
                  className="pl-11 h-12 bg-white appearance-none"
                >
                  <option value="">Select city</option>
                  {CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Area</Label>
              <Input
                placeholder="e.g., Gulberg, DHA"
                value={form.area}
                onChange={(e) => updateForm('area', e.target.value)}
                className="h-12 bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Full Address</Label>
              <Textarea
                rows={2}
                placeholder="Complete address for the job location"
                value={form.address}
                onChange={(e) => updateForm('address', e.target.value)}
                className="bg-white resize-none"
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-bold text-gray-900">Schedule</h2>
            <div className="space-y-2">
              <Label>Date *</Label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => updateForm('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="pl-11 h-12 bg-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="time"
                  value={form.time}
                  onChange={(e) => updateForm('time', e.target.value)}
                  className="pl-11 h-12 bg-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Urgency</Label>
              <div className="grid grid-cols-3 gap-2">
                {urgencies.map((u) => (
                  <button
                    key={u.value}
                    onClick={() => updateForm('urgency', u.value)}
                    className={cn(
                      'px-3 py-3 rounded-xl text-xs font-semibold border-2 transition-all active:scale-[0.98]',
                      form.urgency === u.value ? u.activeColor : u.color
                    )}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-bold text-gray-900">Requirements</h2>
            <div className="space-y-2">
              <Label>Workers Needed</Label>
              <div className="relative">
                <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="number"
                  min="1"
                  value={form.workersNeeded}
                  onChange={(e) => updateForm('workersNeeded', e.target.value)}
                  className="pl-11 h-12 bg-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Estimated Duration</Label>
              <Input
                placeholder="e.g., 4 hours, 2 days, 1 week"
                value={form.duration}
                onChange={(e) => updateForm('duration', e.target.value)}
                className="h-12 bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Skills Required</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }}
                  className="flex-1 h-12 bg-white"
                />
                <Button onClick={addSkill} size="lg" className="rounded-xl">
                  Add
                </Button>
              </div>
              {form.skillsRequired.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {form.skillsRequired.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                    >
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Preview */}
            <div className="bg-gray-50 rounded-2xl p-5 space-y-3 mt-2 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Job Preview</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium">{selectedCategory?.icon || '🔧'} {selectedCategory?.name || ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Title</span>
                  <span className="font-medium text-right max-w-[60%]">{form.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Budget</span>
                  <span className="font-medium text-primary">
                    {form.budgetType === 'negotiable' ? 'Negotiable' : `${formatPKR(Number(form.budgetAmount))} (${form.budgetType})`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Location</span>
                  <span className="font-medium">{form.city}{form.area ? `, ${form.area}` : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium">{form.date || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Workers</span>
                  <span className="font-medium">{form.workersNeeded}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Urgency</span>
                  <span className="font-medium capitalize">{form.urgency}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-2 pb-4">
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="flex-1 h-12 rounded-xl font-semibold text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          )}
          {currentStep < steps.length - 1 ? (
            <Button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              disabled={!canProceed()}
              className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/25"
            >
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handlePost}
              disabled={loading || !canProceed()}
              className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/25"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" /> Post Job
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <DialogTitle className="text-center text-xl">Job Posted Successfully!</DialogTitle>
          <DialogDescription className="text-center mt-2">
            Your job has been posted and workers will start bidding soon.
          </DialogDescription>
        </DialogHeader>
        <DialogContent>
          <div className="space-y-3">
            <Button
              onClick={() => { setShowSuccess(false); router.push('/dashboard/my-bookings') }}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold"
            >
              View My Bookings
            </Button>
            <Button
              variant="outline"
              onClick={() => { setShowSuccess(false); router.push('/dashboard') }}
              className="w-full h-12 rounded-xl font-semibold"
            >
              Back to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
