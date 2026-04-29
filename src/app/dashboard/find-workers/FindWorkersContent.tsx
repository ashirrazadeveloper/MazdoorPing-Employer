'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import Header from '@/components/layout/Header';
import WorkerCard from '@/components/workers/WorkerCard';
import { mockWorkers } from '@/lib/mock-data';
import { CITIES, WORKER_CATEGORIES } from '@/types';
import type { WorkerCategory } from '@/types';
import { cn } from '@/lib/utils';

export default function FindWorkersContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<WorkerCategory | ''>(initialCategory as WorkerCategory);
  const [selectedCity, setSelectedCity] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'price_low' | 'price_high'>('rating');

  const filteredWorkers = useMemo(() => {
    let workers = [...mockWorkers];

    if (search) {
      const q = search.toLowerCase();
      workers = workers.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.category.toLowerCase().includes(q) ||
          w.city.toLowerCase().includes(q) ||
          w.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (selectedCategory) {
      workers = workers.filter((w) => w.category === selectedCategory);
    }

    if (selectedCity) {
      workers = workers.filter((w) => w.city === selectedCity);
    }

    switch (sortBy) {
      case 'rating':
        workers.sort((a, b) => b.rating - a.rating);
        break;
      case 'experience':
        workers.sort((a, b) => b.experience_years - a.experience_years);
        break;
      case 'price_low':
        workers.sort((a, b) => a.hourly_rate - b.hourly_rate);
        break;
      case 'price_high':
        workers.sort((a, b) => b.hourly_rate - a.hourly_rate);
        break;
    }

    return workers;
  }, [search, selectedCategory, selectedCity, sortBy]);

  const sortOptions = [
    { value: 'rating' as const, label: 'Top Rated' },
    { value: 'experience' as const, label: 'Most Experienced' },
    { value: 'price_low' as const, label: 'Price: Low to High' },
    { value: 'price_high' as const, label: 'Price: High to Low' },
  ];

  return (
    <>
      <Header title="Find Workers" showBack />
      <div className="px-4 py-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search workers, skills, cities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:border-primary"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors',
              showFilters ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                    !selectedCategory ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-primary/30'
                  )}
                >
                  All
                </button>
                {WORKER_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                      selectedCategory === cat ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-primary/30'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">City</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:border-primary"
              >
                <option value="">All Cities</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">Sort By</label>
              <div className="grid grid-cols-2 gap-2">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSortBy(opt.value)}
                    className={cn(
                      'px-3 py-2 rounded-xl text-xs font-medium border transition-colors',
                      sortBy === opt.value ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {(selectedCategory || selectedCity) && (
          <div className="flex items-center gap-2 flex-wrap">
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-light text-primary rounded-full text-xs font-medium">
                {selectedCategory}
                <button onClick={() => setSelectedCategory('')} className="hover:text-red-500">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {selectedCity && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-light text-primary rounded-full text-xs font-medium">
                {selectedCity}
                <button onClick={() => setSelectedCity('')} className="hover:text-red-500">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
          </div>
        )}

        {/* Results */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-900">{filteredWorkers.length}</span> workers found
          </p>
        </div>

        {filteredWorkers.length > 0 ? (
          <div className="space-y-3">
            {filteredWorkers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-900">No workers found</h3>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </>
  );
}
