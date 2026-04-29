import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { Worker } from '../types'

export function useWorkers() {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAvailableWorkers = useCallback(
    async (category?: string, city?: string, search?: string) => {
      setLoading(true)
      setError(null)
      try {
        let query = supabase
          .from('workers')
          .select('*')
          .eq('available', true)
          .order('rating', { ascending: false })
          .limit(50)

        if (category && category !== 'All') {
          query = query.eq('category', category)
        }
        if (city && city !== 'All') {
          query = query.eq('city', city)
        }
        if (search && search.trim()) {
          query = query.or(
            `name.ilike.%${search}%,category.ilike.%${search}%,city.ilike.%${search}%,area.ilike.%${search}%`
          )
        }

        const { data, error: fetchError } = await query
        if (fetchError) throw fetchError
        setWorkers((data as Worker[]) || [])
      } catch (err: any) {
        setError(err.message || 'Failed to fetch workers')
        console.error('Error fetching workers:', err)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const fetchWorkerById = useCallback(
    async (workerId: string): Promise<Worker | null> => {
      setLoading(true)
      setError(null)
      try {
        const { data, error: fetchError } = await supabase
          .from('workers')
          .select('*')
          .eq('id', workerId)
          .single()

        if (fetchError) throw fetchError
        return data as Worker
      } catch (err: any) {
        setError(err.message || 'Failed to fetch worker')
        console.error('Error fetching worker:', err)
        return null
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const toggleFavorite = useCallback(
    async (workerId: string, employerId: string, isFavorite: boolean) => {
      setLoading(true)
      setError(null)
      try {
        if (isFavorite) {
          const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('worker_id', workerId)
            .eq('employer_id', employerId)
          if (error) throw error
        } else {
          const { error } = await supabase
            .from('favorites')
            .insert({ worker_id: workerId, employer_id: employerId })
          if (error) throw error
        }
        return !isFavorite
      } catch (err: any) {
        setError(err.message || 'Failed to update favorite')
        console.error('Error updating favorite:', err)
        return isFavorite
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const fetchFavorites = useCallback(async (employerId: string) => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchError } = await supabase
        .from('favorites')
        .select('*, worker:workers(*)')
        .eq('employer_id', employerId)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setWorkers((data as any[])?.map((f: any) => f.worker).filter(Boolean) || [])
      return data as any[]
    } catch (err: any) {
      setError(err.message || 'Failed to fetch favorites')
      console.error('Error fetching favorites:', err)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    workers,
    loading,
    error,
    fetchAvailableWorkers,
    fetchWorkerById,
    toggleFavorite,
    fetchFavorites,
  }
}
