import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

export default function SearchFilters({ filters, setFilters, onApply, onClear }) {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white border border-[#DDD5CC] rounded-sm p-6 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#DDD5CC]">
        <h3 className="text-xs uppercase tracking-widest font-bold text-[#3E362E]">
          Filter Collection
        </h3>
        <button
          onClick={onClear}
          className="text-[11px] uppercase tracking-wider text-[#766B61] hover:text-[#865D36] flex items-center gap-1 transition-colors"
          title="Reset filters"
        >
          <RotateCcw size={11} />
          <span>Reset</span>
        </button>
      </div>

      {/* Keywords Search */}
      <div>
        <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#766B61] mb-1.5">
          Search Keywords
        </label>
        <div className="relative">
          <input
            name="search"
            value={filters.search || ''}
            onChange={handleChange}
            placeholder="e.g. Sea view, Penthouse..."
            className="w-full bg-[#F5F1EB]/50 border border-[#DDD5CC] text-[#3E362E] placeholder-[#766B61]/60 text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-[#865D36] transition-colors"
          />
          <Search size={13} className="absolute right-3 top-3 text-[#766B61]/60" />
        </div>
      </div>

      {/* City */}
      <div>
        <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#766B61] mb-1.5">
          City / Location
        </label>
        <input
          name="city"
          value={filters.city || ''}
          onChange={handleChange}
          placeholder="e.g. Mumbai, Pune, Bangalore"
          className="w-full bg-[#F5F1EB]/50 border border-[#DDD5CC] text-[#3E362E] placeholder-[#766B61]/60 text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-[#865D36] transition-colors"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#766B61] mb-1.5">
          Listing Intent
        </label>
        <select
          name="category"
          value={filters.category || ''}
          onChange={handleChange}
          className="w-full bg-[#F5F1EB]/50 border border-[#DDD5CC] text-[#3E362E] text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-[#865D36] transition-colors"
        >
          <option value="">All Categories (Rent & Sale)</option>
          <option value="rent">For Rent</option>
          <option value="sale">For Sale</option>
        </select>
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#766B61] mb-1.5">
          Typology
        </label>
        <select
          name="type"
          value={filters.type || ''}
          onChange={handleChange}
          className="w-full bg-[#F5F1EB]/50 border border-[#DDD5CC] text-[#3E362E] text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-[#865D36] transition-colors"
        >
          <option value="">All Typologies</option>
          <option value="apartment">Apartment</option>
          <option value="villa">Independent Villa</option>
          <option value="house">Residential House</option>
          <option value="studio">Studio Flat</option>
          <option value="commercial">Commercial Space</option>
          <option value="plot">Plot / Land</option>
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#766B61] mb-1.5">
          Price Range (₹)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            name="minPrice"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={handleChange}
            className="w-full bg-[#F5F1EB]/50 border border-[#DDD5CC] text-[#3E362E] placeholder-[#766B61]/60 text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-[#865D36] transition-colors"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={handleChange}
            className="w-full bg-[#F5F1EB]/50 border border-[#DDD5CC] text-[#3E362E] placeholder-[#766B61]/60 text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-[#865D36] transition-colors"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="pt-2">
        <button
          onClick={onApply}
          className="w-full bg-[#3E362E] hover:bg-[#865D36] text-white text-xs uppercase tracking-widest font-medium py-3 rounded-sm transition-colors shadow-xs"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}