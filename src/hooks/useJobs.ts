import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { Job } from '../types'

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [myJobs, setMyJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMyJobs = useCallback(async (employerId: string) => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchError } = await supabase
        .from('jobs')
        .select('*, worker:workers(*)')
        .eq('employer_id', employerId)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setMyJobs((data as Job[]) || [])
    } catch (err: any) {
      setError(err.message || 'Failed to fetch jobs')
      console.error('Error fetching my jobs:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createJob = useCallback(
    async (jobData: Partial<Job>): Promise<Job | null> => {
      setLoading(true)
      setError(null)
      try {
        const { data, error: createError } = await supabase
          .from('jobs')
          .insert(jobData)
          .select()
          .single()

        if (createError) throw createError
        setMyJobs((prev) => [(data as Job), ...prev])
        return data as Job
      } catch (err: any) {
        setError(err.message || 'Failed to create job')
        console.error('Error creating job:', err)
        return null
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const cancelJob = useCallback(async (jobId: string) => {
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: 'cancelled' })
        .eq('id', jobId)
        .eq('status', 'pending')

      if (error) throw error
      setMyJobs((prev) =>
        prev.map((j) =>
          j.id === jobId ? { ...j, status: 'cancelled' as const } : j
        )
      )
      return true
    } catch (err: any) {
      setError(err.message || 'Failed to cancel job')
      console.error('Error cancelling job:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchJobById = useCallback(async (jobId: string): Promise<Job | null> => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchError } = await supabase
        .from('jobs')
        .select('*, worker:workers(*)')
        .eq('id', jobId)
        .single()

      if (fetchError) throw fetchError
      return data as Job
    } catch (err: any) {
      setError(err.message || 'Failed to fetch job')
      console.error('Error fetching job:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    jobs,
    myJobs,
    loading,
    error,
    fetchMyJobs,
    createJob,
    cancelJob,
    fetchJobById,
  }
}
