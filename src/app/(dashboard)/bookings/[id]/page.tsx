'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Star,
  MapPin,
  Clock,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  MessageSquare,
  Phone,
  Calendar,
  Zap,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { mockJobs, mockBids } from '@/lib/mock-data';
import { CATEGORY_ICONS, type WorkerCategory } from '@/types';
import { formatPKR, formatDate, getInitials, cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  open: 'bg-green-50 text-green-700 border-green-200',
  in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-gray-50 text-gray-600 border-gray-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
};

const statusLabels: Record<string, string> = {
  open: 'Open - Receiving Bids',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const urgencyLabels: Record<string, string> = {
  normal: 'Normal',
  urgent: 'Urgent',
  very_urgent: 'Very Urgent',
};

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const job = mockJobs.find((j) => j.id === jobId);
  const [bids, setBids] = useState(mockBids.filter((b) => b.job_id === jobId));

  if (!job) {
    return (
      <>
        <Header title="Job Not Found" showBack />
        <div className="px-4 py-12 text-center">
          <p className="text-gray-500">Job not found</p>
          <button onClick={() => router.back()} className="mt-4 text-primary font-medium">
            Go Back
          </button>
        </div>
      </>
    );
  }

  const handleAcceptBid = (bidId: string) => {
    setBids((prev) =>
      prev.map((b) => (b.id === bidId ? { ...b, status: 'accepted' as const } : b))
    );
  };

  const handleRejectBid = (bidId: string) => {
    setBids((prev) =>
      prev.map((b) => (b.id === bidId ? { ...b, status: 'rejected' as const } : b))
    );
  };

  return (
    <>
      <Header title="Job Detail" showBack />
      <div className="space-y-4 px-4 py-4">
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <span className={cn('text-xs font-semibold px-3 py-1.5 rounded-full border', statusColors[job.status])}>
            {statusLabels[job.status]}
          </span>
          {job.urgency !== 'normal' && (
            <span className={cn(
              'text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1',
              job.urgency === 'urgent' ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'
            )}>
              <Zap className="w-3 h-3" /> {urgencyLabels[job.urgency]}
            </span>
          )}
        </div>

        {/* Job Info Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{CATEGORY_ICONS[job.category as WorkerCategory]}</span>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{job.title}</h2>
              <p className="text-sm text-gray-500">{job.category}</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-4">{job.description}</p>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <span className="font-bold text-primary">{formatPKR(job.budget_amount)}</span>
              <span className="text-gray-400 capitalize">({job.budget_type})</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{job.address || `${job.area}, ${job.city}`}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{formatDate(job.date)} {job.time && `at ${job.time}`}</span>
            </div>
            {job.duration && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{job.duration}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Users className="w-4 h-4 text-gray-400" />
              <span>{job.workers_needed} worker{job.workers_needed > 1 ? 's' : ''} needed</span>
            </div>
          </div>

          {job.skills_required.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {job.skills_required.map((skill) => (
                <span key={skill} className="px-3 py-1 bg-primary-light text-primary rounded-full text-xs font-medium">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bids Section */}
        {job.status === 'open' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900">
                Bids ({bids.length})
              </h3>
            </div>

            {bids.length > 0 ? (
              <div className="space-y-3">
                {bids.map((bid) => (
                  <div
                    key={bid.id}
                    className={cn(
                      'bg-white rounded-2xl p-4 shadow-sm border transition-colors',
                      bid.status === 'accepted' ? 'border-green-200 bg-green-50/30' :
                      bid.status === 'rejected' ? 'border-gray-100 opacity-60' :
                      'border-gray-100'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {getInitials(bid.worker.name)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900">{bid.worker.name}</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <div className="flex items-center gap-0.5">
                                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                <span className="text-xs font-medium">{bid.worker.rating}</span>
                              </div>
                              <span className="text-xs text-gray-400">{bid.worker.experience_years}yr exp</span>
                            </div>
                          </div>
                          <span className="text-base font-bold text-primary">{formatPKR(bid.amount)}</span>
                        </div>

                        <p className="text-xs text-gray-600 mt-2">{bid.message}</p>

                        {bid.estimated_duration && (
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Est: {bid.estimated_duration}
                          </p>
                        )}

                        {bid.status === 'pending' && (
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => handleAcceptBid(bid.id)}
                              className="flex-1 bg-primary hover:bg-primary-hover text-white py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Accept
                            </button>
                            <button
                              onClick={() => handleRejectBid(bid.id)}
                              className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 hover:bg-gray-50"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Reject
                            </button>
                          </div>
                        )}

                        {bid.status === 'accepted' && (
                          <div className="flex items-center gap-2 mt-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-xs font-semibold text-green-700">Accepted</span>
                            <button className="ml-auto text-xs text-primary font-medium flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" /> Chat
                            </button>
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
              <div className="text-center py-8 bg-white rounded-2xl border border-gray-100">
                <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No bids received yet</p>
              </div>
            )}
          </div>
        )}

        {/* In Progress Section */}
        {job.status === 'in_progress' && (
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
            <h3 className="text-sm font-bold text-blue-800 mb-2">Job In Progress</h3>
            {bids.find((b) => b.status === 'accepted') && (
              <div className="flex items-center gap-3 bg-white rounded-xl p-3">
                <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center text-xs font-bold">
                  {getInitials(bids.find((b) => b.status === 'accepted')!.worker.name)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {bids.find((b) => b.status === 'accepted')!.worker.name}
                  </p>
                  <p className="text-xs text-gray-500">Working on your job</p>
                </div>
                <div className="flex gap-2">
                  <button className="w-9 h-9 rounded-xl bg-primary-light text-primary flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="w-9 h-9 rounded-xl bg-primary-light text-primary flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            <button className="w-full mt-3 bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl text-sm font-semibold transition-colors">
              Mark as Complete
            </button>
          </div>
        )}

        {/* Completed Section */}
        {job.status === 'completed' && (
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="text-sm font-bold text-gray-900">Job Completed</h3>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Rate your worker to help other employers make informed decisions.
            </p>
            <button
              onClick={() => {
                const acceptedBid = bids.find((b) => b.status === 'accepted');
                if (acceptedBid) router.push(`/rate/${acceptedBid.worker_id}`);
              }}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Star className="w-4 h-4 fill-white" /> Rate Worker
            </button>
          </div>
        )}
      </div>
    </>
  );
}
