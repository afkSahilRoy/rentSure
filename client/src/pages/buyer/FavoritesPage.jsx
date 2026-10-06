import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { favoritesAPI } from '../../services/api';
import PropertyCard from '../../components/property/PropertyCard';
import Spinner from '../../components/common/Spinner';
import { Bookmark, ArrowRight } from 'lucide-react';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    favoritesAPI
      .getAll()
      .then((res) => {
        setFavorites(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F5F1EB]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-[#F5F1EB] min-h-screen text-[#3E362E] py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10 pb-6 border-b border-[#DDD5CC]">
          <span className="text-[11px] uppercase tracking-widest text-[#AC8968] font-bold block mb-1">
            PERSONAL PORTFOLIO
          </span>
          <div className="flex justify-between items-baseline">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#3E362E]">
              Saved Residences
            </h1>
            <span className="text-xs uppercase tracking-widest text-[#766B61] font-semibold">
              {String(favorites.length).padStart(2, '0')} Saved
            </span>
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-white border border-[#DDD5CC] rounded-sm p-16 text-center max-w-2xl mx-auto space-y-4 shadow-xs">
            <div className="w-12 h-12 bg-[#F5F1EB] text-[#865D36] rounded-full flex items-center justify-center mx-auto mb-2">
              <Bookmark size={20} />
            </div>
            <h3 className="text-xl font-bold text-[#3E362E]">No Saved Residences Yet</h3>
            <p className="text-xs text-[#766B61] max-w-md mx-auto leading-relaxed">
              Explore our architectural catalogue and click the heart icon on any residence to save it to your private portfolio.
            </p>
            <div className="pt-2">
              <Link
                to="/properties"
                className="inline-flex items-center gap-1.5 bg-[#3E362E] hover:bg-[#865D36] text-white text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded-sm transition-colors"
              >
                <span>Browse Discovery</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((prop) => (
              <PropertyCard key={prop._id} property={prop} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}