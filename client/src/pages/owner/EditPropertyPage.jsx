import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { propertiesAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';
import { ArrowLeft, ArrowRight, Plus, Image as ImageIcon } from 'lucide-react';

export default function EditPropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState(null);

  const allAmenities = [
    'WiFi',
    'Parking',
    'Pool',
    'Gym',
    'Security',
    'Balcony',
    'Power Backup',
    'Lift',
    'Garden',
    'Playground',
  ];

  useEffect(() => {
    propertiesAPI
      .getById(id)
      .then((res) => {
        const p = res.data;
        setData({
          title: p.title || '',
          description: p.description || '',
          category: p.category || 'rent',
          type: p.type || 'apartment',
          price: p.price || '',
          address: p.location?.address || '',
          city: p.location?.city || '',
          state: p.location?.state || '',
          zipCode: p.location?.zipCode || '',
          lat: p.location?.coordinates?.lat || '',
          lng: p.location?.coordinates?.lng || '',
          bedrooms: p.bedrooms || 0,
          bathrooms: p.bathrooms || 0,
          area: p.area || '',
          furnishing: p.furnishing || 'unfurnished',
          amenities: p.amenities || [],
          images: p.images?.length ? p.images : [''],
        });
        setLoading(false);
      })
      .catch(() => {
        toast.error('Error fetching property details');
        navigate('/my-listings');
      });
  }, [id, navigate]);

  const handleAmenity = (am) => {
    if (data.amenities.includes(am)) {
      setData({ ...data, amenities: data.amenities.filter((a) => a !== am) });
    } else {
      setData({ ...data, amenities: [...data.amenities, am] });
    }
  };

  const handleImageChange = (index, value) => {
    const newImgs = [...data.images];
    newImgs[index] = value;
    setData({ ...data, images: newImgs });
  };

  const addImageField = () => {
    if (data.images.length < 10) setData({ ...data, images: [...data.images, ''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        location: {
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          coordinates: { lat: Number(data.lat || 19.076), lng: Number(data.lng || 72.877) },
        },
      };
      payload.images = data.images.filter((img) => img.trim() !== '');
      await propertiesAPI.update(id, payload);
      toast.success('Listing details updated successfully!');
      navigate('/my-listings');
    } catch (err) {
      toast.error('Failed to update property');
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F5F1EB]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-[#F5F1EB] min-h-screen text-[#3E362E] py-10 md:py-14">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8 flex items-center justify-between">
          <Link
            to="/my-listings"
            className="text-xs uppercase tracking-widest text-[#766B61] hover:text-[#3E362E] flex items-center gap-1.5 transition-colors font-semibold"
          >
            <ArrowLeft size={14} />
            <span>Return to Workspace</span>
          </Link>
          <span className="text-[10px] uppercase tracking-widest text-[#AC8968] font-bold">
            EDITING RESIDENCE #{id.substring(id.length - 6).toUpperCase()}
          </span>
        </div>

        <div className="mb-8 pb-4 border-b border-[#DDD5CC]">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#3E362E]">
            Edit Listing Details
          </h1>
          <p className="text-xs text-[#766B61] mt-1">
            Update pricing, specifications, or architectural photography for this residence.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10 bg-white p-8 md:p-10 rounded-sm border border-[#DDD5CC] shadow-xs">
          {/* Section 1: Basic Information */}
          <section className="space-y-5">
            <div className="border-b border-[#DDD5CC] pb-2">
              <span className="text-[10px] uppercase tracking-widest text-[#AC8968] font-bold">SECTION 01</span>
              <h2 className="text-lg font-bold text-[#3E362E]">Primary Information</h2>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#766B61] mb-1">
                Property Title
              </label>
              <input
                required
                className="w-full bg-[#F5F1EB]/40 border border-[#DDD5CC] text-[#3E362E] text-xs p-3 rounded-sm focus:outline-none focus:border-[#865D36] transition-colors"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#766B61] mb-1">
                Editorial Description
              </label>
              <textarea
                required
                rows={4}
                className="w-full bg-[#F5F1EB]/40 border border-[#DDD5CC] text-[#3E362E] text-xs p-3 rounded-sm focus:outline-none focus:border-[#865D36] transition-colors leading-relaxed"
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#766B61] mb-1">
                  Intent
                </label>
                <select
                  className="w-full bg-[#F5F1EB]/40 border border-[#DDD5CC] text-[#3E362E] text-xs p-3 rounded-sm focus:outline-none focus:border-[#865D36] transition-colors"
                  value={data.category}
                  onChange={(e) => setData({ ...data, category: e.target.value })}
                >
                  <option value="rent">For Rent</option>
                  <option value="sale">For Sale</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#766B61] mb-1">
                  Typology
                </label>
                <select
                  className="w-full bg-[#F5F1EB]/40 border border-[#DDD5CC] text-[#3E362E] text-xs p-3 rounded-sm focus:outline-none focus:border-[#865D36] transition-colors"
                  value={data.type}
                  onChange={(e) => setData({ ...data, type: e.target.value })}
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="studio">Studio</option>
                  <option value="commercial">Commercial</option>
                  <option value="plot">Plot</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#766B61] mb-1">
                  Valuation / Price (₹)
                </label>
                <input
                  type="number"
                  required
                  className="w-full bg-[#F5F1EB]/40 border border-[#DDD5CC] text-[#3E362E] text-xs p-3 rounded-sm focus:outline-none focus:border-[#865D36] transition-colors"
                  value={data.price}
                  onChange={(e) => setData({ ...data, price: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* Section 2: Location */}
          <section className="space-y-5">
            <div className="border-b border-[#DDD5CC] pb-2">
              <span className="text-[10px] uppercase tracking-widest text-[#AC8968] font-bold">SECTION 02</span>
              <h2 className="text-lg font-bold text-[#3E362E]">Geographic Context</h2>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#766B61] mb-1">
                Street Address
              </label>
              <input
                required
                className="w-full bg-[#F5F1EB]/40 border border-[#DDD5CC] text-[#3E362E] text-xs p-3 rounded-sm focus:outline-none focus:border-[#865D36] transition-colors"
                value={data.address}
                onChange={(e) => setData({ ...data, address: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#766B61] mb-1">
                  City
                </label>
                <input
                  required
                  className="w-full bg-[#F5F1EB]/40 border border-[#DDD5CC] text-[#3E362E] text-xs p-3 rounded-sm focus:outline-none focus:border-[#865D36] transition-colors"
                  value={data.city}
                  onChange={(e) => setData({ ...data, city: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#766B61] mb-1">
                  State
                </label>
                <input
                  className="w-full bg-[#F5F1EB]/40 border border-[#DDD5CC] text-[#3E362E] text-xs p-3 rounded-sm focus:outline-none focus:border-[#865D36] transition-colors"
                  value={data.state}
                  onChange={(e) => setData({ ...data, state: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* Section 3: Details */}
          <section className="space-y-5">
            <div className="border-b border-[#DDD5CC] pb-2">
              <span className="text-[10px] uppercase tracking-widest text-[#AC8968] font-bold">SECTION 03</span>
              <h2 className="text-lg font-bold text-[#3E362E]">Structural Details</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#766B61] mb-1">
                  Bedrooms
                </label>
                <select
                  className="w-full bg-[#F5F1EB]/40 border border-[#DDD5CC] text-[#3E362E] text-xs p-3 rounded-sm focus:outline-none focus:border-[#865D36] transition-colors"
                  value={data.bedrooms}
                  onChange={(e) => setData({ ...data, bedrooms: e.target.value })}
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n}>
                      {n === 0 ? 'Studio / 0' : n}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#766B61] mb-1">
                  Bathrooms
                </label>
                <select
                  className="w-full bg-[#F5F1EB]/40 border border-[#DDD5CC] text-[#3E362E] text-xs p-3 rounded-sm focus:outline-none focus:border-[#865D36] transition-colors"
                  value={data.bathrooms}
                  onChange={(e) => setData({ ...data, bathrooms: e.target.value })}
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#766B61] mb-1">
                  Area (Sq Ft)
                </label>
                <input
                  type="number"
                  className="w-full bg-[#F5F1EB]/40 border border-[#DDD5CC] text-[#3E362E] text-xs p-3 rounded-sm focus:outline-none focus:border-[#865D36] transition-colors"
                  value={data.area}
                  onChange={(e) => setData({ ...data, area: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#766B61] mb-1">
                  Furnishing
                </label>
                <select
                  className="w-full bg-[#F5F1EB]/40 border border-[#DDD5CC] text-[#3E362E] text-xs p-3 rounded-sm focus:outline-none focus:border-[#865D36] transition-colors"
                  value={data.furnishing}
                  onChange={(e) => setData({ ...data, furnishing: e.target.value })}
                >
                  <option value="unfurnished">Unfurnished</option>
                  <option value="semi-furnished">Semi-furnished</option>
                  <option value="fully-furnished">Fully-furnished</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section 4: Amenities */}
          <section className="space-y-4">
            <div className="border-b border-[#DDD5CC] pb-2">
              <span className="text-[10px] uppercase tracking-widest text-[#AC8968] font-bold">SECTION 04</span>
              <h2 className="text-lg font-bold text-[#3E362E]">Amenities & Features</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
              {allAmenities.map((am) => (
                <label
                  key={am}
                  className={`flex items-center gap-2.5 p-3 rounded-sm border cursor-pointer text-xs font-semibold transition-colors ${
                    data.amenities.includes(am)
                      ? 'bg-[#EFE9DF] border-[#865D36] text-[#865D36]'
                      : 'bg-[#F5F1EB]/40 border-[#DDD5CC] text-[#766B61] hover:border-[#865D36]/60'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={data.amenities.includes(am)}
                    onChange={() => handleAmenity(am)}
                  />
                  <span>{am}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Section 5: Photography */}
          <section className="space-y-4">
            <div className="border-b border-[#DDD5CC] pb-2 flex justify-between items-end">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#AC8968] font-bold">SECTION 05</span>
                <h2 className="text-lg font-bold text-[#3E362E]">Photography & Visuals</h2>
              </div>
              {data.images.length < 10 && (
                <button
                  type="button"
                  onClick={addImageField}
                  className="text-xs uppercase tracking-wider text-[#865D36] font-bold hover:underline flex items-center gap-1"
                >
                  <Plus size={13} />
                  <span>Add Another URL</span>
                </button>
              )}
            </div>

            <div className="space-y-3">
              {data.images.map((img, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <input
                    className="flex-1 bg-[#F5F1EB]/40 border border-[#DDD5CC] text-[#3E362E] text-xs p-3 rounded-sm focus:outline-none focus:border-[#865D36] transition-colors"
                    value={img}
                    onChange={(e) => handleImageChange(i, e.target.value)}
                  />
                  {img ? (
                    <img
                      src={img}
                      alt=""
                      className="w-11 h-11 object-cover rounded-xs border border-[#DDD5CC] shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 bg-[#F5F1EB] rounded-xs border border-[#DDD5CC] flex items-center justify-center text-[#766B61] shrink-0">
                      <ImageIcon size={16} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Submit */}
          <div className="pt-4 border-t border-[#DDD5CC]">
            <button
              disabled={submitting}
              type="submit"
              className="w-full bg-[#3E362E] hover:bg-[#865D36] text-white text-xs uppercase tracking-widest font-semibold py-4 rounded-sm transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>{submitting ? 'Updating Listing...' : 'Save & Publish Changes'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}