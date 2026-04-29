import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { Employer } from '../types'

interface AuthContextType {
  session: Session | null
  employer: Employer | null
  loading: boolean
  signIn: (phone: string) => Promise<void>
  signUp: (phone: string) => Promise<void>
  verifyOTP: (phone: string, otp: string) => Promise<void>
  signOut: () => Promise<void>
  setEmployer: (employer: Employer | null) => void
  refreshEmployer: () => Promise<void>
  demoMode: boolean
  setDemoMode: (mode: boolean) => void
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  employer: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  verifyOTP: async () => {},
  signOut: async () => {},
  setEmployer: () => {},
  refreshEmployer: async () => {},
  demoMode: false,
  setDemoMode: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [employer, setEmployerState] = useState<Employer | null>(null)
  const [loading, setLoading] = useState(true)
  const [demoMode, setDemoMode] = useState(false)

  const fetchEmployer = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('employers')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching employer:', error)
        return
      }
      setEmployerState(data as Employer)
    } catch (err) {
      console.error('Error fetching employer:', err)
    }
  }

  const refreshEmployer = async () => {
    if (session?.user) {
      await fetchEmployer(session.user.id)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession)
      if (currentSession?.user) {
        fetchEmployer(currentSession.user.id)
      }
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession)
      if (newSession?.user) {
        await fetchEmployer(newSession.user.id)
      } else {
        setEmployerState(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const setEmployer = (e: Employer | null) => {
    setEmployerState(e)
  }

  const signIn = async (phone: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      phone: phone.startsWith('+') ? phone : `+${phone}`,
    })
    if (error) throw error
  }

  const signUp = async (phone: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      phone: phone.startsWith('+') ? phone : `+${phone}`,
    })
    if (error) throw error
  }

  const verifyOTP = async (phone: string, otp: string) => {
    const { error } = await supabase.auth.verifyOtp({
      phone: phone.startsWith('+') ? phone : `+${phone}`,
      token: otp,
      type: 'sms',
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setSession(null)
    setEmployerState(null)
    setDemoMode(false)
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        employer,
        loading,
        signIn,
        signUp,
        verifyOTP,
        signOut,
        setEmployer,
        refreshEmployer,
        demoMode,
        setDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
export default AuthContext
