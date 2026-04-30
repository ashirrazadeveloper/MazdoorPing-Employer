'use client'

import Link from 'next/link'
import { Star, MapPin, Briefcase, Heart } from 'lucide-react'
import { cn, formatPKR, getInitials } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import type { Worker } from '@/types'

interface WorkerCardProps {
  worker: Worker
  isSaved?: boolean
  onSave?: (id: string) => void
}

export default function WorkerCard({ worker, isSaved, onSave }: WorkerCardProps) {
  return (
    <Link href={`/dashboard/workers/${worker.id}`} className="block">
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold flex-shrink-0 group-hover:scale-105 transition-transform">
            {worker.avatar_url ? (
              <img src={worker.avatar_url} alt={worker.full_name} className="w-full h-full rounded-xl object-cover" />
            ) : (
              getInitials(worker.full_name)
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 truncate">{worker.full_name}</h3>
              <div className="flex items-center gap-1.5">
                {isSaved !== undefined && (
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      onSave?.(worker.id)
                    }}
                    className="transition-transform active:scale-90"
                  >
                    <Heart className={cn('w-4 h-4', isSaved ? 'text-red-500 fill-red-500' : 'text-gray-300')} />
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{worker.category?.name || 'Worker'}</p>
            <div className="flex items-center gap-1 mt-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-gray-800">{Number(worker.rating).toFixed(1)}</span>
              <span className="text-xs text-gray-400">({worker.total_reviews})</span>
              <span className="text-gray-300 mx-0.5">|</span>
              <span className="text-xs text-gray-500">{worker.experience_years}yr exp</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {worker.city}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-3 h-3" /> {worker.total_jobs}
            </span>
          </div>
          <Badge variant={worker.is_available ? "success" : "secondary"} className="text-[10px]">
            {worker.is_available ? 'Available' : 'Busy'}
          </Badge>
        </div>

        <div className="flex items-center justify-between mt-2.5">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-primary">{formatPKR(worker.base_rate)}</span>
            <span className="text-xs text-gray-400">base rate</span>
          </div>
        </div>

        {worker.skills && worker.skills.length > 0 && (
          <div className="flex gap-1.5 mt-3 overflow-hidden">
            {worker.skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 bg-gray-50 text-gray-600 rounded-md text-[10px] font-medium whitespace-nowrap"
              >
                {skill}
              </span>
            ))}
            {worker.skills.length > 3 && (
              <span className="px-2 py-0.5 bg-gray-50 text-gray-400 rounded-md text-[10px] font-medium">
                +{worker.skills.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
