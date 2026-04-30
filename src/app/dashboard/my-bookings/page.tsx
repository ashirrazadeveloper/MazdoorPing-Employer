'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Briefcase, Clock, MapPin, Users } from 'lucide-react'
import Header from '@/components/layout/Header'
import { useAuth } from '@/components/auth/AuthProvider'
import { getMyJobs } from '@/lib/services'
import { formatPKR, formatDate, cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import type { Job, JobStatus } from '@/types'

const tabs: { value: JobStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Active' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const statusColors: Record<string, string> = {
  open: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-gray-50 text-gray-600 border-gray-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
  disputed: 'bg-red-50 text-red-600 border-red-200',
}

const statusLabels: Record<string, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  disputed: 'Disputed',
}

export default function MyBookingsPage() {
  const { employerProfile } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>('all')

  useEffect(() => {
    const fetchJobs = async () => {
      if (!employerProfile) return
      const data = await getMyJobs(employerProfile.id)
      setJobs(data)
      setLoading(false)
    }
    fetchJobs()
  }, [employerProfile])

  const filteredJobs = activeTab === 'all' ? jobs : jobs.filter((j) => j.status === activeTab)

  if (loading) {
    return (
      <>
        <Header title="My Bookings" showBack />
        <div className="px-4 py-4 space-y-4">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-16 h-10 rounded-full bg-gray-200 animate-pulse" />
            ))}
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-4 h-36 animate-pulse" />
          ))}
        </div>
      </>
    )
  }

  return (
    <>
      <Header title="My Bookings" showBack />
      <div className="px-4 py-4 space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 active:scale-95',
                activeTab === tab.value
                  ? 'bg-primary text-white shadow-sm shadow-blue-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-200'
              )}
            >
              {tab.label}
              <span className="ml-1.5 opacity-80">
                {tab.value === 'all'
                  ? jobs.length
                  : jobs.filter((j) => j.status === tab.value).length}
              </span>
            </button>
          ))}
        </div>

        {filteredJobs.length > 0 ? (
          <div className="space-y-3">
            {filteredJobs.map((job) => (
              <Link
                key={job.id}
                href={`/dashboard/bookings/${job.id}`}
                className="block bg-white rounded-2xl p-4 shadow-sm border border-gray-100/80 hover:border-blue-200 hover:shadow-md transition-all active:scale-[0.99]"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{job.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{job.category?.name || ''} &bull; {job.city}</p>
                  </div>
                  <Badge className={cn('text-[10px] ml-2 flex-shrink-0', statusColors[job.status])} variant="secondary">
                    {statusLabels[job.status] || job.status}
                  </Badge>
                </div>

                <p className="text-xs text-gray-600 line-clamp-2 mb-3">{job.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-primary">{formatPKR(job.budget_min || 0)}</span>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    {job.area && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {job.area}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> {job.bids_count || 0} bids
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {job.scheduled_date ? formatDate(job.scheduled_date) : formatDate(job.created_at)}
                  </span>
                  {job.workers_needed > 1 && (
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> {job.workers_needed} workers
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-base font-bold text-gray-900">No jobs found</h3>
            <p className="text-sm text-gray-500 mt-1">
              {activeTab === 'all'
                ? "You haven't posted any jobs yet"
                : `No ${statusLabels[activeTab]?.toLowerCase()} jobs`}
            </p>
            <Link
              href="/dashboard/post-job"
              className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/25"
            >
              <Briefcase className="w-4 h-4" /> Post a Job
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
