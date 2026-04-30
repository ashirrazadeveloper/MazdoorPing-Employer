'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Star,
  MapPin,
  Clock,
  Briefcase,
  Phone,
  Heart,
  MessageSquare,
  CheckCircle,
  Shield,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { mockWorkers, mockReviews, mockSavedWorkerIds } from '@/lib/mock-data';
import { formatPKR, formatDate, getInitials, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function WorkerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const workerId = params.id as string;
  const worker = mockWorkers.find((w) => w.id === workerId);

  const [isSaved, setIsSaved] = useState(mockSavedWorkerIds.includes(workerId));

  if (!worker) {
    return (
      <>
        <Header title="Worker Not Found" showBack />
        <div className="px-4 py-12 text-center">
          <p className="text-gray-500">Worker not found</p>
          <button onClick={() => router.back()} className="mt-4 text-primary font-semibold">
            Go Back
          </button>
        </div>
      </>
    );
  }

  const workerReviews = mockReviews.filter((r) => r.worker_id === workerId);

  return (
    <>
      <Header title="Worker Profile" showBack />
      <div className="space-y-4 px-4 py-4">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 flex items-center justify-center text-lg font-bold flex-shrink-0">
              {worker.avatar_url ? (
                <img src={worker.avatar_url} alt={worker.name} className="w-full h-full rounded-2xl object-cover" />
              ) : (
                getInitials(worker.name)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900">{worker.name}</h2>
                    <Shield className="w-4 h-4 text-blue-500" />
                  </div>
                  <p className="text-sm text-gray-500">{worker.category}</p>
                </div>
                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className={cn(
                    'w-10 h-10 flex items-center justify-center rounded-xl border transition-all active:scale-90',
                    isSaved ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-200'
                  )}
                >
                  <Heart className={cn('w-5 h-5', isSaved && 'fill-red-500')} />
                </button>
              </div>

              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-bold">{worker.rating}</span>
                  <span className="text-xs text-gray-400">({worker.total_reviews})</span>
                </div>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5" /> {worker.experience_years}yr exp
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Briefcase className="w-3.5 h-3.5" /> {worker.completed_jobs}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="text-center p-3.5 bg-gray-50 rounded-xl">
              <p className="text-lg font-bold text-gray-900">{worker.completed_jobs}</p>
              <p className="text-[10px] text-gray-500 mt-0.5 font-medium">Jobs Done</p>
            </div>
            <div className="text-center p-3.5 bg-blue-50 rounded-xl">
              <p className="text-sm font-bold text-primary">{formatPKR(worker.hourly_rate)}</p>
              <p className="text-[10px] text-gray-500 mt-0.5 font-medium">Per Hour</p>
            </div>
            <div className="text-center p-3.5 bg-blue-50 rounded-xl">
              <p className="text-sm font-bold text-primary">{formatPKR(worker.daily_rate)}</p>
              <p className="text-[10px] text-gray-500 mt-0.5 font-medium">Per Day</p>
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
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-fade-in animate-delay-100">
          <h3 className="text-sm font-bold text-gray-900 mb-2">About</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{worker.bio}</p>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-fade-in animate-delay-100">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {worker.skills.map((skill) => (
              <span key={skill} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-fade-in animate-delay-200">
          <h3 className="text-sm font-bold text-gray-900 mb-2">Location</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>{worker.area ? `${worker.area}, ` : ''}{worker.city}</span>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-fade-in animate-delay-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900">Reviews</h3>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-bold">{worker.rating}</span>
              <span className="text-xs text-gray-400">({worker.total_reviews})</span>
            </div>
          </div>

          {workerReviews.length > 0 ? (
            <div className="space-y-4">
              {workerReviews.map((review) => (
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
            onClick={() => router.push(`/dashboard/post-job?category=${encodeURIComponent(worker.category)}`)}
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
  );
}
