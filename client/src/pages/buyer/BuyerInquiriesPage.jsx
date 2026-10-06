import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { inquiriesAPI } from '../../services/api';
import { Trash2, MessageSquare, ArrowUpRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';

export default function BuyerInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = () => {
    inquiriesAPI
      .getAll()
      .then((res) => {
        setInquiries(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this inquiry record?')) {
      try {
        await inquiriesAPI.delete(id);
        toast.success('Inquiry record deleted');
        fetchInquiries();
      } catch (err) {
        toast.error('Error deleting inquiry');
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
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-10 pb-6 border-b border-[#DDD5CC]">
          <span className="text-[11px] uppercase tracking-widest text-[#AC8968] font-bold block mb-1">
            COMMUNICATION THREADS
          </span>
          <div className="flex justify-between items-baseline">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#3E362E]">
              My Inquiries
            </h1>
            <span className="text-xs uppercase tracking-widest text-[#766B61] font-semibold">
              {String(inquiries.length).padStart(2, '0')} Sent
            </span>
          </div>
        </div>

        {inquiries.length === 0 ? (
          <div className="bg-white border border-[#DDD5CC] rounded-sm p-16 text-center space-y-4 shadow-xs">
            <div className="w-12 h-12 bg-[#F5F1EB] text-[#865D36] rounded-full flex items-center justify-center mx-auto mb-2">
              <MessageSquare size={20} />
            </div>
            <h3 className="text-xl font-bold text-[#3E362E]">No Active Inquiries</h3>
            <p className="text-xs text-[#766B61] max-w-md mx-auto leading-relaxed">
              When you submit a private inquiry on any residence, your message and owner replies will be tracked here.
            </p>
            <div className="pt-2">
              <Link
                to="/properties"
                className="inline-block bg-[#3E362E] hover:bg-[#865D36] text-white text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded-sm transition-colors"
              >
                Browse Residences
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {inquiries.map((inq) => (
              <div
                key={inq._id}
                className="bg-white border border-[#DDD5CC] rounded-sm p-6 shadow-xs space-y-4 hover:border-[#865D36]/60 transition-colors"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-[#DDD5CC]/70">
                  <div className="flex gap-4 items-center">
                    {inq.property?.images?.[0] ? (
                      <img
                        src={inq.property.images[0]}
                        alt=""
                        className="w-16 h-16 object-cover rounded-xs border border-[#DDD5CC] shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-[#F5F1EB] rounded-xs flex items-center justify-center text-xs text-[#766B61]">
                        No img
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-base text-[#3E362E]">
                        <Link
                          to={`/properties/${inq.property?._id}`}
                          className="hover:text-[#865D36] transition-colors flex items-center gap-1"
                        >
                          <span>{inq.property?.title || 'Property'}</span>
                          <ArrowUpRight size={13} />
                        </Link>
                      </h3>
                      <p className="text-xs text-[#766B61]">
                        {inq.property?.location?.city} &bull; ₹{Number(inq.property?.price || 0).toLocaleString('en-IN')}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-[#AC8968] mt-0.5 font-medium">
                        Initiated {new Date(inq.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span
                      className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-xs ${
                        inq.status === 'replied'
                          ? 'bg-[#EFE9DF] text-[#865D36] border border-[#DDD5CC]'
                          : 'bg-[#F5F1EB] text-[#766B61] border border-[#DDD5CC]'
                      }`}
                    >
                      {inq.status}
                    </span>
                    <button
                      onClick={() => handleDelete(inq._id)}
                      className="text-[#766B61] hover:text-red-600 p-1 rounded-xs transition-colors"
                      title="Delete thread"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* My message */}
                <div className="bg-[#F5F1EB]/70 p-4 rounded-xs border border-[#DDD5CC]/60 text-xs text-[#3E362E] space-y-1">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#766B61] block">
                    Your Inquiry
                  </span>
                  <p className="leading-relaxed">{inq.message}</p>
                </div>

                {/* Owner reply if available */}
                {inq.status === 'replied' && inq.reply && (
                  <div className="bg-white p-4 rounded-xs border-l-3 border-[#865D36] border border-[#DDD5CC] text-xs text-[#3E362E] space-y-1 shadow-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-[#865D36]">
                        Reply from Owner ({inq.owner?.name || 'Property Owner'})
                      </span>
                      {inq.repliedAt && (
                        <span className="text-[10px] text-[#766B61]">
                          {new Date(inq.repliedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="leading-relaxed pt-1 font-medium">{inq.reply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}