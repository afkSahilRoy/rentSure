import React, { useEffect, useState } from 'react';
import { inquiriesAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';
import { MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OwnerInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({});

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

  const handleReply = async (id) => {
    if (!replyText[id] || !replyText[id].trim()) {
      return toast.error('Please write a reply before submitting.');
    }
    try {
      await inquiriesAPI.reply(id, replyText[id]);
      toast.success('Reply submitted to prospective tenant/buyer');
      fetchInquiries();
    } catch (err) {
      toast.error('Error submitting reply');
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
            CLIENT CORRESPONDENCE
          </span>
          <div className="flex justify-between items-baseline">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#3E362E]">
              Property Inquiries
            </h1>
            <span className="text-xs uppercase tracking-widest text-[#766B61] font-semibold">
              {String(inquiries.length).padStart(2, '0')} Received
            </span>
          </div>
        </div>

        {inquiries.length === 0 ? (
          <div className="bg-white border border-[#DDD5CC] rounded-sm p-16 text-center space-y-4 shadow-xs">
            <div className="w-12 h-12 bg-[#F5F1EB] text-[#865D36] rounded-full flex items-center justify-center mx-auto mb-2">
              <MessageSquare size={20} />
            </div>
            <h3 className="text-xl font-bold text-[#3E362E]">No Inquiries Received</h3>
            <p className="text-xs text-[#766B61] max-w-md mx-auto leading-relaxed">
              When prospective tenants or buyers inquire about your listed properties, their messages and direct contact info will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {inquiries.map((inq) => (
              <div
                key={inq._id}
                className="bg-white border border-[#DDD5CC] rounded-sm p-6 shadow-xs space-y-5 hover:border-[#865D36]/60 transition-colors"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-[#DDD5CC]/70">
                  <div className="flex gap-4 items-center">
                    <img
                      src={inq.property?.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300'}
                      alt=""
                      className="w-16 h-16 object-cover rounded-xs border border-[#DDD5CC] shrink-0"
                    />
                    <div>
                      <h3 className="font-bold text-base text-[#3E362E]">
                        <Link to={`/properties/${inq.property?._id}`} className="hover:text-[#865D36] transition-colors">
                          {inq.property?.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-[#766B61]">
                        From: <span className="font-semibold text-[#3E362E]">{inq.buyer?.name}</span> ({inq.buyer?.email}) &bull; Phone: {inq.phone || 'N/A'}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-[#AC8968] mt-0.5 font-medium">
                        Received {new Date(inq.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-xs border self-end sm:self-auto ${
                      inq.status === 'replied'
                        ? 'bg-[#EFE9DF] text-[#865D36] border-[#DDD5CC]'
                        : 'bg-[#F5F1EB] text-[#766B61] border-[#DDD5CC]'
                    }`}
                  >
                    {inq.status}
                  </span>
                </div>

                {/* Message Body */}
                <div className="bg-[#F5F1EB]/70 p-4 rounded-xs border border-[#DDD5CC]/60 text-xs text-[#3E362E] space-y-1">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#766B61] block">
                    Inquiry Message
                  </span>
                  <p className="leading-relaxed">{inq.message}</p>
                </div>

                {/* Reply Form or Completed Reply */}
                {inq.status === 'pending' ? (
                  <div className="space-y-3 pt-2">
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-[#AC8968]">
                      Draft Response
                    </label>
                    <textarea
                      rows={3}
                      className="w-full bg-[#F5F1EB]/40 border border-[#DDD5CC] text-[#3E362E] text-xs p-3 rounded-sm focus:outline-none focus:border-[#865D36] transition-colors"
                      placeholder="Write your direct response to this client..."
                      value={replyText[inq._id] || ''}
                      onChange={(e) => setReplyText({ ...replyText, [inq._id]: e.target.value })}
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleReply(inq._id)}
                        className="bg-[#3E362E] hover:bg-[#865D36] text-white text-xs uppercase tracking-widest font-semibold px-6 py-2.5 rounded-sm transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <Send size={13} />
                        <span>Send Response</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-4 rounded-xs border-l-3 border-[#865D36] border border-[#DDD5CC] text-xs text-[#3E362E] space-y-1 shadow-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-[#865D36] flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        <span>Your Response</span>
                      </span>
                      {inq.repliedAt && (
                        <span className="text-[10px] text-[#766B61]">
                          {new Date(inq.repliedAt).toLocaleString()}
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