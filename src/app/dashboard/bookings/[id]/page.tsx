'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Star, MapPin, Clock, Users, DollarSign, AlertCircle, CheckCircle, XCircle,
  MessageSquare, Phone, Calendar, Zap,
} from 'lucide-react'
import Header from '@/components/layout/Header'
import { useAuth } from '@/components/auth/AuthProvider'
import { getJobById, getJobBids, acceptBid } from '@/lib/services'
import { CATEGORY_ICONS } from '@/types'
import { formatPKR, formatDate, getInitials, cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent } from '@/components/ui/dialog'
import dynamic from 'next/dynamic'
import type { Job, Bid } from '@/types'

const MapComponent = dynamic(() => import('@/components/map/MapComponent'), { ssr: false })

const statusColors: Record<string, string> = {
  open: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-gray-100 text-gray-600 border-gray-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
  disputed: 'bg-red-50 text-red-600 border-red-200',
}

const statusLabels: Record<string, string> = {
  open: 'Open - Receiving Bids',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  disputed: 'Disputed',
}

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  useAuth() // ensure auth
  const jobId = params.id as string
  const [job, setJob] = useState<Job | null>(null)
  const [bids, setBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmBid, setConfirmBid] = useState<string | null>(null)
  const [accepting, setAccepting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const [jobData, bidsData] = await Promise.all([
        getJobById(jobId),
        getJobBids(jobId),
      ])
      setJob(jobData)
      setBids(bidsData)
      setLoading(false)
    }
    fetchData()
  }, [jobId])

  const handleAcceptBid = async (bidId: string) => {
    if (!job) return
    setAccepting(true)
    const bid = bids.find((b) => b.id === bidId)
    if (!bid) return

    const { error } = await acceptBid(bidId, jobId, bid.amount)
    setAccepting(false)
    setConfirmBid(null)

    if (error) return

    // Refresh data
    const [jobData, bidsData] = await Promise.all([
      getJobById(jobId),
      getJobBids(jobId),
    ])
    setJob(jobData)
    setBids(bidsData)
  }

  const handleRejectBid = async (bidId: string) => {
    setBids((prev) =>
      prev.map((b) => (b.id === bidId ? { ...b, status: 'rejected' as const } : b))
    )
  }

  const defaultLat = 31.5204
  const defaultLng = 74.3587

  if (loading) {
    return (
      <>
        <Header title="Job Detail" showBack />
        <div className="px-4 py-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 h-64 animate-pulse" />
          <div className="bg-white rounded-2xl p-5 h-48 animate-pulse" />
        </div>
      </>
    )
  }

  if (!job) {
    return (
      <>
        <Header title="Job Not Found" showBack />
        <div className="px-4 py-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-500">Job not found</p>
          <button onClick={() => router.back()} className="mt-4 text-primary font-semibold">Go Back</button>
        </div>
      </>
    )
  }

  const acceptedBid = bids.find((b) => b.status === 'accepted')

  return (
    <>
      <Header title="Job Detail" showBack />
      <div className="space-y-4 px-4 py-4">
        <div className="flex items-center justify-between animate-fade-in">
          <Badge className={cn('text-xs', statusColors[job.status])} variant="secondary">
            {statusLabels[job.status] || job.status}
          </Badge>
          {job.urgency !== 'normal' && (
            <span className={cn(
              'text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1',
              job.urgency === 'urgent' ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'
            )}>
              <Zap className="w-3 h-3" /> {job.urgency}
            </span>
          )}
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-fade-in animate-delay-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-2xl">
              {CATEGORY_ICONS[job.category?.name || ''] || '🔧'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{job.title}</h2>
              <p className="text-sm text-gray-500">{job.category?.name}</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-5">{job.description}</p>

          <div className="space-y-3 bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-3 text-sm">
              <DollarSign className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="font-bold text-primary">{formatPKR(job.budget_min || 0)}</span>
              <span className="text-gray-400 capitalize">({job.budget_type})</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>{job.address || `${job.area || ''}, ${job.city}`}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>{job.scheduled_date ? formatDate(job.scheduled_date) : formatDate(job.created_at)} {job.scheduled_time && `at ${job.scheduled_time}`}</span>
            </div>
            {job.duration && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>{job.duration}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>{job.workers_needed} worker{job.workers_needed > 1 ? 's' : ''} needed</span>
            </div>
          </div>

          {job.skills_required && job.skills_required.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {job.skills_required.map((skill) => (
                <span key={skill} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">{skill}</span>
              ))}
            </div>
          )}
        </div>

        {/* Map */}
        {(job.latitude && job.longitude) && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-fade-in animate-delay-100">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Location</h3>
            <MapComponent
              latitude={Number(job.latitude) || defaultLat}
              longitude={Number(job.longitude) || defaultLng}
              zoom={15}
              className="h-48 w-full rounded-xl"
            />
          </div>
        )}

        {/* Bids Section */}
        {job.status === 'open' && (
          <div className="animate-fade-in animate-delay-200">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              Bids
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">{bids.length}</Badge>
            </h3>

            {bids.length > 0 ? (
              <div className="space-y-3">
                {bids.map((bid) => (
                  <div
                    key={bid.id}
                    className={cn(
                      'bg-white rounded-2xl p-4 shadow-sm border transition-all',
                      bid.status === 'accepted' ? 'border-green-200 bg-green-50/50' :
                      bid.status === 'rejected' ? 'border-gray-100 opacity-60' :
                      'border-gray-100 hover:border-blue-200'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {getInitials(bid.worker?.full_name || 'W')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900">{bid.worker?.full_name || 'Worker'}</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <div className="flex items-center gap-0.5">
                                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                <span className="text-xs font-bold">{bid.worker?.rating || 0}</span>
                              </div>
                              <span className="text-xs text-gray-400">{bid.worker?.experience_years || 0}yr exp</span>
                            </div>
                          </div>
                          <span className="text-base font-bold text-primary">{formatPKR(bid.amount)}</span>
                        </div>

                        {bid.message && (
                          <p className="text-xs text-gray-600 mt-2 leading-relaxed">{bid.message}</p>
                        )}

                        {bid.estimated_duration && (
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Est: {bid.estimated_duration}
                          </p>
                        )}

                        {bid.status === 'pending' && (
                          <div className="flex gap-2 mt-3">
                            <Button
                              onClick={() => setConfirmBid(bid.id)}
                              size="sm"
                              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm"
                            >
                              <CheckCircle className="w-3.5 h-3.5 mr-1" /> Accept
                            </Button>
                            <Button
                              onClick={() => handleRejectBid(bid.id)}
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                            </Button>
                          </div>
                        )}

                        {bid.status === 'accepted' && (
                          <div className="flex items-center gap-2 mt-2.5 p-2.5 bg-green-50 rounded-xl">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-xs font-semibold text-green-700 flex-1">Accepted</span>
                          </div>
                        )}

                        {bid.status === 'rejected' && (
                          <div className="flex items-center gap-1 mt-2">
                            <XCircle className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-400">Rejected</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="w-7 h-7 text-gray-300" />
                </div>
                <p className="text-sm font-semibold text-gray-900">No bids received yet</p>
                <p className="text-xs text-gray-400 mt-1">Workers will start bidding soon</p>
              </div>
            )}
          </div>
        )}

        {/* In Progress Section */}
        {job.status === 'in_progress' && acceptedBid && (
          <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 animate-fade-in">
            <h3 className="text-sm font-bold text-blue-800 mb-3">Job In Progress</h3>
            <div className="flex items-center gap-3 bg-white rounded-xl p-3.5 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                {getInitials(acceptedBid.worker?.full_name || 'W')}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{acceptedBid.worker?.full_name || 'Worker'}</p>
                <p className="text-xs text-gray-500">Working on your job</p>
              </div>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center active:scale-95">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center active:scale-95">
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Completed Section */}
        {job.status === 'completed' && acceptedBid && (
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 animate-fade-in">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Job Completed</h3>
                <p className="text-xs text-gray-500">Rate your worker</p>
              </div>
            </div>
            <Button
              onClick={() => {
                if (acceptedBid.worker_id) router.push(`/dashboard/rate/${acceptedBid.worker_id}?jobId=${jobId}`)
              }}
              className="w-full h-11 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/25"
            >
              <Star className="w-4 h-4 mr-2 fill-white" /> Rate Worker
            </Button>
          </div>
        )}
      </div>

      <Dialog open={!!confirmBid} onOpenChange={() => setConfirmBid(null)}>
        <DialogHeader className="text-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-7 h-7 text-green-600" />
          </div>
          <DialogTitle className="text-center text-lg">Accept Bid?</DialogTitle>
          <DialogDescription className="text-center mt-2">
            You are accepting this worker&apos;s bid. They will be notified and start working on your job.
          </DialogDescription>
        </DialogHeader>
        <DialogContent>
          <div className="space-y-3">
            <Button
              onClick={() => confirmBid && handleAcceptBid(confirmBid)}
              disabled={accepting}
              className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold shadow-lg shadow-green-500/25"
            >
              {accepting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Yes, Accept Bid'
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setConfirmBid(null)}
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
