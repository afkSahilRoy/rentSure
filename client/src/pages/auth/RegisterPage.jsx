import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { ArrowRight } from 'lucide-react';
import heroImg from '../../assets/rentsure-hero.jpg';
import rentsureIcon from '../../assets/iconshelf-bi-r-circle-fill-128px.svg';

export default function RegisterPage() {
  const [data, setData] = useState({ name: '', email: '', password: '', role: 'buyer', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await register(data);
      toast.success('Registration completed successfully');
      navigate('/');
    } catch (err) {
      toast.error('Registration failed. Please check information.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#F5F1EB] flex items-center justify-center p-4 md:p-8">
      <div className="max-w-4xl w-full bg-white border border-[#DDD5CC] rounded-sm overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-12">
        {/* Left Column (Desktop) */}
        <div className="hidden md:flex md:col-span-5 relative bg-[#3E362E] text-white p-8 flex-col justify-between overflow-hidden">
          <img
            src={heroImg}
            alt="RentSure Building"
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
          <div className="relative z-10 flex items-center gap-2.5">
            <svg
              className="w-7 h-7 text-[#AC8968] shrink-0"
              viewBox="2 2.5 8 8"
              fill="currentColor"
            >
              <path d="M3 10V3h4.385q.69 0 1.153.463T9 4.615V5.85q0 .466-.37.886q-.368.42-.907.541L8.885 10H7.846l-1.15-2.65H4V10zm1-3.65h3.385q.269 0 .442-.173T8 5.735v-1.12q0-.269-.173-.442T7.385 4H4z" />
            </svg>
            <div>
              <span className="text-xl font-bold tracking-tight">RentSure</span>
              <span className="block text-[10px] uppercase tracking-widest text-[#AC8968] font-semibold mt-0.5">
                Direct Real Estate
              </span>
            </div>
          </div>

          <div className="relative z-10 space-y-3">
            <p className="text-sm italic font-light text-[#DDD5CC] leading-relaxed">
              &ldquo;Join a community built around transparent property transactions and verified architectural spaces.&rdquo;
            </p>
            <div className="text-[10px] uppercase tracking-widest text-[#AC8968]">
              BUYERS & OWNERS
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="md:col-span-7 p-8 sm:p-10 space-y-6">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#AC8968] font-bold block mb-1">
              JOIN THE PLATFORM
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#3E362E] tracking-tight">
              Create an Account
            </h2>
            <p className="text-xs text-[#766B61] mt-1">
              Select your primary intent to customize your experience on RentSure.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#766B61] mb-1">
                Full Legal Name
              </label>
              <input
                type="text"
                required
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                placeholder="e.g. Rahul Verma"
                className="w-full bg-[#F5F1EB]/40 border border-[#DDD5CC] text-[#3E362E] text-xs p-3 rounded-sm focus:outline-none focus:border-[#865D36] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#766B61] mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                placeholder="name@domain.com"
                className="w-full bg-[#F5F1EB]/40 border border-[#DDD5CC] text-[#3E362E] text-xs p-3 rounded-sm focus:outline-none focus:border-[#865D36] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#766B61] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                placeholder="Minimum 6 characters"
                className="w-full bg-[#F5F1EB]/40 border border-[#DDD5CC] text-[#3E362E] text-xs p-3 rounded-sm focus:outline-none focus:border-[#865D36] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#766B61] mb-1">
                Account Purpose
              </label>
              <select
                value={data.role}
                onChange={(e) => setData({ ...data, role: e.target.value })}
                className="w-full bg-[#F5F1EB]/40 border border-[#DDD5CC] text-[#3E362E] text-xs p-3 rounded-sm focus:outline-none focus:border-[#865D36] transition-colors"
              >
                <option value="buyer">Buyer / Tenant (Seeking residences to rent or purchase)</option>
                <option value="owner">Property Owner (Listing and managing residences)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#3E362E] hover:bg-[#865D36] text-white text-xs uppercase tracking-widest font-semibold py-3.5 rounded-sm transition-colors flex items-center justify-center gap-2 shadow-xs mt-2"
            >
              <span>{isSubmitting ? 'Registering...' : 'Complete Registration'}</span>
              <ArrowRight size={14} />
            </button>
          </form>

          <div className="pt-2 border-t border-[#DDD5CC] text-center text-xs text-[#766B61]">
            <span>Already have an account? </span>
            <Link to="/login" className="font-semibold text-[#865D36] hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}