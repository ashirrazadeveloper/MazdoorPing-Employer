'use client';

import Link from 'next/link';
import { Star, MapPin, Clock, Briefcase } from 'lucide-react';
import { cn, formatPKR, getInitials } from '@/lib/utils';
import type { Worker } from '@/types';

interface WorkerCardProps {
  worker: Worker;
  isSaved?: boolean;
}

export default function WorkerCard({ worker, isSaved }: WorkerCardProps) {
  return (
    <Link href={`/workers/${worker.id}`} className="block">
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-primary/30 transition-all card-hover">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center text-sm font-bold flex-shrink-0">
            {worker.avatar_url ? (
              <img src={worker.avatar_url} alt={worker.name} className="w-full h-full rounded-xl object-cover" />
            ) : (
              getInitials(worker.name)
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 truncate">{worker.name}</h3>
              {isSaved && (
                <span className="text-xs text-red-400 flex-shrink-0">♥</span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{worker.category}</p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-xs font-semibold text-gray-700">{worker.rating}</span>
              <span className="text-xs text-gray-400">({worker.total_reviews})</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {worker.city}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {worker.experience_years}yr
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-3 h-3" /> {worker.completed_jobs}
            </span>
          </div>
          <span className={cn(
            'text-xs font-semibold px-2 py-0.5 rounded-full',
            worker.is_available ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
          )}>
            {worker.is_available ? 'Available' : 'Busy'}
          </span>
        </div>

        <div className="mt-2">
          <span className="text-sm font-bold text-primary">{formatPKR(worker.hourly_rate)}</span>
          <span className="text-xs text-gray-400">/hr</span>
        </div>
      </div>
    </Link>
  );
}
