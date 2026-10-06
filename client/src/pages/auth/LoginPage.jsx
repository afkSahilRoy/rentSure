import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { ArrowRight, UserCheck, Shield, Home, ShoppingBag } from 'lucide-react';
import heroImg from '../../assets/rentsure-hero.jpg';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e, demoEmail, demoPass) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(demoEmail || email, demoPass || password);
      toast.success('Authenticated successfully');

      const from = location.state?.from?.pathname;
      if (from) return navigate(from);

      const u = JSON.parse(localStorage.getItem('user'));
      if (u?.role === 'admin') navigate('/admin');
      else if (u?.role === 'owner') navigate('/my-listings');
      else navigate('/');
    } catch (err) {
      toast.error('Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#F5F1EB] flex items-center justify-center p-4 md:p-8">
      <div className="max-w-4xl w-full bg-white border border-[#DDD5CC] rounded-sm overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-12">
        {/* Left Editorial Visual Column (Desktop) */}
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
                Curated Residences
              </span>
            </div>
          </div>

          <div className="relative z-10 space-y-3">
            <p className="text-sm italic font-light text-[#DDD5CC] leading-relaxed">
              &ldquo;A house is much more than a mere shelter; it should lift us emotionally and spiritually.&rdquo;
            </p>
            <div className="text-[10px] uppercase tracking-widest text-[#AC8968]">
              DIRECT OWNER MARKETPLACE
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="md:col-span-7 p-8 sm:p-10 space-y-8">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#AC8968] font-bold block mb-1">
              ACCOUNT PORTAL
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#3E362E] tracking-tight">
              Sign in to RentSure
            </h2>
            <p className="text-xs text-[#766B61] mt-1">
              Enter your credentials to access your saved properties and inquiries.
            </p>
          </div>

          {/* Quick Demo Access Bar */}
          <div className="p-4 bg-[#F5F1EB] border border-[#DDD5CC] rounded-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-[#766B61] font-bold flex items-center gap-1.5">
                <UserCheck size={12} className="text-[#865D36]" />
                1-Click Demo Accounts
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#AC8968]">Instant Auth</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleLogin(null, 'admin@demo.com', 'password123')}
                className="bg-white hover:bg-[#3E362E] hover:text-white text-[#3E362E] text-[11px] uppercase tracking-wider font-semibold py-2 px-1 border border-[#DDD5CC] rounded-xs transition-colors flex items-center justify-center gap-1"
              >
                <Shield size={11} />
                <span>Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleLogin(null, 'owner@demo.com', 'password123')}
                className="bg-white hover:bg-[#3E362E] hover:text-white text-[#3E362E] text-[11px] uppercase tracking-wider font-semibold py-2 px-1 border border-[#DDD5CC] rounded-xs transition-colors flex items-center justify-center gap-1"
              >
                <Home size={11} />
                <span>Owner</span>
              </button>
              <button
                type="button"
                onClick={() => handleLogin(null, 'buyer@demo.com', 'password123')}
                className="bg-white hover:bg-[#3E362E] hover:text-white text-[#3E362E] text-[11px] uppercase tracking-wider font-semibold py-2 px-1 border border-[#DDD5CC] rounded-xs transition-colors flex items-center justify-center gap-1"
              >
                <ShoppingBag size={11} />
                <span>Buyer</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#766B61] mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                className="w-full bg-[#F5F1EB]/40 border border-[#DDD5CC] text-[#3E362E] text-xs p-3 rounded-sm focus:outline-none focus:border-[#865D36] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#3E362E] hover:bg-[#865D36] text-white text-xs uppercase tracking-widest font-semibold py-3.5 rounded-sm transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight size={14} />
            </button>
          </form>

          <div className="pt-2 border-t border-[#DDD5CC] text-center text-xs text-[#766B61]">
            <span>Don&rsquo;t have a RentSure account? </span>
            <Link to="/register" className="font-semibold text-[#865D36] hover:underline">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}