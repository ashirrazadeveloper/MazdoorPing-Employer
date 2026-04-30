'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Star, Send, Shield } from 'lucide-react'
import Header from '@/components/layout/Header'
import { useAuth } from '@/components/auth/AuthProvider'
import { getWorkerById, createReview, hasReviewForJob } from '@/lib/services'
import { getInitials, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Worker } from '@/types'

export default function RateWorkerPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { employerProfile } = useAuth()
  const workerId = params.id as string
  const jobId = searchParams.get('jobId') || ''

  const [worker, setWorker] = useState<Worker | null>(null)
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [alreadyReviewed, setAlreadyReviewed] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const workerData = await getWorkerById(workerId)
      setWorker(workerData)

      if (employerProfile && jobId) {
        const reviewed = await hasReviewForJob(employerProfile.id, jobId)
        setAlreadyReviewed(reviewed)
      }
      setLoading(false)
    }
    fetchData()
  }, [workerId, employerProfile, jobId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0 || !employerProfile || !jobId) {
      setError('Please select a rating')
      return
    }
    setSubmitting(true)
    setError('')

    const { error: reviewError } = await createReview(
      employerProfile.id,
      jobId,
      workerId,
      rating,
      comment,
      isAnonymous,
    )

    setSubmitting(false)
    if (reviewError) {
      setError(reviewError.message || 'Failed to submit review')
      return
    }
    router.push('/dashboard/my-bookings')
  }

  if (loading) {
    return (
      <>
        <Header title="Rate Worker" showBack />
        <div className="px-4 py-4">
          <div className="bg-white rounded-2xl p-5 h-24 animate-pulse" />
          <div className="bg-white rounded-2xl p-5 h-64 mt-4 animate-pulse" />
        </div>
      </>
    )
  }

  if (!worker) {
    return (
      <>
        <Header title="Rate Worker" showBack />
        <div className="px-4 py-12 text-center">
          <p className="text-gray-500">Worker not found</p>
          <button onClick={() => router.back()} className="mt-4 text-primary font-semibold">Go Back</button>
        </div>
      </>
    )
  }

  if (alreadyReviewed) {
    return (
      <>
        <Header title="Rate Worker" showBack />
        <div className="px-4 py-12 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-green-600 fill-green-600" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Already Reviewed</h3>
          <p className="text-sm text-gray-500 mt-1">You have already rated this worker for this job.</p>
          <Button
            onClick={() => router.push('/dashboard/my-bookings')}
            className="mt-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold"
          >
            Back to Bookings
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <Header title="Rate Worker" showBack />
      <div className="px-4 py-4 space-y-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-fade-in">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 flex items-center justify-center text-base font-bold">
              {worker.avatar_url ? (
                <img src={worker.avatar_url} alt={worker.full_name} className="w-full h-full rounded-xl object-cover" />
              ) : (
                getInitials(worker.full_name)
              )}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">{worker.full_name}</h2>
              <p className="text-sm text-gray-500">{worker.category?.name || 'Worker'}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold">{Number(worker.rating).toFixed(1)}</span>
                <span className="text-xs text-gray-400">({worker.total_reviews} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-6 animate-fade-in animate-delay-100">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>
          )}
          <div>
            <Label className="text-base font-bold">How was the work?</Label>
            <div className="flex items-center justify-center gap-3 py-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110 active:scale-90"
                >
                  <Star
                    className={cn(
                      'w-11 h-11 transition-colors',
                      (hoverRating || rating) >= star
                        ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                        : 'text-gray-200'
                    )}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm font-medium text-gray-500 animate-fade-in">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Below Average'}
                {rating === 3 && 'Average'}
                {rating === 4 && 'Good'}
                {rating === 5 && 'Excellent!'}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="font-bold">Write a Review</Label>
            <Textarea
              rows={4}
              placeholder="Share your experience working with this worker..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="bg-gray-50/50 resize-none"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer group" onClick={() => setIsAnonymous(!isAnonymous)}>
            <div className="relative">
              <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} className="sr-only" />
              <div className={cn('w-11 h-6 rounded-full transition-colors', isAnonymous ? 'bg-primary' : 'bg-gray-200')}>
                <div className={cn('w-5 h-5 rounded-full bg-white shadow-sm mt-0.5 transition-transform', isAnonymous ? 'translate-x-5.5 ml-[22px]' : 'translate-x-0.5 ml-[2px]')} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Post anonymously</span>
            </div>
          </label>

          <Button
            type="submit"
            disabled={rating === 0 || submitting}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg shadow-blue-600/25"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" /> Submit Review
              </>
            )}
          </Button>
        </form>

        <div className="pb-4">
          <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700 font-medium">
            Back to bookings
          </button>
        </div>
      </div>
    </>
  )
}
