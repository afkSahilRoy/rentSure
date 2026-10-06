import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import rentsureIcon from '../../assets/iconshelf-bi-r-circle-fill-128px.svg';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `text-xs uppercase tracking-widest transition-colors py-1 ${
      isActive
        ? 'text-[#F5F1EB] border-b border-[#AC8968] font-medium'
        : 'text-[#DDD5CC] hover:text-white'
    }`;

  return (
    <header className="bg-[#3E362E] text-[#F5F1EB] sticky top-0 z-50 border-b border-[#52483E]/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <svg
            className="w-[34px] h-[34px] text-[#AC8968] group-hover:text-[#F5F1EB] transition-colors shrink-0"
            viewBox="2 2.5 8 8"
            fill="currentColor"
          >
            <path d="M3 10V3h4.385q.69 0 1.153.463T9 4.615V5.85q0 .466-.37.886q-.368.42-.907.541L8.885 10H7.846l-1.15-2.65H4V10zm1-3.65h3.385q.269 0 .442-.173T8 5.735v-1.12q0-.269-.173-.442T7.385 4H4z" />
          </svg>
          <span className="text-2xl font-bold tracking-tight text-white group-hover:text-[#AC8968] transition-colors">
            RentSure
          </span>
          <span className="text-[10px] tracking-widest uppercase text-[#AC8968] font-medium hidden sm:inline border-l border-[#52483E] pl-2.5 ml-0.5">
            ARCHITECTURAL LIVING
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/properties" className={navLinkClass}>
            Properties
          </NavLink>

          {user && user.role === 'buyer' && (
            <>
              <NavLink to="/favorites" className={navLinkClass}>
                Favorites
              </NavLink>
              <NavLink to="/inquiries" className={navLinkClass}>
                Inquiries
              </NavLink>
            </>
          )}

          {user && user.role === 'owner' && (
            <>
              <NavLink to="/list-property" className={navLinkClass}>
                List Property
              </NavLink>
              <NavLink to="/my-listings" className={navLinkClass}>
                My Listings
              </NavLink>
              <NavLink to="/owner/inquiries" className={navLinkClass}>
                Inquiries
              </NavLink>
            </>
          )}

          {user && user.role === 'admin' && (
            <>
              <NavLink to="/admin" className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/admin/properties" className={navLinkClass}>
                Manage Listings
              </NavLink>
              <NavLink to="/admin/users" className={navLinkClass}>
                Users
              </NavLink>
            </>
          )}
        </nav>

        {/* Desktop Auth / User Controls */}
        <div className="hidden md:flex items-center gap-5">
          {!user ? (
            <>
              <Link
                to="/login"
                className="text-xs uppercase tracking-widest text-[#DDD5CC] hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs uppercase tracking-widest bg-[#865D36] hover:bg-[#93785B] text-white px-5 py-2.5 rounded-sm transition-all flex items-center gap-1 shadow-sm font-medium"
              >
                Register
                <ArrowUpRight size={14} />
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4 pl-4 border-l border-[#52483E]">
              <div className="flex flex-col text-right">
                <span className="text-xs font-medium text-white">{user.name}</span>
                <span className="text-[10px] uppercase tracking-wider text-[#AC8968]">
                  {user.role}
                </span>
              </div>
              <button
                onClick={logout}
                className="text-xs uppercase tracking-wider text-[#DDD5CC] hover:text-[#AC8968] transition-colors py-1 px-2 border border-transparent hover:border-[#52483E] rounded-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          className="md:hidden text-white p-2 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-[#352E27] border-t border-[#52483E] px-6 py-6 flex flex-col gap-4 animate-in fade-in duration-150">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="text-sm uppercase tracking-wider text-white py-1 hover:text-[#AC8968]"
          >
            Home
          </Link>
          <Link
            to="/properties"
            onClick={() => setIsOpen(false)}
            className="text-sm uppercase tracking-wider text-white py-1 hover:text-[#AC8968]"
          >
            Properties
          </Link>

          {user && user.role === 'buyer' && (
            <>
              <Link
                to="/favorites"
                onClick={() => setIsOpen(false)}
                className="text-sm uppercase tracking-wider text-white py-1 hover:text-[#AC8968]"
              >
                Favorites
              </Link>
              <Link
                to="/inquiries"
                onClick={() => setIsOpen(false)}
                className="text-sm uppercase tracking-wider text-white py-1 hover:text-[#AC8968]"
              >
                Inquiries
              </Link>
            </>
          )}

          {user && user.role === 'owner' && (
            <>
              <Link
                to="/list-property"
                onClick={() => setIsOpen(false)}
                className="text-sm uppercase tracking-wider text-white py-1 hover:text-[#AC8968]"
              >
                List Property
              </Link>
              <Link
                to="/my-listings"
                onClick={() => setIsOpen(false)}
                className="text-sm uppercase tracking-wider text-white py-1 hover:text-[#AC8968]"
              >
                My Listings
              </Link>
              <Link
                to="/owner/inquiries"
                onClick={() => setIsOpen(false)}
                className="text-sm uppercase tracking-wider text-white py-1 hover:text-[#AC8968]"
              >
                Inquiries
              </Link>
            </>
          )}

          {user && user.role === 'admin' && (
            <>
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="text-sm uppercase tracking-wider text-white py-1 hover:text-[#AC8968]"
              >
                Dashboard
              </Link>
              <Link
                to="/admin/properties"
                onClick={() => setIsOpen(false)}
                className="text-sm uppercase tracking-wider text-white py-1 hover:text-[#AC8968]"
              >
                Manage Listings
              </Link>
              <Link
                to="/admin/users"
                onClick={() => setIsOpen(false)}
                className="text-sm uppercase tracking-wider text-white py-1 hover:text-[#AC8968]"
              >
                Users
              </Link>
            </>
          )}

          <div className="pt-4 border-t border-[#52483E] flex flex-col gap-3">
            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-sm uppercase tracking-wider text-[#DDD5CC] py-1"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="text-sm uppercase tracking-wider bg-[#865D36] text-white py-2.5 px-4 text-center rounded-sm font-medium"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="flex justify-between items-center pt-2">
                <div>
                  <div className="text-sm font-medium text-white">{user.name}</div>
                  <div className="text-[10px] uppercase text-[#AC8968]">{user.role}</div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="text-xs uppercase tracking-wider text-[#DDD5CC] hover:text-[#AC8968]"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}