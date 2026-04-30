'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Phone, MapPin, Building2, Edit3, Star, Briefcase, DollarSign,
  Heart, ChevronRight, LogOut, Shield, Check, Loader2,
} from 'lucide-react'
import Header from '@/components/layout/Header'
import { useAuth } from '@/components/auth/AuthProvider'
import { signOut, updateEmployerProfile, getMyJobs } from '@/lib/services'
import { formatPKR, getInitials } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogHeader, DialogTitle, DialogContent } from '@/components/ui/dialog'
import type { Job } from '@/types'

export default function ProfilePage() {
  const router = useRouter()
  const { employerProfile, session } = useAuth()
  const [editing, setEditing] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])
  const [saving, setSaving] = useState(false)

  const [editForm, setEditForm] = useState({
    name: employerProfile?.full_name || '',
    phone: employerProfile?.phone || '',
    city: employerProfile?.city || '',
    companyName: employerProfile?.company_name || '',
  })

  useState(() => {
    const fetchJobs = async () => {
      if (employerProfile) {
        const data = await getMyJobs(employerProfile.id)
        setJobs(data)
      }
    }
    fetchJobs()
  })

  const completedJobs = jobs.filter((j) => j.status === 'completed').length
  const activeJobs = jobs.filter((j) => j.status === 'open' || j.status === 'in_progress').length

  const menuItems = [
    { icon: Briefcase, label: 'My Bookings', value: `${jobs.length} jobs`, href: '/dashboard/my-bookings' },
    { icon: Heart, label: 'Saved Workers', value: `${employerProfile?.saved_workers_count || 0} workers`, href: '/dashboard/favorites' },
    { icon: Star, label: 'Rating', value: `${(employerProfile?.rating || 0).toFixed(1)} avg`, href: '#' },
    { icon: DollarSign, label: 'Spending Summary', value: formatPKR(employerProfile?.total_spent || 0), href: '#' },
    { icon: Shield, label: 'Privacy & Settings', value: '', href: '#' },
  ]

  const handleSaveProfile = async () => {
    if (!employerProfile) return
    setSaving(true)
    await updateEmployerProfile(employerProfile.id, {
      full_name: editForm.name,
      phone: editForm.phone,
      city: editForm.city,
      company_name: editForm.companyName,
    })
    setSaving(false)
    setEditing(false)
  }

  const handleLogout = async () => {
    await signOut()
    router.push('/login')
  }

  if (!employerProfile) {
    return (
      <>
        <Header title="Profile" showBack />
        <div className="px-4 py-12 text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </>
    )
  }

  return (
    <>
      <Header title="Profile" showBack />
      <div className="px-4 py-4 space-y-4">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center text-lg font-bold flex-shrink-0 shadow-lg shadow-blue-600/20">
              {getInitials(employerProfile.full_name)}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-900">{employerProfile.full_name}</h2>
              {employerProfile.company_name && (
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3.5 h-3.5" /> {employerProfile.company_name}
                </p>
              )}
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {employerProfile.city}
                </span>
                {employerProfile.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {employerProfile.phone}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">{session?.user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-5">
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <p className="text-base font-bold text-gray-900">{jobs.length}</p>
              <p className="text-[10px] text-gray-500 mt-0.5 font-medium">Total</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <p className="text-base font-bold text-primary">{activeJobs}</p>
              <p className="text-[10px] text-gray-500 mt-0.5 font-medium">Active</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <p className="text-base font-bold text-green-600">{completedJobs}</p>
              <p className="text-[10px] text-gray-500 mt-0.5 font-medium">Done</p>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-xl">
              <p className="text-base font-bold text-amber-600">{(employerProfile.rating || 0).toFixed(1)}</p>
              <p className="text-[10px] text-gray-500 mt-0.5 font-medium">Rating</p>
            </div>
          </div>
        </div>

        {/* Edit Profile */}
        {editing ? (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4 animate-fade-in">
            <h3 className="text-sm font-bold text-gray-900">Edit Profile</h3>
            <div className="space-y-2">
              <Label className="text-xs">Full Name</Label>
              <Input value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Phone</Label>
              <Input value={editForm.phone} onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">City</Label>
              <Input value={editForm.city} onChange={(e) => setEditForm((p) => ({ ...p, city: e.target.value }))} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Company Name</Label>
              <Input value={editForm.companyName} onChange={(e) => setEditForm((p) => ({ ...p, companyName: e.target.value }))} className="h-11" />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-lg shadow-blue-600/25"
              >
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setEditing(false)} className="h-11">Cancel</Button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              setEditForm({
                name: employerProfile.full_name,
                phone: employerProfile.phone || '',
                city: employerProfile.city,
                companyName: employerProfile.company_name || '',
              })
              setEditing(true)
            }}
            className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between hover:border-blue-200 transition-all active:scale-[0.99] animate-fade-in animate-delay-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Edit3 className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-semibold text-gray-900">Edit Profile</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        )}

        {/* Menu Items */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50 animate-fade-in animate-delay-200">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                onClick={() => { if (item.href !== '#') router.push(item.href) }}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.value && <span className="text-xs text-gray-400 font-medium">{item.value}</span>}
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </button>
            )
          })}
        </div>

        {/* Logout */}
        <button
          onClick={() => setShowLogoutDialog(true)}
          className="w-full bg-white rounded-2xl p-4 shadow-sm border border-red-100 flex items-center justify-center gap-2 hover:bg-red-50 transition-colors text-red-600 active:scale-[0.99] animate-fade-in animate-delay-300"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-semibold">Log Out</span>
        </button>

        <p className="text-center text-xs text-gray-400 pb-4 pt-2">MazdoorPing Employer App v1.0.0</p>
      </div>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogHeader className="text-center">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <LogOut className="w-7 h-7 text-red-600" />
          </div>
          <DialogTitle className="text-center text-lg">Log Out?</DialogTitle>
          <p className="text-sm text-gray-500 text-center mt-2">
            Are you sure you want to log out of your account?
          </p>
        </DialogHeader>
        <DialogContent>
          <div className="space-y-3">
            <Button
              onClick={handleLogout}
              className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-lg shadow-red-500/25"
            >
              Log Out
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
              className="w-full h-12 rounded-xl font-semibold"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
