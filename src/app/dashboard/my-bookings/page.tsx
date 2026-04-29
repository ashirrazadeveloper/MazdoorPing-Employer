'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Clock,
  MapPin,
  Users,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { mockJobs } from '@/lib/mock-data';
import { formatPKR, formatDate, cn } from '@/lib/utils';
import type { JobStatus } from '@/types';

const tabs: { value: JobStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Active' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const statusColors: Record<string, string> = {
  open: 'bg-green-50 text-green-700 border-green-200',
  in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-gray-50 text-gray-600 border-gray-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
};

const statusLabels: Record<string, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};


export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState<string>('all');

  const filteredJobs = activeTab === 'all'
    ? mockJobs
    : mockJobs.filter((j) => j.status === activeTab);

  return (
    <>
      <Header title="My Bookings" showBack />
      <div className="px-4 py-4 space-y-4">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0',
                activeTab === tab.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {tab.label}
              <span className="ml-1.5">
                {tab.value === 'all'
                  ? mockJobs.length
                  : mockJobs.filter((j) => j.status === tab.value).length}
              </span>
            </button>
          ))}
        </div>

        {/* Job List */}
        {filteredJobs.length > 0 ? (
          <div className="space-y-3">
            {filteredJobs.map((job) => {
              return (
                <Link
                  key={job.id}
                  href={`/bookings/${job.id}`}
                  className="block bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{job.category} &bull; {job.city}</p>
                    </div>
                    <span className={cn('text-[10px] font-semibold px-2.5 py-1 rounded-full border', statusColors[job.status])}>
                      {statusLabels[job.status]}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-2 mb-3">{job.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-primary">{formatPKR(job.budget_amount)}</span>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {job.area || job.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {job.bids_count} bids
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatDate(job.date)}
                    </span>
                    {job.workers_needed > 1 && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {job.workers_needed} workers
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-900">No jobs found</h3>
            <p className="text-sm text-gray-500 mt-1">
              {activeTab === 'all'
                ? 'You haven\'t posted any jobs yet'
                : `No ${statusLabels[activeTab]?.toLowerCase()} jobs`}
            </p>
            <Link
              href="/post-job"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium"
            >
              <Briefcase className="w-4 h-4" /> Post a Job
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
