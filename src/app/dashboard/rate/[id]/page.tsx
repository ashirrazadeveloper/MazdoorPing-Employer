'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, Send, Shield } from 'lucide-react';
import Header from '@/components/layout/Header';
import { mockWorkers } from '@/lib/mock-data';
import { getInitials, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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
          <button onClick={() => router.back()} className="mt-4 text-primary font-semibold">
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
      router.push('/dashboard/my-bookings');
    }, 1000);
  };

  return (
    <>
      <Header title="Rate Worker" showBack />
      <div className="px-4 py-4 space-y-4">
        {/* Worker Info */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-fade-in">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 flex items-center justify-center text-base font-bold">
              {worker.avatar_url ? (
                <img src={worker.avatar_url} alt={worker.name} className="w-full h-full rounded-xl object-cover" />
              ) : (
                getInitials(worker.name)
              )}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">{worker.name}</h2>
              <p className="text-sm text-gray-500">{worker.category}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold">{worker.rating}</span>
                <span className="text-xs text-gray-400">({worker.total_reviews} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-6 animate-fade-in animate-delay-100">
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
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="sr-only"
              />
              <div className={cn(
                'w-11 h-6 rounded-full transition-colors',
                isAnonymous ? 'bg-primary' : 'bg-gray-200'
              )}>
                <div className={cn(
                  'w-5 h-5 rounded-full bg-white shadow-sm mt-0.5 transition-transform',
                  isAnonymous ? 'translate-x-5.5 ml-[22px]' : 'translate-x-0.5 ml-[2px]'
                )} />
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
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium"
          >
            Back to bookings
          </button>
        </div>
      </div>
    </>
  );
}
