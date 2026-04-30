'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
import Header from '@/components/layout/Header';
import WorkerCard from '@/components/workers/WorkerCard';
import { mockWorkers } from '@/lib/mock-data';
import { CITIES, WORKER_CATEGORIES } from '@/types';
import type { WorkerCategory } from '@/types';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

export default function FindWorkersContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<WorkerCategory | ''>(initialCategory as WorkerCategory);
  const [selectedCity, setSelectedCity] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'price_low' | 'price_high'>('rating');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

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
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search workers, skills, cities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-12 bg-white"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'w-12 h-12 flex items-center justify-center rounded-xl border transition-all active:scale-95 flex-shrink-0',
              showFilters ? 'bg-primary text-white border-primary' : 'bg-white text-gray-500 border-gray-200'
            )}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-5 animate-fade-in">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2.5">Category</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={cn(
                    'px-3.5 py-2 rounded-full text-xs font-medium border transition-all',
                    !selectedCategory ? 'bg-primary text-white border-primary shadow-sm shadow-blue-100' : 'border-gray-200 text-gray-600 hover:border-blue-200'
                  )}
                >
                  All
                </button>
                {WORKER_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      'px-3.5 py-2 rounded-full text-xs font-medium border transition-all',
                      selectedCategory === cat ? 'bg-primary text-white border-primary shadow-sm shadow-blue-100' : 'border-gray-200 text-gray-600 hover:border-blue-200'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2.5">City</label>
              <Select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="h-11 bg-gray-50 appearance-none"
              >
                <option value="">All Cities</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2.5">Sort By</label>
              <div className="grid grid-cols-2 gap-2">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSortBy(opt.value)}
                    className={cn(
                      'px-3 py-2.5 rounded-xl text-xs font-medium border transition-all',
                      sortBy === opt.value ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-blue-200'
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
          <div className="flex items-center gap-2 flex-wrap animate-fade-in">
            {selectedCategory && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                {selectedCategory}
                <button onClick={() => setSelectedCategory('')} className="hover:text-red-500 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {selectedCity && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                {selectedCity}
                <button onClick={() => setSelectedCity('')} className="hover:text-red-500 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
          </div>
        )}

        {/* Results Header */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            <span className="font-bold text-gray-900">{filteredWorkers.length}</span> workers found
          </p>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('list')}
              className={cn('p-2 rounded-md transition-all', viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-gray-400')}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={cn('p-2 rounded-md transition-all', viewMode === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-gray-400')}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results */}
        {filteredWorkers.length > 0 ? (
          viewMode === 'list' ? (
            <div className="space-y-3">
              {filteredWorkers.map((worker) => (
                <WorkerCard key={worker.id} worker={worker} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredWorkers.map((worker) => (
                <WorkerCard key={worker.id} worker={worker} />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-base font-bold text-gray-900">No workers found</h3>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </>
  );
}
