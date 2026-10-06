import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { propertiesAPI } from '../../services/api';
import PropertyCard from '../../components/property/PropertyCard';
import { ArrowUpRight, Search, ShieldCheck, KeyRound, Building2, SlidersHorizontal } from 'lucide-react';
import heroImg from '../../assets/rentsure-hero.jpg';

export default function HomePage() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [search, setSearch] = useState({ city: '', category: '', type: '' });

  useEffect(() => {
    propertiesAPI
      .getAll({ featured: true, status: 'approved' })
      .then((res) => setFeatured(res.data.properties.slice(0, 6)))
      .catch((err) => console.error(err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (search.city) query.append('city', search.city);
    if (search.category) query.append('category', search.category);
    if (search.type) query.append('type', search.type);
    navigate(`/properties?${query.toString()}`);
  };

  const typologies = [
    { title: 'Apartments', type: 'apartment', count: 'High-Rise & Penthouses', desc: 'Urban homes with skyline connectivity' },
    { title: 'Villas', type: 'villa', count: 'Independent Estates', desc: 'Private retreats with landscaped gardens' },
    { title: 'Houses', type: 'house', count: 'Standalone Residences', desc: 'Spacious family layouts in premier neighborhoods' },
    { title: 'Studios', type: 'studio', count: 'Boutique Flats', desc: 'Smart, minimal living for professionals' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F1EB] text-[#3E362E]">
      {/* Editorial Hero Section */}
      <section className="relative min-h-[90vh] flex items-end justify-start overflow-hidden bg-[#3E362E]">
        <img
          src={heroImg}
          alt="RentSure Architectural Cityscape"
          className="absolute inset-0 w-full h-full object-cover object-center md:object-[center_35%] transition-transform duration-1000 ease-out"
        />

        {/* Sophisticated Architectural Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#3E362E] via-[#3E362E]/50 to-[#3E362E]/10" />

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 pb-16 md:pb-24">
          <div className="max-w-3xl">
            {/* Metadata Pill */}
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#AC8968] font-semibold mb-4 bg-[#3E362E]/70 px-3.5 py-1.5 rounded-sm backdrop-blur-sm border border-[#52483E]/50">
              <span>INDIA</span>
              <span className="text-white/40">&bull;</span>
              <span>RESIDENTIAL & COMMERCIAL</span>
              <span className="text-white/40">&bull;</span>
              <span>RENT & BUY</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08] mb-6">
              Find a place <br />
              <span className="text-[#F5F1EB]/95 font-light italic">worth coming home to.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#DDD5CC] max-w-xl leading-relaxed mb-10 font-normal">
              Direct access to curated architectural properties across India’s premier metropolises. Zero broker commissions, direct owner negotiations, and verified listings.
            </p>

            {/* Sophisticated Integrated Search Bar */}
            <form
              onSubmit={handleSearch}
              className="bg-white/95 backdrop-blur-md p-2 rounded-sm border border-[#DDD5CC] shadow-lg flex flex-col md:flex-row gap-2 max-w-3xl"
            >
              {/* Location Input */}
              <div className="flex-1 px-3 py-2 flex items-center gap-2 border-b md:border-b-0 md:border-r border-[#DDD5CC]/80">
                <Search size={16} className="text-[#865D36] shrink-0" />
                <input
                  type="text"
                  placeholder="Location or City (e.g. Mumbai, Pune)"
                  value={search.city}
                  onChange={(e) => setSearch({ ...search, city: e.target.value })}
                  className="w-full text-xs sm:text-sm text-[#3E362E] placeholder-[#766B61]/70 outline-none bg-transparent"
                />
              </div>

              {/* Category Select */}
              <div className="px-3 py-2 border-b md:border-b-0 md:border-r border-[#DDD5CC]/80">
                <select
                  value={search.category}
                  onChange={(e) => setSearch({ ...search, category: e.target.value })}
                  className="w-full text-xs sm:text-sm text-[#3E362E] outline-none bg-transparent cursor-pointer font-medium"
                >
                  <option value="">Rent or Buy</option>
                  <option value="rent">For Rent</option>
                  <option value="sale">For Sale</option>
                </select>
              </div>

              {/* Typology Select */}
              <div className="px-3 py-2">
                <select
                  value={search.type}
                  onChange={(e) => setSearch({ ...search, type: e.target.value })}
                  className="w-full text-xs sm:text-sm text-[#3E362E] outline-none bg-transparent cursor-pointer font-medium"
                >
                  <option value="">All Typologies</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="house">House</option>
                  <option value="studio">Studio</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="bg-[#865D36] hover:bg-[#93785B] text-white px-7 py-3 text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>Search</span>
                <ArrowUpRight size={15} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Subtle Architectural Metric Strip */}
      <section className="bg-[#EFE9DF] border-y border-[#DDD5CC] py-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="border-r border-[#DDD5CC]/60 last:border-none pr-4">
            <span className="block text-2xl md:text-3xl font-bold text-[#3E362E] tracking-tight">10,000+</span>
            <span className="text-[11px] uppercase tracking-widest text-[#766B61] font-medium">Curated Listings</span>
          </div>
          <div className="border-r border-[#DDD5CC]/60 last:border-none pr-4">
            <span className="block text-2xl md:text-3xl font-bold text-[#3E362E] tracking-tight">50+</span>
            <span className="text-[11px] uppercase tracking-widest text-[#766B61] font-medium">Indian Metropolises</span>
          </div>
          <div className="border-r border-[#DDD5CC]/60 last:border-none pr-4">
            <span className="block text-2xl md:text-3xl font-bold text-[#865D36] tracking-tight">0%</span>
            <span className="text-[11px] uppercase tracking-widest text-[#766B61] font-medium">Broker Commission</span>
          </div>
          <div>
            <span className="block text-2xl md:text-3xl font-bold text-[#3E362E] tracking-tight">100%</span>
            <span className="text-[11px] uppercase tracking-widest text-[#766B61] font-medium">Verified Owners</span>
          </div>
        </div>
      </section>

      {/* Section 1: Featured Properties */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#AC8968] font-bold block mb-2">
              CURATED COLLECTION
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#3E362E] tracking-tight">
              Featured Residences
            </h2>
          </div>
          <Link
            to="/properties"
            className="text-xs uppercase tracking-widest font-semibold text-[#865D36] hover:text-[#3E362E] transition-colors flex items-center gap-1 group"
          >
            <span>Explore All Properties</span>
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((prop) => (
            <PropertyCard key={prop._id} property={prop} />
          ))}
        </div>
      </section>

      {/* Section 2: Explore by Typology */}
      <section className="bg-white border-y border-[#DDD5CC] py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <span className="text-[11px] uppercase tracking-widest text-[#AC8968] font-bold block mb-2">
              CATEGORIES
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#3E362E] tracking-tight mb-4">
              Explore by Architectural Typology
            </h2>
            <p className="text-sm text-[#766B61] leading-relaxed">
              Every typology is tailored to a distinct cadence of living — from sea-facing penthouses to sprawling private villas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {typologies.map((item) => (
              <Link
                key={item.type}
                to={`/properties?type=${item.type}`}
                className="group p-6 bg-[#F5F1EB]/60 hover:bg-[#F5F1EB] border border-[#DDD5CC] rounded-sm transition-all duration-200 flex flex-col justify-between min-h-[190px]"
              >
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#AC8968] font-semibold block mb-1">
                    {item.count}
                  </span>
                  <h3 className="text-xl font-bold text-[#3E362E] group-hover:text-[#865D36] transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#766B61] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-4 flex items-center justify-between text-xs font-semibold text-[#865D36]">
                  <span className="text-[11px] uppercase tracking-wider">Discover</span>
                  <ArrowUpRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: RentSure Value Proposition */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[11px] uppercase tracking-widest text-[#AC8968] font-bold block">
              THE RENTSURE STANDARD
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#3E362E] tracking-tight leading-tight">
              Eliminating middlemen. Celebrating architecture.
            </h2>
            <p className="text-sm text-[#766B61] leading-relaxed">
              Traditional property hunting is burdened by unverified brokers, inflated hidden costs, and fragmented communication. RentSure redefines dealing directly:
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-sm bg-[#3E362E] text-white flex items-center justify-center shrink-0 text-sm font-semibold">
                  01
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#3E362E]">Zero Brokerage Overhead</h4>
                  <p className="text-xs text-[#766B61] mt-0.5">Engage directly with true property owners. Transparent financial dealings with zero arbitrary commission cuts.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-sm bg-[#865D36] text-white flex items-center justify-center shrink-0 text-sm font-semibold">
                  02
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#3E362E]">Rigorous Listing Governance</h4>
                  <p className="text-xs text-[#766B61] mt-0.5">Every residence passes an administrative moderation queue before public publication to preserve authenticity.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-sm bg-[#93785B] text-white flex items-center justify-center shrink-0 text-sm font-semibold">
                  03
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#3E362E]">Threaded Peer Inquiries</h4>
                  <p className="text-xs text-[#766B61] mt-0.5">Direct asynchronous inquiry threads connect buyers with owners without cold calling or spam.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative border border-[#DDD5CC] rounded-sm p-3 bg-white shadow-sm">
              <div className="aspect-[16/10] overflow-hidden rounded-xs bg-[#EFE9DF]">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200"
                  alt="Minimalist Architectural Interior"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex justify-between items-center text-xs text-[#766B61]">
                <span className="uppercase tracking-widest text-[10px] text-[#AC8968] font-bold">
                  Banjara Hills, Hyderabad
                </span>
                <span className="font-semibold text-[#3E362E]">Modernist 2BHK Residence</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Call-to-Action for Property Owners */}
      <section className="bg-[#3E362E] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-[11px] uppercase tracking-widest text-[#AC8968] font-bold block">
            OWNER WORKSPACE
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#F5F1EB]">
            Own an exceptional property? <br />
            List it directly on RentSure.
          </h2>
          <p className="text-sm md:text-base text-[#DDD5CC] max-w-xl mx-auto leading-relaxed">
            Reach thousands of vetted tenants and buyers across India. Maintain complete control of your listings and inquiries through our dedicated workspace.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/list-property"
              className="bg-[#865D36] hover:bg-[#93785B] text-white text-xs uppercase tracking-widest font-semibold px-8 py-3.5 rounded-sm transition-all inline-flex items-center justify-center gap-2"
            >
              <span>List Your Property</span>
              <ArrowUpRight size={15} />
            </Link>
            <Link
              to="/properties"
              className="border border-[#DDD5CC]/40 hover:border-white text-white text-xs uppercase tracking-widest font-semibold px-8 py-3.5 rounded-sm transition-all inline-flex items-center justify-center"
            >
              <span>Browse Catalog</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}