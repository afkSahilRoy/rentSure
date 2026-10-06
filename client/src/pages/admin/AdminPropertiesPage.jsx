import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminAPI, propertiesAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Check, X, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Spinner from '../../components/common/Spinner';

export default function AdminPropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentTab = searchParams.get('status') || 'all';

  useEffect(() => {
    fetchProperties();
  }, [currentTab]);

  const fetchProperties = () => {
    setLoading(true);
    adminAPI
      .getProperties({ status: currentTab })
      .then((res) => {
        setProperties(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleStatus = async (id, status) => {
    try {
      await adminAPI.updatePropertyStatus(id, status);
      toast.success(`Listing marked as ${status}`);
      fetchProperties();
    } catch (err) {
      toast.error('Error updating status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this property permanently from the platform?')) {
      try {
        await propertiesAPI.delete(id);
        toast.success('Listing permanently removed');
        fetchProperties();
      } catch (err) {
        toast.error('Error deleting property');
      }
    }
  };

  const tabs = ['all', 'pending', 'approved', 'rejected'];

  return (
    <div className="bg-[#F5F1EB] min-h-screen text-[#3E362E] py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            to="/admin"
            className="text-xs uppercase tracking-widest text-[#766B61] hover:text-[#3E362E] flex items-center gap-1.5 transition-colors font-semibold"
          >
            <ArrowLeft size={14} />
            <span>Return to Dashboard</span>
          </Link>
          <span className="text-[10px] uppercase tracking-widest text-[#AC8968] font-bold">
            MODERATION & INVENTORY
          </span>
        </div>

        <div className="mb-8 pb-4 border-b border-[#DDD5CC]">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#3E362E]">
            Property Inventory
          </h1>
          <p className="text-xs text-[#766B61] mt-1">
            Review submissions, inspect architectural accuracy, and manage publication states.
          </p>
        </div>

        {/* Minimalist Tabs */}
        <div className="flex gap-2 mb-6 border-b border-[#DDD5CC] overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setSearchParams({ status: tab })}
              className={`pb-3 px-4 text-xs uppercase tracking-wider font-semibold transition-all border-b-2 capitalize whitespace-nowrap ${
                currentTab === tab
                  ? 'border-[#865D36] text-[#865D36]'
                  : 'border-transparent text-[#766B61] hover:text-[#3E362E]'
              }`}
            >
              {tab} Residences {tab === 'pending' && <span className="ml-1 text-[10px] bg-[#865D36] text-white px-1.5 py-0.2 rounded-full">!</span>}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-24 bg-white border border-[#DDD5CC] rounded-sm">
            <Spinner />
          </div>
        ) : (
          <div className="bg-white rounded-sm border border-[#DDD5CC] shadow-xs overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5F1EB] border-b border-[#DDD5CC] text-[10px] uppercase tracking-widest text-[#766B61] font-semibold">
                  <th className="p-4">Residence</th>
                  <th className="p-4">Owner Profile</th>
                  <th className="p-4">Typology & City</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD5CC]/60 text-xs">
                {properties.map((p) => (
                  <tr key={p._id} className="hover:bg-[#F5F1EB]/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200'}
                          alt=""
                          className="w-14 h-11 object-cover rounded-xs border border-[#DDD5CC] shrink-0"
                        />
                        <div>
                          <p className="font-bold text-sm text-[#3E362E] line-clamp-1 max-w-xs">
                            <Link to={`/properties/${p._id}`} className="hover:text-[#865D36]">
                              {p.title}
                            </Link>
                          </p>
                          <p className="text-[11px] font-semibold text-[#865D36]">
                            ₹{Number(p.price || 0).toLocaleString('en-IN')}
                            {p.category === 'rent' ? '/mo' : ''}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-xs">
                      <p className="font-semibold text-[#3E362E]">{p.owner?.name || 'Unknown'}</p>
                      <p className="text-[11px] text-[#766B61]">{p.owner?.email || '-'}</p>
                    </td>

                    <td className="p-4 text-xs capitalize text-[#766B61]">
                      {p.location?.city || 'India'} &bull; {p.category} &bull; {p.type}
                    </td>

                    <td className="p-4">
                      <span
                        className={`text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-xs border ${
                          p.status === 'approved'
                            ? 'bg-[#EFE9DF] text-[#865D36] border-[#DDD5CC]'
                            : p.status === 'rejected'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-[#F5F1EB] text-[#766B61] border-[#DDD5CC]'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {p.status !== 'approved' && (
                          <button
                            onClick={() => handleStatus(p._id, 'approved')}
                            className="p-1.5 bg-[#EFE9DF] hover:bg-[#865D36] hover:text-white text-[#865D36] border border-[#DDD5CC] rounded-xs transition-colors"
                            title="Approve Residence"
                          >
                            <Check size={14} />
                          </button>
                        )}
                        {p.status !== 'rejected' && (
                          <button
                            onClick={() => handleStatus(p._id, 'rejected')}
                            className="p-1.5 bg-white hover:bg-red-600 hover:text-white text-red-600 border border-[#DDD5CC] rounded-xs transition-colors"
                            title="Reject Residence"
                          >
                            <X size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="p-1.5 bg-white hover:bg-red-50 text-[#766B61] hover:text-red-600 border border-[#DDD5CC] rounded-xs transition-colors ml-1"
                          title="Delete Listing"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {properties.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-xs text-[#766B61]">
                      No properties found in this moderation category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}