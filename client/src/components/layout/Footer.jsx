import React from 'react';
import { Link } from 'react-router-dom';
import rentsureIcon from '../../assets/iconshelf-bi-r-circle-fill-128px.svg';

export default function Footer() {
  return (
    <footer className="bg-[#3E362E] text-[#DDD5CC] border-t border-[#52483E]/80 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-[#52483E]/60">
          {/* Brand & Manifesto */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <svg
                className="w-7 h-7 text-[#AC8968] shrink-0"
                viewBox="2 2.5 8 8"
                fill="currentColor"
              >
                <path d="M3 10V3h4.385q.69 0 1.153.463T9 4.615V5.85q0 .466-.37.886q-.368.42-.907.541L8.885 10H7.846l-1.15-2.65H4V10zm1-3.65h3.385q.269 0 .442-.173T8 5.735v-1.12q0-.269-.173-.442T7.385 4H4z" />
              </svg>
              <span className="text-2xl font-bold tracking-tight text-white">
                RentSure
              </span>
            </Link>
            <p className="text-sm text-[#DDD5CC]/80 leading-relaxed max-w-sm">
              An architectural real estate platform connecting discerning buyers, tenants, and property owners directly across India. Curated spaces with zero intermediary overhead.
            </p>
            <div className="text-[11px] uppercase tracking-widest text-[#AC8968] font-medium pt-2">
              MUMBAI &bull; PUNE &bull; BANGALORE &bull; DELHI
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#AC8968] font-semibold">
              Explore Spaces
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/properties" className="hover:text-white transition-colors">
                  All Properties
                </Link>
              </li>
              <li>
                <Link to="/properties?category=rent" className="hover:text-white transition-colors">
                  Residences for Rent
                </Link>
              </li>
              <li>
                <Link to="/properties?category=sale" className="hover:text-white transition-colors">
                  Properties for Sale
                </Link>
              </li>
              <li>
                <Link to="/properties?type=apartment" className="hover:text-white transition-colors">
                  Modern Apartments
                </Link>
              </li>
              <li>
                <Link to="/properties?type=villa" className="hover:text-white transition-colors">
                  Independent Villas
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Services */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#AC8968] font-semibold">
              Platform & Concierge
            </h4>
            <ul className="space-y-2 text-sm text-[#DDD5CC]/80">
              <li>
                <Link to="/list-property" className="hover:text-white transition-colors">
                  List Your Property Directly
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Owner & Buyer Portal Access
                </Link>
              </li>
              <li className="pt-2 text-xs text-[#AC8968]">
                Inquiries & Support: concierge@rentsure.in
              </li>
              <li className="text-xs text-[#DDD5CC]/60">
                Direct peer-to-peer property dealings with verified administrative review.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#DDD5CC]/60">
          <div>
            &copy; {new Date().getFullYear()} RentSure. All rights reserved. Architectural living.
          </div>
          <div className="flex gap-6 uppercase tracking-wider text-[11px]">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Editorial Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}