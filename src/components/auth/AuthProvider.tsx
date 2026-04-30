'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getEmployerProfile } from '@/lib/services'
import type { User, Session } from '@supabase/supabase-js'
import type { EmployerProfile as AppEmployerProfile } from '@/types'

interface AuthContextType {
  user: User | null
  session: Session | null
  employerProfile: AppEmployerProfile | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  employerProfile: null,
  loading: true,
})

export const useAuth = () => useContext(AuthContext)

const publicPaths = ['/login', '/register']

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [employerProfile, setEmployerProfile] = useState<AppEmployerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession()

      if (initialSession?.user) {
        setUser(initialSession.user)
        setSession(initialSession)
        const profile = await getEmployerProfile(initialSession.user.id)
        if (profile) {
          setEmployerProfile(profile)
        }
      }
      setLoading(false)
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession)
        setUser(newSession?.user ?? null)
        if (newSession?.user) {
          const profile = await getEmployerProfile(newSession.user.id)
          setEmployerProfile(profile)
        } else {
          setEmployerProfile(null)
        }
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (loading) return
    const isPublic = publicPaths.some((p) => pathname?.startsWith(p))
    if (!session && !isPublic) {
      router.replace('/login')
    }
  }, [session, loading, pathname, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, session, employerProfile, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
