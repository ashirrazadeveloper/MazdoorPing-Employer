'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Bell, ChevronLeft } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { getInitials } from '@/lib/utils'

interface HeaderProps {
  title?: string
  showBack?: boolean
  showNotifications?: boolean
}

export default function Header({ title, showBack, showNotifications = true }: HeaderProps) {
  const router = useRouter()
  const { employerProfile } = useAuth()
  const userName = employerProfile?.full_name || 'Employer'

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-xl z-40 border-b border-gray-100/80">
      <div className="flex items-center justify-between px-4 py-3.5 max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors active:scale-95"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
          )}
          {title ? (
            <h1 className="text-lg font-bold text-gray-900">{title}</h1>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center text-sm font-bold shadow-sm shadow-blue-600/20">
                {getInitials(userName)}
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-medium">Welcome back</p>
                <p className="text-sm font-bold text-gray-900">{userName}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {showNotifications && (
            <button
              onClick={() => router.push('/dashboard/notifications')}
              className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors active:scale-95"
            >
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
