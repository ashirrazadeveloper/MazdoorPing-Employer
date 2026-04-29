export interface Employer {
  id: string
  name: string
  phone: string
  email?: string
  type: 'individual' | 'contractor' | 'company'
  city: string
  area?: string
  verified: boolean
  created_at: string
}

export interface Worker {
  id: string
  name: string
  phone: string
  email?: string
  cnic?: string
  photo?: string
  category: string
  experience: number
  rate: number
  rate_type: 'hourly' | 'daily' | 'weekly' | 'monthly'
  rating: number
  total_jobs: number
  available: boolean
  city: string
  area?: string
  language: string
  verified: boolean
  premium: boolean
  balance: number
  total_earned: number
  lat?: number
  lng?: number
  bio?: string
  created_at: string
}

export interface Job {
  id: string
  title: string
  category: string
  description?: string
  rate: number
  rate_type: string
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'disputed'
  city: string
  area?: string
  address?: string
  urgent: boolean
  payment_method: string
  payment_status: string
  worker_id?: string
  employer_id: string
  employer?: { id: string; name: string; phone: string; city: string }
  worker?: Worker
  created_at: string
  completed_at?: string
}

export interface Review {
  id: string
  rating: number
  comment?: string
  job_id: string
  worker_id: string
  employer_id: string
  employer?: { name: string }
  created_at: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  created_at: string
}

export interface Favorite {
  id: string
  employer_id: string
  worker_id: string
  worker?: Worker
  created_at: string
}

export interface Category {
  id: string
  name: string
  nameUrdu: string
  icon: string
  demand: number
}
