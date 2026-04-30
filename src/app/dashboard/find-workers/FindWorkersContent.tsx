'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, LayoutGrid, List } from 'lucide-react'
import Header from '@/components/layout/Header'
import WorkerCard from '@/components/workers/WorkerCard'
import { useAuth } from '@/components/auth/AuthProvider'
import { getAvailableWorkers, getCategories, saveWorker, isWorkerSaved } from '@/lib/services'
import { CITIES } from '@/types'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import type { Worker, Category } from '@/types'

export default function FindWorkersContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') || ''
  const { employerProfile } = useAuth()

  const [search, setSearch] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [workers, setWorkers] = useState<Worker[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [savedWorkerIds, setSavedWorkerIds] = useState<Set<string>>(new Set())

  const fetchWorkers = useCallback(async () => {
    setLoading(true)
    const data = await getAvailableWorkers({
      category_id: selectedCategoryId || undefined,
      city: selectedCity || undefined,
      search: search || undefined,
      availability: true,
    })
    setWorkers(data)
    setLoading(false)
  }, [selectedCategoryId, selectedCity, search])

  useEffect(() => {
    const fetchCategories = async () => {
      const cats = await getCategories()
      setCategories(cats)
      if (initialCategory) {
        const cat = cats.find((c) => c.name === initialCategory)
        if (cat) setSelectedCategoryId(cat.id)
      }
    }
    fetchCategories()
  }, [initialCategory])

  useEffect(() => {
    fetchWorkers()
  }, [fetchWorkers])

  useEffect(() => {
    if (!employerProfile || workers.length === 0) return
    const checkSaved = async () => {
      const checks = await Promise.all(
        workers.map((w) => isWorkerSaved(employerProfile.id, w.id))
      )
      const saved = new Set<string>()
      checks.forEach((isSaved, i) => {
        if (isSaved) saved.add(workers[i].id)
      })
      setSavedWorkerIds(saved)
    }
    checkSaved()
  }, [employerProfile, workers])

  const handleSave = async (workerId: string) => {
    if (!employerProfile) return
    const { saved } = await saveWorker(employerProfile.id, workerId)
    setSavedWorkerIds((prev) => {
      const next = new Set(prev)
      if (saved) next.add(workerId)
      else next.delete(workerId)
      return next
    })
  }

  return (
    <>
      <Header title="Find Workers" showBack />
      <div className="px-4 py-4 space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search workers, skills, cities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-12 bg-white"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'w-12 h-12 flex items-center justify-center rounded-xl border transition-all active:scale-95 flex-shrink-0',
              showFilters ? 'bg-primary text-white border-primary' : 'bg-white text-gray-500 border-gray-200'
            )}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {showFilters && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-5 animate-fade-in">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2.5">Category</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategoryId('')}
                  className={cn(
                    'px-3.5 py-2 rounded-full text-xs font-medium border transition-all',
                    !selectedCategoryId ? 'bg-primary text-white border-primary shadow-sm shadow-blue-100' : 'border-gray-200 text-gray-600 hover:border-blue-200'
                  )}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={cn(
                      'px-3.5 py-2 rounded-full text-xs font-medium border transition-all',
                      selectedCategoryId === cat.id ? 'bg-primary text-white border-primary shadow-sm shadow-blue-100' : 'border-gray-200 text-gray-600 hover:border-blue-200'
                    )}
                  >
                    {cat.icon || '🔧'} {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2.5">City</label>
              <Select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="h-11 bg-gray-50 appearance-none"
              >
                <option value="">All Cities</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </Select>
            </div>
          </div>
        )}

        {(selectedCategoryId || selectedCity) && (
          <div className="flex items-center gap-2 flex-wrap animate-fade-in">
            {selectedCategoryId && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                {categories.find((c) => c.id === selectedCategoryId)?.name || 'Category'}
                <button onClick={() => setSelectedCategoryId('')} className="hover:text-red-500 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {selectedCity && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                {selectedCity}
                <button onClick={() => setSelectedCity('')} className="hover:text-red-500 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            <span className="font-bold text-gray-900">{workers.length}</span> workers found
          </p>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('list')}
              className={cn('p-2 rounded-md transition-all', viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-gray-400')}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={cn('p-2 rounded-md transition-all', viewMode === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-gray-400')}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 h-32 animate-pulse" />
            ))}
          </div>
        ) : workers.length > 0 ? (
          viewMode === 'list' ? (
            <div className="space-y-3">
              {workers.map((worker) => (
                <WorkerCard key={worker.id} worker={worker} isSaved={savedWorkerIds.has(worker.id)} onSave={handleSave} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {workers.map((worker) => (
                <WorkerCard key={worker.id} worker={worker} isSaved={savedWorkerIds.has(worker.id)} onSave={handleSave} />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-base font-bold text-gray-900">No workers found</h3>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </>
  )
}
