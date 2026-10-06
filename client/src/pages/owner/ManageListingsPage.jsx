import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { propertiesAPI } from '../../services/api';
import { Edit2, Trash2, Eye, Plus, Building } from 'lucide-react';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';

export default function ManageListingsPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = () => {
    propertiesAPI
      .getMyListings()
      .then((res) => {
        setProperties(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently remove this property listing?')) {
      try {
        await propertiesAPI.delete(id);
        toast.success('Listing removed successfully');
        fetchProperties();
      } catch (err) {
        toast.error('Error deleting property');
      }
    }
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
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10 pb-6 border-b border-[#DDD5CC] flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#AC8968] font-bold block mb-1">
              OWNER WORKSPACE
            </span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#3E362E]">
              My Listings
            </h1>
          </div>

          <Link
            to="/list-property"
            className="bg-[#3E362E] hover:bg-[#865D36] text-white text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded-sm transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
          >
            <Plus size={15} />
            <span>List New Property</span>
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="bg-white border border-[#DDD5CC] rounded-sm p-16 text-center max-w-xl mx-auto space-y-4 shadow-xs">
            <div className="w-12 h-12 bg-[#F5F1EB] text-[#865D36] rounded-full flex items-center justify-center mx-auto mb-2">
              <Building size={20} />
            </div>
            <h3 className="text-xl font-bold text-[#3E362E]">No Active Listings</h3>
            <p className="text-xs text-[#766B61] leading-relaxed">
              You haven&rsquo;t listed any properties yet. Showcase your residence to qualified buyers and tenants across India.
            </p>
            <div className="pt-2">
              <Link
                to="/list-property"
                className="inline-block bg-[#865D36] hover:bg-[#93785B] text-white text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded-sm transition-colors"
              >
                List Property Now
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {properties.map((p) => (
              <div
                key={p._id}
                className="bg-white border border-[#DDD5CC] rounded-sm p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:border-[#865D36]/60 transition-colors"
              >
                <div className="flex items-center gap-5">
                  <img
                    src={p.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400'}
                    alt={p.title}
                    className="w-24 h-20 object-cover rounded-xs border border-[#DDD5CC] shrink-0"
                  />
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-[#AC8968] font-bold block">
                      {p.category === 'sale' ? 'FOR SALE' : 'FOR RENT'} &bull; {p.type}
                    </span>
                    <h3 className="font-bold text-base text-[#3E362E] hover:text-[#865D36] transition-colors">
                      <Link to={`/properties/${p._id}`}>{p.title}</Link>
                    </h3>
                    <p className="text-xs text-[#766B61]">
                      {p.location?.city} &bull; ₹{Number(p.price || 0).toLocaleString('en-IN')}
                    </p>
                    <div className="flex items-center gap-3 pt-1">
                      <span
                        className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-xs border ${
                          p.status === 'approved'
                            ? 'bg-[#EFE9DF] text-[#865D36] border-[#DDD5CC]'
                            : p.status === 'rejected'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-[#F5F1EB] text-[#766B61] border-[#DDD5CC]'
                        }`}
                      >
                        {p.status}
                      </span>
                      <span className="text-[11px] text-[#766B61] flex items-center gap-1 font-medium">
                        <Eye size={12} />
                        <span>{p.views || 0} views</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <Link
                    to={`/owner/properties/edit/${p._id}`}
                    className="p-2.5 text-[#3E362E] hover:text-[#865D36] hover:bg-[#F5F1EB] border border-[#DDD5CC] rounded-xs transition-colors flex items-center gap-1.5 text-xs font-semibold"
                    title="Edit Listing"
                  >
                    <Edit2 size={14} />
                    <span className="hidden sm:inline">Edit</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="p-2.5 text-[#766B61] hover:text-red-600 hover:bg-red-50 border border-[#DDD5CC] rounded-xs transition-colors"
                    title="Delete Listing"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}