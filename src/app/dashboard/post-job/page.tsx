'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Users,
  Tag,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import {
  WORKER_CATEGORIES,
  CATEGORY_ICONS,
  CITIES,
  type WorkerCategory,
  type BudgetType,
  type UrgencyLevel,
} from '@/types';
import { cn, formatPKR } from '@/lib/utils';

const steps = [
  { label: 'Category', icon: Tag },
  { label: 'Details', icon: FileText },
  { label: 'Location', icon: MapPin },
  { label: 'Schedule', icon: Calendar },
  { label: 'Requirements', icon: Users },
];

export default function PostJobPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    category: '' as WorkerCategory | '',
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
  });

  const [skillInput, setSkillInput] = useState('');

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !form.skillsRequired.includes(skillInput.trim())) {
      setForm((prev) => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setForm((prev) => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter((s) => s !== skill),
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return !!form.category;
      case 1: return !!form.title && !!form.description && !!form.budgetAmount;
      case 2: return !!form.city;
      case 3: return !!form.date;
      case 4: return true;
      default: return false;
    }
  };

  const handlePost = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard/my-bookings');
    }, 1500);
  };

  const budgetTypes: { value: BudgetType; label: string }[] = [
    { value: 'hourly', label: 'Hourly' },
    { value: 'daily', label: 'Daily' },
    { value: 'fixed', label: 'Fixed' },
    { value: 'negotiable', label: 'Negotiable' },
  ];

  const urgencies: { value: UrgencyLevel; label: string; color: string }[] = [
    { value: 'normal', label: 'Normal', color: 'bg-green-50 text-green-700 border-green-200' },
    { value: 'urgent', label: 'Urgent', color: 'bg-orange-50 text-orange-700 border-orange-200' },
    { value: 'very_urgent', label: 'Very Urgent', color: 'bg-red-50 text-red-700 border-red-200' },
  ];

  return (
    <>
      <Header title="Post a Job" showBack />
      <div className="px-4 py-4 space-y-4">
        {/* Step Progress */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-1 flex-1">
            {steps.map((step, idx) => (
              <div
                key={step.label}
                className={cn(
                  'h-1.5 flex-1 rounded-full transition-colors',
                  idx < currentStep ? 'bg-primary' : idx === currentStep ? 'bg-primary' : 'bg-gray-200'
                )}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">Step {currentStep + 1} of {steps.length}</p>
          <p className="text-xs font-semibold text-primary">{steps[currentStep].label}</p>
        </div>

        {/* Step 0: Category Selection */}
        {currentStep === 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Select Category</h2>
            <div className="grid grid-cols-2 gap-3">
              {WORKER_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => updateForm('category', cat)}
                  className={cn(
                    'flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left',
                    form.category === cat
                      ? 'border-primary bg-primary-light'
                      : 'border-gray-100 bg-white hover:border-primary/30'
                  )}
                >
                  <span className="text-2xl">{CATEGORY_ICONS[cat]}</span>
                  <span className="text-sm font-medium">{cat}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Job Details */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Job Details</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Title *</label>
              <input
                type="text"
                placeholder="e.g., Bathroom Pipe Repair"
                value={form.title}
                onChange={(e) => updateForm('title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
              <textarea
                rows={4}
                placeholder="Describe the job in detail..."
                value={form.description}
                onChange={(e) => updateForm('description', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-primary resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Budget Type</label>
              <div className="grid grid-cols-2 gap-2">
                {budgetTypes.map((bt) => (
                  <button
                    key={bt.value}
                    onClick={() => updateForm('budgetType', bt.value)}
                    className={cn(
                      'px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all',
                      form.budgetType === bt.value
                        ? 'border-primary bg-primary-light text-primary'
                        : 'border-gray-100 text-gray-600 hover:border-primary/30'
                    )}
                  >
                    {bt.label}
                  </button>
                ))}
              </div>
            </div>

            {form.budgetType !== 'negotiable' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Budget Amount (PKR) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={form.budgetAmount}
                    onChange={(e) => updateForm('budgetAmount', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-primary"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Location */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Location</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">City *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={form.city}
                  onChange={(e) => updateForm('city', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-primary appearance-none bg-white"
                >
                  <option value="">Select city</option>
                  {CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Area</label>
              <input
                type="text"
                placeholder="e.g., Gulberg, DHA"
                value={form.area}
                onChange={(e) => updateForm('area', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Address</label>
              <textarea
                rows={2}
                placeholder="Complete address for the job location"
                value={form.address}
                onChange={(e) => updateForm('address', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-primary resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 3: Schedule */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Schedule</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Date *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => updateForm('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => updateForm('time', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Urgency</label>
              <div className="grid grid-cols-3 gap-2">
                {urgencies.map((u) => (
                  <button
                    key={u.value}
                    onClick={() => updateForm('urgency', u.value)}
                    className={cn(
                      'px-3 py-2.5 rounded-xl text-xs font-semibold border-2 transition-all',
                      form.urgency === u.value ? u.color : 'border-gray-100 text-gray-500'
                    )}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Requirements */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Requirements</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Workers Needed
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  min="1"
                  value={form.workersNeeded}
                  onChange={(e) => updateForm('workersNeeded', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Estimated Duration
              </label>
              <input
                type="text"
                placeholder="e.g., 4 hours, 2 days, 1 week"
                value={form.duration}
                onChange={(e) => updateForm('duration', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Skills Required
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a skill"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-primary"
                />
                <button
                  onClick={addSkill}
                  className="px-4 py-3 bg-primary text-white rounded-xl text-sm font-medium"
                >
                  Add
                </button>
              </div>
              {form.skillsRequired.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {form.skillsRequired.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-light text-primary rounded-full text-xs font-medium"
                    >
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="hover:text-red-500">
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
            <div className="bg-gray-50 rounded-2xl p-4 space-y-3 mt-6">
              <h3 className="text-sm font-bold text-gray-900">Job Preview</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium">{CATEGORY_ICONS[form.category as WorkerCategory]} {form.category}</span>
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
                  <span className="font-medium capitalize">{form.urgency.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-2">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          )}
          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              disabled={!canProceed()}
              className="flex-1 bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-40"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handlePost}
              disabled={loading || !canProceed()}
              className="flex-1 bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" /> Post Job
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
