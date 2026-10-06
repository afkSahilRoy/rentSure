import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { propertiesAPI, inquiriesAPI, favoritesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Heart, Check, ArrowLeft, Send, X, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';
import PropertyMap from '../../components/property/PropertyMap';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [inquiry, setInquiry] = useState({ message: '', phone: '', email: '' });

  useEffect(() => {
    propertiesAPI
      .getById(id)
      .then((res) => {
        setProperty(res.data);
        if (res.data.images?.length > 0) setMainImage(res.data.images[0]);
        if (user) {
          setInquiry({
            message: 'I am interested in this residence. Please share further viewing details.',
            phone: user.phone || '',
            email: user.email || '',
          });
          favoritesAPI
            .check(id)
            .then((favRes) => setIsFavorited(favRes.data?.favorited || false))
            .catch(() => {});
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id, user]);

  const handleFavorite = async () => {
    if (!user) return toast.error('Please login to save properties');
    try {
      const res = await favoritesAPI.toggle(id);
      setIsFavorited(res.data?.favorited);
      toast.success(res.data?.favorited ? 'Added to favorites' : 'Removed from favorites');
    } catch (err) {
      toast.error('Error updating favorites');
    }
  };

  const handleInquiry = async (e) => {
    e.preventDefault();
    try {
      await inquiriesAPI.create({ ...inquiry, propertyId: id });
      toast.success('Inquiry submitted to property owner!');
      setShowModal(false);
    } catch (err) {
      toast.error('Failed to submit inquiry');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F5F1EB]">
        <Spinner />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center space-y-4 bg-[#F5F1EB]">
        <h2 className="text-2xl font-bold text-[#3E362E]">Residence Not Found</h2>
        <p className="text-xs text-[#766B61]">This listing may have been archived or removed by its owner.</p>
        <Link
          to="/properties"
          className="inline-block mt-4 text-xs uppercase tracking-widest bg-[#3E362E] text-white px-6 py-3 rounded-sm"
        >
          Return to Properties
        </Link>
      </div>
    );
  }

  const formattedPrice = Number(property.price || 0).toLocaleString('en-IN');
  const priceDisplay = property.category === 'rent' ? `₹${formattedPrice} / month` : `₹${formattedPrice}`;

  return (
    <div className="bg-[#F5F1EB] min-h-screen text-[#3E362E] py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/properties"
            className="text-xs uppercase tracking-widest text-[#766B61] hover:text-[#3E362E] flex items-center gap-1.5 transition-colors font-semibold"
          >
            <ArrowLeft size={14} />
            <span>Back to Discovery</span>
          </Link>

          <div className="text-[11px] uppercase tracking-widest text-[#AC8968] font-bold">
            {property.category === 'sale' ? 'FOR SALE' : 'FOR RENT'} &bull; {property.type}
          </div>
        </div>

        {/* Gallery Section */}
        <div className="mb-10 space-y-3">
          <div className="aspect-[16/9] md:aspect-[21/9] w-full rounded-sm overflow-hidden bg-white border border-[#DDD5CC]">
            <img
              src={mainImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85'}
              alt={property.title}
              className="w-full h-full object-cover transition-all duration-500"
            />
          </div>

          {property.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {property.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={`w-24 h-16 shrink-0 rounded-xs overflow-hidden border-2 transition-all ${
                    mainImage === img ? 'border-[#865D36]' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Details (Left 8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Header Block */}
            <div className="border-b border-[#DDD5CC] pb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
                <div>
                  <span className="text-[11px] uppercase tracking-widest text-[#AC8968] font-semibold block mb-1">
                    {property.location?.city}, {property.location?.state || 'India'}
                  </span>
                  <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#3E362E]">
                    {property.title}
                  </h1>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-[#865D36] tracking-tight shrink-0">
                  {priceDisplay}
                </div>
              </div>

              <p className="text-xs text-[#766B61] flex items-center gap-1.5 font-medium">
                <MapPin size={14} className="text-[#865D36]" />
                <span>{property.location?.address}, {property.location?.city} {property.location?.zipCode && `— ${property.location.zipCode}`}</span>
              </p>
            </div>

            {/* Key Property Architectural Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-white border border-[#DDD5CC] rounded-sm">
              <div>
                <span className="block text-[10px] uppercase tracking-widest text-[#766B61] font-semibold">Bedrooms</span>
                <span className="text-xl font-bold text-[#3E362E]">{property.bedrooms || 'Studio'}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-widest text-[#766B61] font-semibold">Bathrooms</span>
                <span className="text-xl font-bold text-[#3E362E]">{property.bathrooms || '1'}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-widest text-[#766B61] font-semibold">Area</span>
                <span className="text-xl font-bold text-[#3E362E]">{property.area ? `${property.area} sq ft` : 'N/A'}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-widest text-[#766B61] font-semibold">Furnishing</span>
                <span className="text-sm font-bold text-[#3E362E] capitalize mt-1 block">
                  {property.furnishing ? property.furnishing.replace('-', ' ') : 'Unfurnished'}
                </span>
              </div>
            </div>

            {/* Overview / Description */}
            <div className="space-y-4">
              <h2 className="text-xs uppercase tracking-widest text-[#AC8968] font-bold">
                Editorial Overview
              </h2>
              <div className="bg-white p-8 border border-[#DDD5CC] rounded-sm">
                <p className="text-sm md:text-base text-[#3E362E]/90 leading-relaxed whitespace-pre-line font-normal">
                  {property.description}
                </p>
              </div>
            </div>

            {/* Amenities Grid */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xs uppercase tracking-widest text-[#AC8968] font-bold">
                  Curated Amenities & Features
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white p-6 border border-[#DDD5CC] rounded-sm">
                  {property.amenities.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs font-semibold text-[#3E362E]">
                      <span className="w-5 h-5 rounded-xs bg-[#F5F1EB] text-[#865D36] flex items-center justify-center shrink-0">
                        <Check size={12} strokeWidth={2.5} />
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location & Google Map */}
            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <h2 className="text-xs uppercase tracking-widest text-[#AC8968] font-bold">
                  Geographic Context & Map
                </h2>
                <span className="text-xs text-[#766B61] font-medium">
                  {property.location?.city}, India
                </span>
              </div>
              <div className="h-80 border border-[#DDD5CC] rounded-sm overflow-hidden bg-white shadow-xs">
                <PropertyMap properties={[property]} />
              </div>
            </div>
          </div>

          {/* Right Action Sidebar (4 cols) */}
          <aside className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="bg-white border border-[#DDD5CC] p-7 rounded-sm shadow-xs space-y-6">
              <div className="border-b border-[#DDD5CC] pb-4">
                <span className="text-[10px] uppercase tracking-widest text-[#AC8968] font-bold block mb-1">
                  DIRECT LISTING
                </span>
                <h3 className="text-lg font-bold text-[#3E362E]">Owner Contact</h3>
                <p className="text-sm font-semibold text-[#865D36] mt-1">{property.owner?.name}</p>
                {user && property.owner?.phone && (
                  <p className="text-xs text-[#766B61] mt-0.5">{property.owner.phone}</p>
                )}
              </div>

              <div className="space-y-3 text-xs text-[#766B61]">
                <div className="flex items-center gap-2 text-[11px]">
                  <ShieldCheck size={14} className="text-[#865D36]" />
                  <span>Direct connection with property owner</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <ShieldCheck size={14} className="text-[#865D36]" />
                  <span>Zero brokerage or third-party commission</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => {
                    if (!user) {
                      toast.error('Please login to send an inquiry');
                      navigate('/login');
                      return;
                    }
                    setShowModal(true);
                  }}
                  className="w-full bg-[#3E362E] hover:bg-[#865D36] text-white py-3.5 px-4 rounded-sm text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <Send size={14} />
                  <span>Send Direct Inquiry</span>
                </button>

                <button
                  onClick={handleFavorite}
                  className={`w-full py-3 px-4 rounded-sm text-xs uppercase tracking-widest font-semibold transition-all border flex items-center justify-center gap-2 ${
                    isFavorited
                      ? 'bg-[#F5F1EB] border-[#865D36] text-[#865D36]'
                      : 'border-[#DDD5CC] text-[#3E362E] hover:border-[#865D36]'
                  }`}
                >
                  <Heart
                    size={14}
                    fill={isFavorited ? '#865D36' : 'none'}
                    stroke={isFavorited ? '#865D36' : 'currentColor'}
                  />
                  <span>{isFavorited ? 'Saved in Favorites' : 'Save to Favorites'}</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Inquiry Dialog Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#3E362E]/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white border border-[#DDD5CC] rounded-sm p-8 max-w-md w-full shadow-xl space-y-6">
            <div className="flex justify-between items-start border-b border-[#DDD5CC] pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#AC8968] font-bold block mb-1">
                  DIRECT CONCIERGE
                </span>
                <h3 className="text-xl font-bold text-[#3E362E]">Send Inquiry to Owner</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#766B61] hover:text-[#3E362E] p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleInquiry} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#766B61] mb-1">
                  Message to Owner
                </label>
                <textarea
                  required
                  rows={4}
                  value={inquiry.message}
                  onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })}
                  placeholder="Share your interest, requested move-in date, or questions..."
                  className="w-full bg-[#F5F1EB]/50 border border-[#DDD5CC] text-[#3E362E] text-xs p-3 rounded-sm focus:outline-none focus:border-[#865D36]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#766B61] mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={inquiry.phone}
                  onChange={(e) => setInquiry({ ...inquiry, phone: e.target.value })}
                  placeholder="+91-9876543210"
                  className="w-full bg-[#F5F1EB]/50 border border-[#DDD5CC] text-[#3E362E] text-xs p-3 rounded-sm focus:outline-none focus:border-[#865D36]"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#865D36] hover:bg-[#93785B] text-white text-xs uppercase tracking-widest font-semibold py-3 rounded-sm transition-colors"
                >
                  Send Inquiry
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 border border-[#DDD5CC] text-[#766B61] hover:text-[#3E362E] text-xs uppercase tracking-widest font-semibold py-3 rounded-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}