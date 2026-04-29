'use client';

import { useState } from 'react';
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
            <span className="font-semibold text-gray-900">{savedWorkers.length}</span> saved workers
          </p>
        </div>

        {savedWorkers.length > 0 ? (
          <div className="space-y-3">
            {savedWorkers.map((worker) => (
              <div key={worker.id} className="relative">
                <WorkerCard worker={worker} isSaved />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemove(worker.id);
                  }}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors z-10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-900">No saved workers</h3>
            <p className="text-sm text-gray-500 mt-1">
              Save workers to easily find and rehire them later
            </p>
            <a
              href="/find-workers"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium"
            >
              Find Workers
            </a>
          </div>
        )}
      </div>
    </>
  );
}
