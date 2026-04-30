'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Star, MapPin, Clock, Briefcase, Phone, Heart, MessageSquare, CheckCircle, Shield,
} from 'lucide-react'
import Header from '@/components/layout/Header'
import { useAuth } from '@/components/auth/AuthProvider'
import { getWorkerById, getReviews, saveWorker, isWorkerSaved } from '@/lib/services'
import { formatPKR, formatDate, getInitials, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'
import type { Worker, Review } from '@/types'

const MapComponent = dynamic(() => import('@/components/map/MapComponent'), { ssr: false })

export default function WorkerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { employerProfile } = useAuth()
  const workerId = params.id as string
  const [worker, setWorker] = useState<Worker | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [isSaved, setIsSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const [workerData, reviewsData] = await Promise.all([
        getWorkerById(workerId),
        getReviews(workerId),
      ])
      setWorker(workerData)
      setReviews(reviewsData)
      if (employerProfile) {
        const saved = await isWorkerSaved(employerProfile.id, workerId)
        setIsSaved(saved)
      }
      setLoading(false)
    }
    fetchData()
  }, [workerId, employerProfile])

  const handleSave = async () => {
    if (!employerProfile) return
    const { saved } = await saveWorker(employerProfile.id, workerId)
    setIsSaved(saved)
  }

  const defaultLat = 31.5204
  const defaultLng = 74.3587

  if (loading) {
    return (
      <>
        <Header title="Worker Profile" showBack />
        <div className="px-4 py-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 h-48 animate-pulse" />
          <div className="bg-white rounded-2xl p-5 h-32 animate-pulse" />
        </div>
      </>
    )
  }

  if (!worker) {
    return (
      <>
        <Header title="Worker Not Found" showBack />
        <div className="px-4 py-12 text-center">
          <p className="text-gray-500">Worker not found</p>
          <button onClick={() => router.back()} className="mt-4 text-primary font-semibold">Go Back</button>
        </div>
      </>
    )
  }

  return (
    <>
      <Header title="Worker Profile" showBack />
      <div className="space-y-4 px-4 py-4">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 flex items-center justify-center text-lg font-bold flex-shrink-0">
              {worker.avatar_url ? (
                <img src={worker.avatar_url} alt={worker.full_name} className="w-full h-full rounded-2xl object-cover" />
              ) : (
                getInitials(worker.full_name)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900">{worker.full_name}</h2>
                    {worker.is_verified && <Shield className="w-4 h-4 text-blue-500" />}
                  </div>
                  <p className="text-sm text-gray-500">{worker.category?.name || 'Worker'}</p>
                </div>
                {employerProfile && (
                  <button
                    onClick={handleSave}
                    className={cn(
                      'w-10 h-10 flex items-center justify-center rounded-xl border transition-all active:scale-90',
                      isSaved ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-200'
                    )}
                  >
                    <Heart className={cn('w-5 h-5', isSaved && 'fill-red-500')} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-bold">{Number(worker.rating).toFixed(1)}</span>
                  <span className="text-xs text-gray-400">({worker.total_reviews})</span>
                </div>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5" /> {worker.experience_years}yr exp
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Briefcase className="w-3.5 h-3.5" /> {worker.total_jobs}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="text-center p-3.5 bg-gray-50 rounded-xl">
              <p className="text-lg font-bold text-gray-900">{worker.total_jobs}</p>
              <p className="text-[10px] text-gray-500 mt-0.5 font-medium">Jobs Done</p>
            </div>
            <div className="text-center p-3.5 bg-blue-50 rounded-xl">
              <p className="text-sm font-bold text-primary">{formatPKR(worker.base_rate)}</p>
              <p className="text-[10px] text-gray-500 mt-0.5 font-medium">Base Rate</p>
            </div>
            <div className="text-center p-3.5 bg-emerald-50 rounded-xl">
              <p className="text-sm font-bold text-emerald-600">{formatPKR(Number(worker.total_earnings))}</p>
              <p className="text-[10px] text-gray-500 mt-0.5 font-medium">Earned</p>
            </div>
          </div>

          {worker.is_available && (
            <div className="flex items-center gap-2 mt-4 p-3 bg-green-50 rounded-xl border border-green-100">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-xs font-semibold text-green-700">Currently Available</span>
            </div>
          )}
          {!worker.is_available && (
            <div className="flex items-center gap-2 mt-4 p-3 bg-orange-50 rounded-xl border border-orange-100">
              <Clock className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-semibold text-orange-700">Currently Busy</span>
            </div>
          )}
        </div>

        {/* Bio */}
        {worker.bio && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-fade-in animate-delay-100">
            <h3 className="text-sm font-bold text-gray-900 mb-2">About</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{worker.bio}</p>
          </div>
        )}

        {/* Skills */}
        {worker.skills && worker.skills.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-fade-in animate-delay-100">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {worker.skills.map((skill) => (
                <span key={skill} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {/* Location */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-fade-in animate-delay-200">
          <h3 className="text-sm font-bold text-gray-900 mb-2">Location</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>{worker.area ? `${worker.area}, ` : ''}{worker.city}</span>
          </div>
          {(worker.latitude && worker.longitude) && (
            <MapComponent
              latitude={Number(worker.latitude) || defaultLat}
              longitude={Number(worker.longitude) || defaultLng}
              zoom={14}
              className="h-48 w-full rounded-xl"
            />
          )}
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-fade-in animate-delay-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900">Reviews</h3>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-bold">{Number(worker.rating).toFixed(1)}</span>
              <span className="text-xs text-gray-400">({worker.total_reviews})</span>
            </div>
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-gray-900">
                      {review.is_anonymous ? 'Anonymous' : review.employer_name}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(review.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={cn('w-3.5 h-3.5', s <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200')}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-6">No reviews yet</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pb-4">
          <Button
            onClick={() => router.push(`/dashboard/post-job?category=${encodeURIComponent(worker.category?.name || '')}`)}
            className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/25"
          >
            <Briefcase className="w-4 h-4 mr-2" /> Hire Worker
          </Button>
          <Button variant="outline" className="w-12 h-12 p-0 rounded-xl border-2 border-gray-200">
            <Phone className="w-5 h-5 text-gray-600" />
          </Button>
          <Button variant="outline" className="w-12 h-12 p-0 rounded-xl border-2 border-gray-200">
            <MessageSquare className="w-5 h-5 text-gray-600" />
          </Button>
        </div>
      </div>
    </>
  )
}
