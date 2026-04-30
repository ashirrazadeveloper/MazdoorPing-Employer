'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Trash2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import WorkerCard from '@/components/workers/WorkerCard';
import { mockWorkers, mockSavedWorkerIds } from '@/lib/mock-data';

export default function FavoritesPage() {
  const [savedIds, setSavedIds] = useState<string[]>(mockSavedWorkerIds);
  const savedWorkers = mockWorkers.filter((w) => savedIds.includes(w.id));

  const handleRemove = (workerId: string) => {
    setSavedIds((prev) => prev.filter((id) => id !== workerId));
  };

  return (
    <>
      <Header title="Saved Workers" showBack />
      <div className="px-4 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            <span className="font-bold text-gray-900">{savedWorkers.length}</span> saved workers
          </p>
        </div>

        {savedWorkers.length > 0 ? (
          <div className="space-y-3">
            {savedWorkers.map((worker) => (
              <div key={worker.id} className="relative">
                <WorkerCard worker={worker} isSaved onSave={handleRemove} />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemove(worker.id);
                  }}
                  className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors z-10 active:scale-95"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-base font-bold text-gray-900">No saved workers</h3>
            <p className="text-sm text-gray-500 mt-1">
              Save workers to easily find and rehire them later
            </p>
            <Link
              href="/dashboard/find-workers"
              className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/25"
            >
              Find Workers
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
