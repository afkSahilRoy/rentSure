import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { favoritesAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function PropertyCard({ property }) {
  const { user } = useAuth();
  const [isFav, setIsFav] = useState(false);
  const fallbackImg = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85";
  const mainImage = property.images && property.images.length > 0 ? property.images[0] : fallbackImg;

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return toast.error('Please login to save properties');
    try {
      const res = await favoritesAPI.toggle(property._id);
      setIsFav(res.data?.favorited);
      toast.success(res.data?.favorited ? 'Added to favorites' : 'Removed from favorites');
    } catch (err) {
      toast.error('Failed to update favorites');
    }
  };

  const formattedPrice = Number(property.price || 0).toLocaleString('en-IN');
  const priceDisplay = property.category === 'rent' ? `₹${formattedPrice}/mo` : `₹${formattedPrice}`;

  return (
    <article className="bg-white border border-[#DDD5CC] rounded-sm overflow-hidden group hover:border-[#865D36] transition-all duration-300 flex flex-col">
      <Link to={`/properties/${property._id}`} className="block relative aspect-[4/3] overflow-hidden bg-[#F5F1EB]">
        <img
          src={mainImage}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Editorial Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest bg-[#3E362E]/90 text-white px-2.5 py-1 rounded-sm backdrop-blur-xs">
            {property.category === 'sale' ? 'For Sale' : 'For Rent'}
          </span>
          {property.featured && (
            <span className="text-[10px] font-semibold uppercase tracking-widest bg-[#865D36] text-white px-2.5 py-1 rounded-sm shadow-xs">
              Featured
            </span>
          )}
        </div>

        {/* Favorite Trigger */}
        {user && user.role === 'buyer' && (
          <button
            onClick={handleFavorite}
            aria-label="Save property"
            className="absolute top-3 right-3 bg-white/90 hover:bg-white text-[#3E362E] p-2 rounded-full transition-all border border-[#DDD5CC]/60 shadow-xs hover:scale-105"
          >
            <Heart
              size={15}
              fill={isFav ? '#865D36' : 'none'}
              stroke={isFav ? '#865D36' : 'currentColor'}
              strokeWidth={2}
            />
          </button>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Metadata String */}
          <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-[#766B61] mb-2 font-medium">
            <span>
              {property.location?.city || 'India'} &bull; {property.type || 'Residential'}
            </span>
            {property.furnishing && (
              <span className="text-[10px] text-[#AC8968]">
                {property.furnishing.replace('-', ' ')}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-base text-[#3E362E] group-hover:text-[#865D36] transition-colors line-clamp-1 mb-2">
            <Link to={`/properties/${property._id}`}>
              {property.title}
            </Link>
          </h3>

          {/* Price */}
          <div className="text-xl font-bold text-[#3E362E] tracking-tight mb-4">
            {priceDisplay}
          </div>
        </div>

        {/* Specs & Link footer */}
        <div className="border-t border-[#DDD5CC]/80 pt-3 flex items-center justify-between text-xs text-[#766B61]">
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-wider font-medium">
            {property.bedrooms > 0 && <span>{property.bedrooms} Beds</span>}
            {property.bathrooms > 0 && <span>{property.bathrooms} Baths</span>}
            {property.area > 0 && <span>{property.area} sq ft</span>}
          </div>

          <Link
            to={`/properties/${property._id}`}
            className="text-[#865D36] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 text-xs font-semibold"
          >
            <span>View</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>

        {/* Status notice if not approved */}
        {property.status && property.status !== 'approved' && (
          <div className="mt-3 text-[10px] uppercase tracking-widest font-bold text-center py-1 rounded-xs border border-[#DDD5CC] bg-[#F5F1EB] text-[#766B61]">
            Status: {property.status}
          </div>
        )}
      </div>
    </article>
  );
}