'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, Send, Shield } from 'lucide-react';
import Header from '@/components/layout/Header';
import { mockWorkers } from '@/lib/mock-data';
import { getInitials, cn } from '@/lib/utils';

export default function RateWorkerPage() {
  const params = useParams();
  const router = useRouter();
  const workerId = params.id as string;
  const worker = mockWorkers.find((w) => w.id === workerId);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!worker) {
    return (
      <>
        <Header title="Rate Worker" showBack />
        <div className="px-4 py-12 text-center">
          <p className="text-gray-500">Worker not found</p>
          <button onClick={() => router.back()} className="mt-4 text-primary font-medium">
            Go Back
          </button>
        </div>
      </>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      router.push('/my-bookings');
    }, 1000);
  };

  return (
    <>
      <Header title="Rate Worker" showBack />
      <div className="px-4 py-4 space-y-4">
        {/* Worker Info */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-primary-light text-primary flex items-center justify-center text-base font-bold">
              {worker.avatar_url ? (
                <img src={worker.avatar_url} alt={worker.name} className="w-full h-full rounded-xl object-cover" />
              ) : (
                getInitials(worker.name)
              )}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">{worker.name}</h2>
              <p className="text-sm text-gray-500">{worker.category}</p>
            </div>
          </div>
        </div>

        {/* Rating Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">How was the work?</label>
            <div className="flex items-center justify-center gap-2 py-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110 active:scale-95"
                >
                  <Star
                    className={cn(
                      'w-10 h-10 transition-colors',
                      (hoverRating || rating) >= star
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-200'
                    )}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-gray-500">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Below Average'}
                {rating === 3 && 'Average'}
                {rating === 4 && 'Good'}
                {rating === 5 && 'Excellent!'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1.5">
              Write a Review
            </label>
            <textarea
              rows={4}
              placeholder="Share your experience working with this worker..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-primary resize-none"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="sr-only"
              />
              <div className={cn(
                'w-10 h-6 rounded-full transition-colors',
                isAnonymous ? 'bg-primary' : 'bg-gray-200'
              )}>
                <div className={cn(
                  'w-4 h-4 rounded-full bg-white shadow-sm mt-1 transition-transform',
                  isAnonymous ? 'translate-x-5' : 'translate-x-1'
                )} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Post anonymously</span>
            </div>
          </label>

          <button
            type="submit"
            disabled={rating === 0 || submitting}
            className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-40"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" /> Submit Review
              </>
            )}
          </button>
        </form>
      </div>
    </>
  );
}
