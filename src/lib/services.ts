import { supabase } from './supabase'
import type { EmployerProfile, Category, Job, Bid, Worker, Review, Notification } from '@/types'

// ============ AUTH ============

export async function signUpWithEmail(
  email: string,
  password: string,
  metadata: { full_name: string; phone: string; role: string }
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata },
  })
  return { data, error }
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// ============ EMPLOYER PROFILE ============

export async function getEmployerProfile(userId: string): Promise<EmployerProfile | null> {
  const { data, error } = await supabase
    .from('employers')
    .select('*')
    .eq('id', userId)
    .single()

  if (error || !data) return null

  // Get profile data for full_name, phone, email, avatar_url
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, phone, email, avatar_url')
    .eq('id', userId)
    .single()

  // Get saved workers count
  const { count } = await supabase
    .from('saved_workers')
    .select('*', { count: 'exact', head: true })
    .eq('employer_id', userId)

  return {
    ...data,
    full_name: profile?.full_name || data.id,
    phone: profile?.phone || null,
    email: profile?.email || null,
    avatar_url: profile?.avatar_url || null,
    saved_workers_count: count || 0,
  }
}

export async function createEmployerProfile(
  userId: string,
  profileData: {
    full_name: string
    phone: string
    city: string
    company_name?: string
    business_type?: string
  }
) {
  // Update profile
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      full_name: profileData.full_name,
      phone: profileData.phone,
      role: 'employer',
    })
    .eq('id', userId)

  if (profileError) return { error: profileError }

  // Insert employer
  const { data, error } = await supabase
    .from('employers')
    .insert({
      id: userId,
      city: profileData.city,
      company_name: profileData.company_name || null,
      business_type: profileData.business_type || null,
    })
    .select()
    .single()

  return { data, error }
}

export async function updateEmployerProfile(
  userId: string,
  data: {
    full_name?: string
    phone?: string
    city?: string
    company_name?: string | null
    business_type?: string | null
  }
) {
  const updates: Record<string, unknown> = {}
  if (data.full_name) updates.full_name = data.full_name
  if (data.phone) updates.phone = data.phone

  const { error: profileError } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)

  if (profileError) return { error: profileError }

  const employerUpdates: Record<string, unknown> = {}
  if (data.city) employerUpdates.city = data.city
  if (data.company_name !== undefined) employerUpdates.company_name = data.company_name
  if (data.business_type !== undefined) employerUpdates.business_type = data.business_type

  const { error } = await supabase
    .from('employers')
    .update(employerUpdates)
    .eq('id', userId)

  return { error }
}

// ============ CATEGORIES ============

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (error) return []
  return data || []
}

// ============ JOBS ============

export async function postJob(
  employerId: string,
  jobData: {
    category_id: string
    title: string
    description?: string
    budget_type: string
    budget_min?: number | null
    budget_max?: number | null
    city: string
    area?: string | null
    address?: string | null
    latitude?: number | null
    longitude?: number | null
    urgency?: string
    workers_needed?: number
    duration?: string | null
    skills_required?: string[] | null
    scheduled_date?: string | null
    scheduled_time?: string | null
  }
) {
  const { data, error } = await supabase
    .from('jobs')
    .insert({
      employer_id: employerId,
      ...jobData,
    })
    .select()
    .single()

  return { data, error }
}

export async function getMyJobs(employerId: string): Promise<Job[]> {
  // Get jobs with category info
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*, category:categories(*)')
    .eq('employer_id', employerId)
    .order('created_at', { ascending: false })

  if (error || !jobs) return []

  // Get bid counts for each job
  const jobIds = jobs.map((j) => j.id)
  if (jobIds.length === 0) return jobs as unknown as Job[]

  const { data: bidCounts } = await supabase
    .from('bids')
    .select('job_id')
    .in('job_id', jobIds)

  const bidCountMap: Record<string, number> = {}
  if (bidCounts) {
    for (const b of bidCounts) {
      bidCountMap[b.job_id] = (bidCountMap[b.job_id] || 0) + 1
    }
  }

  // Get accepted bid worker info for each job
  const { data: acceptedBids } = await supabase
    .from('bids')
    .select('job_id, worker_id, worker:workers(id, full_name, rating, experience_years, phone)')
    .eq('status', 'accepted')
    .in('job_id', jobIds)

  const acceptedWorkerMap: Record<string, unknown> = {}
  if (acceptedBids) {
    for (const b of acceptedBids) {
      acceptedWorkerMap[b.job_id] = {
        full_name: (b.worker as unknown as { full_name: string })?.full_name || 'Worker',
        rating: (b.worker as unknown as { rating: number })?.rating || 0,
        experience_years: (b.worker as unknown as { experience_years: number })?.experience_years || 0,
        phone: (b.worker as unknown as { phone: string })?.phone || null,
      }
    }
  }

  return jobs.map((j) => ({
    ...j,
    bids_count: bidCountMap[j.id] || 0,
    worker: acceptedWorkerMap[j.id] as Job['worker'],
  })) as unknown as Job[]
}

export async function getJobById(jobId: string): Promise<Job | null> {
  const { data: job, error } = await supabase
    .from('jobs')
    .select('*, category:categories(*)')
    .eq('id', jobId)
    .single()

  if (error || !job) return null

  // Get bid count
  const { count } = await supabase
    .from('bids')
    .select('*', { count: 'exact', head: true })
    .eq('job_id', jobId)

  // Get accepted bid worker info
  const { data: acceptedBid } = await supabase
    .from('bids')
    .select('worker_id, worker:workers(id, full_name, rating, experience_years, phone)')
    .eq('job_id', jobId)
    .eq('status', 'accepted')
    .single()

  let worker = undefined
  if (acceptedBid && acceptedBid.worker) {
    const w = acceptedBid.worker as unknown as { full_name: string; rating: number; experience_years: number; phone: string }
    worker = {
      full_name: w.full_name || 'Worker',
      rating: w.rating || 0,
      experience_years: w.experience_years || 0,
      phone: w.phone || null,
    }
  }

  return {
    ...job,
    bids_count: count || 0,
    worker,
  } as unknown as Job
}

export async function getJobBids(jobId: string): Promise<Bid[]> {
  const { data, error } = await supabase
    .from('bids')
    .select('*, worker:workers(id, full_name, rating, experience_years, total_jobs, avatar_url, category:categories(*))')
    .eq('job_id', jobId)
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data as unknown as Bid[]
}

export async function acceptBid(bidId: string, jobId: string, amount: number) {
  // Reject all other pending bids
  await supabase
    .from('bids')
    .update({ status: 'rejected' })
    .eq('job_id', jobId)
    .eq('status', 'pending')

  // Accept this bid
  const { data, error } = await supabase
    .from('bids')
    .update({ status: 'accepted' })
    .eq('id', bidId)
    .select()
    .single()

  if (error) return { data: null, error }

  // Get worker_id from the bid
  const { data: bid } = await supabase
    .from('bids')
    .select('worker_id')
    .eq('id', bidId)
    .single()

  // Update job
  const { error: jobError } = await supabase
    .from('jobs')
    .update({
      status: 'in_progress',
      worker_id: bid?.worker_id,
      final_price: amount,
    })
    .eq('id', jobId)

  return { data, error: jobError }
}

// ============ WORKERS ============

export async function getAvailableWorkers(filters?: {
  category_id?: string
  city?: string
  min_rating?: number
  search?: string
  availability?: boolean
}): Promise<Worker[]> {
  let query = supabase
    .from('workers')
    .select('*, category:categories(*), skills:worker_skills(skill)')
    .eq('status', 'active')

  if (filters?.category_id) {
    query = query.eq('category_id', filters.category_id)
  }
  if (filters?.city) {
    query = query.eq('city', filters.city)
  }
  if (filters?.min_rating) {
    query = query.gte('rating', filters.min_rating)
  }
  if (filters?.availability !== undefined) {
    query = query.eq('is_available', filters.availability)
  }
  if (filters?.search) {
    const search = filters.search
    query = query.or(`full_name.ilike.%${search}%,city.ilike.%${search}%,bio.ilike.%${search}%`)
  }

  const { data, error } = await query.order('rating', { ascending: false })

  if (error || !data) return []

  return data.map((w) => ({
    ...w,
    skills: (w.skills as unknown as { skill: string }[])?.map((s) => s.skill) || [],
  })) as unknown as Worker[]
}

export async function getWorkerById(workerId: string): Promise<Worker | null> {
  const { data, error } = await supabase
    .from('workers')
    .select('*, category:categories(*), skills:worker_skills(skill)')
    .eq('id', workerId)
    .single()

  if (error || !data) return null

  // Get profile for avatar_url and phone
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, phone, avatar_url')
    .eq('id', workerId)
    .single()

  return {
    ...data,
    full_name: data.full_name || profile?.full_name || 'Worker',
    avatar_url: profile?.avatar_url || null,
    phone: profile?.phone || null,
    skills: (data.skills as unknown as { skill: string }[])?.map((s) => s.skill) || [],
  } as unknown as Worker
}

export async function saveWorker(employerId: string, workerId: string) {
  // Check if already saved
  const { data: existing } = await supabase
    .from('saved_workers')
    .select('worker_id')
    .eq('employer_id', employerId)
    .eq('worker_id', workerId)
    .single()

  if (existing) {
    // Unsave
    const { error } = await supabase
      .from('saved_workers')
      .delete()
      .eq('employer_id', employerId)
      .eq('worker_id', workerId)
    return { saved: false, error }
  } else {
    // Save
    const { error } = await supabase
      .from('saved_workers')
      .insert({ employer_id: employerId, worker_id: workerId })
    return { saved: true, error }
  }
}

export async function getSavedWorkers(employerId: string): Promise<Worker[]> {
  const { data, error } = await supabase
    .from('saved_workers')
    .select('worker_id, created_at, worker:workers(*, category:categories(*), skills:worker_skills(skill))')
    .eq('employer_id', employerId)
    .order('created_at', { ascending: false })

  if (error || !data) return []

  return data.map((d) => {
    const w = d.worker as unknown as Worker
    return {
      ...w,
      skills: (w.skills as unknown as { skill: string }[])?.map((s) => s.skill) || [],
    }
  }) as unknown as Worker[]
}

export async function isWorkerSaved(employerId: string, workerId: string): Promise<boolean> {
  const { data } = await supabase
    .from('saved_workers')
    .select('worker_id')
    .eq('employer_id', employerId)
    .eq('worker_id', workerId)
    .single()
  return !!data
}

// ============ REVIEWS ============

export async function getReviews(workerId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, employer:employers!employer_id(id, full_name, company_name)')
    .eq('worker_id', workerId)
    .order('created_at', { ascending: false })

  if (error || !data) return []

  return data.map((r) => ({
    ...r,
    employer_name: (r.employer as unknown as { full_name: string })?.full_name || 'Anonymous',
  })) as unknown as Review[]
}

export async function createReview(
  employerId: string,
  jobId: string,
  workerId: string,
  rating: number,
  comment: string,
  isAnonymous: boolean = false
) {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      employer_id: employerId,
      job_id: jobId,
      worker_id: workerId,
      rating,
      comment,
      is_anonymous: isAnonymous,
    })
    .select()
    .single()

  return { data, error }
}

export async function hasReviewForJob(employerId: string, jobId: string): Promise<boolean> {
  const { data } = await supabase
    .from('reviews')
    .select('id')
    .eq('employer_id', employerId)
    .eq('job_id', jobId)
    .single()
  return !!data
}

// ============ NOTIFICATIONS ============

export async function getNotifications(userId: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error || !data) return []
  return data as unknown as Notification[]
}

export async function markNotificationRead(id: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)
  return { error }
}

export async function markAllRead(userId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .is('is_read', false)
  return { error }
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false)

  if (error) return 0
  return count || 0
}
