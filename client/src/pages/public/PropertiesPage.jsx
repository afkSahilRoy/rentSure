import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, MapPin, SlidersHorizontal, X } from 'lucide-react';
import { propertiesAPI } from '../../services/api';
import PropertyCard from '../../components/property/PropertyCard';
import SearchFilters from '../../components/property/SearchFilters';
import PropertyMap from '../../components/property/PropertyMap';
import Spinner from '../../components/common/Spinner';

export default function PropertiesPage() {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    type: searchParams.get('type') || '',
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  });

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await propertiesAPI.getAll(filters);
      setProperties(res.data.properties || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(fetchProperties, 300);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleClear = () => {
    setFilters({ city: '', type: '', category: '', search: '', minPrice: '', maxPrice: '' });
  };

  const activeFiltersCount = Object.values(filters).filter((val) => Boolean(val)).length;

  return (
    <div className="bg-[#F5F1EB] min-h-screen text-[#3E362E] py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-6">
        {/* Editorial Page Header */}
        <div className="mb-8 pb-6 border-b border-[#DDD5CC]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-[#AC8968] font-bold block mb-1">
                DISCOVERY & EXPLORATION
              </span>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#3E362E]">
                Properties
              </h1>
            </div>

            {/* View Mode & Filter Triggers */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="md:hidden flex items-center gap-1.5 px-3 py-2 border border-[#DDD5CC] bg-white rounded-sm text-xs font-semibold uppercase tracking-wider"
              >
                <SlidersHorizontal size={14} />
                <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
              </button>

              {/* Grid / Map Switcher */}
              <div className="flex items-center border border-[#DDD5CC] rounded-sm p-1 bg-white">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors flex items-center gap-1.5 ${
                    viewMode === 'grid'
                      ? 'bg-[#3E362E] text-white'
                      : 'text-[#766B61] hover:text-[#3E362E]'
                  }`}
                >
                  <LayoutGrid size={14} />
                  <span>Grid</span>
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors flex items-center gap-1.5 ${
                    viewMode === 'map'
                      ? 'bg-[#3E362E] text-white'
                      : 'text-[#766B61] hover:text-[#3E362E]'
                  }`}
                >
                  <MapPin size={14} />
                  <span>Map</span>
                </button>
              </div>
            </div>
          </div>

          {/* Results count indicator */}
          <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-widest text-[#766B61] font-medium">
            <span>
              {loading ? 'Searching catalog...' : `${String(properties.length).padStart(2, '0')} Residences Available`}
            </span>
            {activeFiltersCount > 0 && (
              <span className="text-[#865D36] font-semibold">
                &bull; Filters active ({activeFiltersCount})
              </span>
            )}
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Desktop Left Sidebar Filters */}
          <aside className="hidden md:block w-72 shrink-0 sticky top-28">
            <SearchFilters
              filters={filters}
              setFilters={setFilters}
              onApply={fetchProperties}
              onClear={handleClear}
            />
          </aside>

          {/* Mobile Filter Drawer / Dropdown */}
          {showMobileFilters && (
            <div className="md:hidden w-full mb-6">
              <SearchFilters
                filters={filters}
                setFilters={setFilters}
                onApply={() => {
                  fetchProperties();
                  setShowMobileFilters(false);
                }}
                onClear={handleClear}
              />
            </div>
          )}

          {/* Right Main Results Area */}
          <main className="flex-1 w-full">
            {loading ? (
              <div className="py-24 bg-white border border-[#DDD5CC] rounded-sm">
                <Spinner />
              </div>
            ) : viewMode === 'grid' ? (
              properties.length === 0 ? (
                <div className="bg-white border border-[#DDD5CC] rounded-sm p-12 text-center space-y-4">
                  <span className="text-xs uppercase tracking-widest text-[#AC8968] font-bold block">
                    No Matching Residences
                  </span>
                  <h3 className="text-xl font-bold text-[#3E362E]">
                    No properties match your current filter criteria
                  </h3>
                  <p className="text-xs text-[#766B61] max-w-md mx-auto">
                    Try loosening your price bounds or searching across all categories to explore our architectural collection.
                  </p>
                  <button
                    onClick={handleClear}
                    className="inline-block mt-2 bg-[#3E362E] hover:bg-[#865D36] text-white text-xs uppercase tracking-widest px-6 py-2.5 rounded-sm transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((p) => (
                    <PropertyCard key={p._id} property={p} />
                  ))}
                </div>
              )
            ) : (
              <div className="h-[680px] border border-[#DDD5CC] rounded-sm overflow-hidden bg-white shadow-xs">
                <PropertyMap properties={properties} />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}