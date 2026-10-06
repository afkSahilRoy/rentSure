import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { Users, Home, AlertCircle, MessageSquare, CheckCircle, XCircle, ArrowUpRight, Shield } from 'lucide-react';
import Spinner from '../../components/common/Spinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI
      .getStats()
      .then((res) => {
        setStats(res.data);
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

  const StatTile = ({ label, value, sublabel }) => (
    <div className="bg-white p-6 rounded-sm border border-[#DDD5CC] shadow-xs flex flex-col justify-between">
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] uppercase tracking-widest font-semibold text-[#766B61]">
          {label}
        </span>
      </div>
      <div>
        <span className="text-3xl md:text-4xl font-bold text-[#3E362E] tracking-tight">
          {value}
        </span>
        {sublabel && (
          <span className="block text-[11px] text-[#AC8968] font-medium mt-1">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-[#F5F1EB] min-h-screen text-[#3E362E] py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10 pb-6 border-b border-[#DDD5CC] flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#AC8968] font-bold block mb-1">
              ADMINISTRATIVE GOVERNANCE
            </span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#3E362E]">
              Platform Intelligence
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/properties"
              className="bg-[#3E362E] hover:bg-[#865D36] text-white text-xs uppercase tracking-widest font-semibold px-5 py-2.5 rounded-sm transition-colors"
            >
              Manage Listings
            </Link>
            <Link
              to="/admin/users"
              className="border border-[#DDD5CC] bg-white hover:bg-[#F5F1EB] text-[#3E362E] text-xs uppercase tracking-widest font-semibold px-5 py-2.5 rounded-sm transition-colors"
            >
              Manage Users
            </Link>
          </div>
        </div>

        {/* Pending Approval Urgent Moderation Banner */}
        {stats.pendingProperties > 0 && (
          <div className="bg-[#EFE9DF] border border-[#AC8968] p-5 rounded-sm mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#865D36] text-white flex items-center justify-center shrink-0">
                <AlertCircle size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#3E362E]">
                  {stats.pendingProperties} Residence Submissions Awaiting Moderation
                </h4>
                <p className="text-xs text-[#766B61] mt-0.5">
                  Review new owner submissions to ensure accurate photography, pricing, and specs before publication.
                </p>
              </div>
            </div>
            <Link
              to="/admin/properties?status=pending"
              className="bg-[#865D36] hover:bg-[#93785B] text-white text-xs uppercase tracking-widest font-semibold px-6 py-2.5 rounded-sm transition-colors shrink-0"
            >
              Open Moderation Queue &rarr;
            </Link>
          </div>
        )}

        {/* 8 Architectural KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-10">
          <StatTile label="Total Users" value={stats.totalUsers} sublabel="Platform participants" />
          <StatTile label="Total Properties" value={stats.totalProperties} sublabel="All inventory" />
          <StatTile label="Awaiting Approval" value={stats.pendingProperties} sublabel="Requires review" />
          <StatTile label="Total Inquiries" value={stats.totalInquiries} sublabel="Direct peer threads" />
          <StatTile label="Approved Active" value={stats.approvedProperties} sublabel="Published in catalog" />
          <StatTile label="Rejected Submissions" value={stats.rejectedProperties} sublabel="Declined listings" />
          <StatTile label="Buyer Accounts" value={stats.buyerCount} sublabel="Prospective clients" />
          <StatTile label="Owner Accounts" value={stats.ownerCount} sublabel="Listing creators" />
        </div>

        {/* Recent Data Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Properties (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-[#DDD5CC] rounded-sm p-6 shadow-xs">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#DDD5CC]">
              <div>
                <h3 className="font-bold text-base text-[#3E362E]">Recent Property Submissions</h3>
                <span className="text-[10px] uppercase tracking-wider text-[#766B61]">Latest 5 records</span>
              </div>
              <Link
                to="/admin/properties"
                className="text-xs uppercase tracking-wider text-[#865D36] font-semibold hover:underline flex items-center gap-1"
              >
                <span>View Full Queue</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>

            <div className="space-y-3">
              {stats.recentProperties?.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center justify-between p-3 rounded-xs border border-[#DDD5CC]/60 hover:bg-[#F5F1EB]/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200'}
                      alt=""
                      className="w-11 h-11 object-cover rounded-xs border border-[#DDD5CC] shrink-0"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[#3E362E] line-clamp-1">{p.title}</h4>
                      <p className="text-[11px] text-[#766B61]">By {p.owner?.name || 'Owner'}</p>
                    </div>
                  </div>

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
                </div>
              ))}
            </div>
          </div>

          {/* Recent Users (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-[#DDD5CC] rounded-sm p-6 shadow-xs">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#DDD5CC]">
              <div>
                <h3 className="font-bold text-base text-[#3E362E]">Recent Registered Users</h3>
                <span className="text-[10px] uppercase tracking-wider text-[#766B61]">Latest 5 members</span>
              </div>
              <Link
                to="/admin/users"
                className="text-xs uppercase tracking-wider text-[#865D36] font-semibold hover:underline flex items-center gap-1"
              >
                <span>All Users</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>

            <div className="space-y-3">
              {stats.recentUsers?.map((u) => (
                <div
                  key={u._id}
                  className="flex items-center justify-between p-3 rounded-xs border border-[#DDD5CC]/60 hover:bg-[#F5F1EB]/40 transition-colors"
                >
                  <div>
                    <h4 className="text-xs font-bold text-[#3E362E]">{u.name}</h4>
                    <p className="text-[11px] text-[#766B61]">{u.email}</p>
                  </div>

                  <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-xs bg-[#F5F1EB] text-[#3E362E] border border-[#DDD5CC]">
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}