const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'client');

const files = {
  'postcss.config.js': `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,
  'src/pages/public/HomePage.jsx': `import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertiesAPI } from '../../services/api';
import PropertyCard from '../../components/property/PropertyCard';
import { CheckCircle2, ShieldCheck, Phone, Zap } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [search, setSearch] = useState({ city: '', type: '' });

  useEffect(() => {
    propertiesAPI.getAll({ featured: true, status: 'approved' }).then(res => setFeatured(res.data.properties.slice(0, 6)));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (search.city) query.append('city', search.city);
    if (search.type) query.append('type', search.type);
    navigate(\`/properties?\${query.toString()}\`);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-navy-900 to-navy-800 text-white py-24 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Find Your Perfect Home in India</h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10">Zero broker fees. Verified listings. Direct owner contact.</p>
          
          <form onSubmit={handleSearch} className="bg-white p-2 rounded-lg flex flex-col md:flex-row gap-2 max-w-3xl mx-auto">
            <input 
              type="text" 
              placeholder="Enter City (e.g. Mumbai)" 
              className="flex-1 p-3 text-slate-800 outline-none rounded"
              value={search.city}
              onChange={e => setSearch({...search, city: e.target.value})}
            />
            <select 
              className="p-3 text-slate-800 outline-none border-l bg-white"
              value={search.type}
              onChange={e => setSearch({...search, type: e.target.value})}
            >
              <option value="">Property Type</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
            </select>
            <button type="submit" className="bg-sky-600 hover:bg-sky-500 text-white px-8 py-3 rounded font-bold transition">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b py-8">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div><h4 className="text-3xl font-bold text-sky-600 mb-1">10,000+</h4><p className="text-sm text-slate-500">Active Listings</p></div>
          <div><h4 className="text-3xl font-bold text-sky-600 mb-1">25,000+</h4><p className="text-sm text-slate-500">Happy Customers</p></div>
          <div><h4 className="text-3xl font-bold text-sky-600 mb-1">50+</h4><p className="text-sm text-slate-500">Cities Covered</p></div>
          <div><h4 className="text-3xl font-bold text-sky-600 mb-1">500+</h4><p className="text-sm text-slate-500">Expert Agents</p></div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Properties</h2>
              <p className="text-slate-500">Handpicked premium properties across India.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map(prop => <PropertyCard key={prop._id} property={prop} />)}
          </div>
          <div className="text-center mt-10">
            <button onClick={() => navigate('/properties')} className="bg-navy-900 text-white px-6 py-3 rounded hover:bg-navy-800">
              View All Properties
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose EstateHub?</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="p-4"><Zap size={48} className="mx-auto text-sky-500 mb-4" /><h3 className="font-bold text-lg mb-2">Zero Broker Fees</h3><p className="text-slate-500 text-sm">Save thousands by dealing directly.</p></div>
            <div className="p-4"><ShieldCheck size={48} className="mx-auto text-sky-500 mb-4" /><h3 className="font-bold text-lg mb-2">Verified Listings</h3><p className="text-slate-500 text-sm">Every property is manually checked.</p></div>
            <div className="p-4"><Phone size={48} className="mx-auto text-sky-500 mb-4" /><h3 className="font-bold text-lg mb-2">Direct Owner Contact</h3><p className="text-slate-500 text-sm">Seamless communication platform.</p></div>
            <div className="p-4"><CheckCircle2 size={48} className="mx-auto text-sky-500 mb-4" /><h3 className="font-bold text-lg mb-2">Easy Process</h3><p className="text-slate-500 text-sm">From search to deal, all in one place.</p></div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-sky-600 text-white py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Own a Property? List It Today!</h2>
          <p className="mb-8 max-w-2xl mx-auto">Join thousands of property owners who have successfully rented or sold their properties on EstateHub.</p>
          <button onClick={() => navigate('/list-property')} className="bg-white text-sky-600 font-bold px-8 py-3 rounded shadow hover:bg-slate-50">
            List Property
          </button>
        </div>
      </section>
    </div>
  );
}`,
  'src/pages/public/PropertiesPage.jsx': `import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, Map } from 'lucide-react';
import { propertiesAPI } from '../../services/api';
import PropertyCard from '../../components/property/PropertyCard';
import SearchFilters from '../../components/property/SearchFilters';
import PropertyMap from '../../components/property/PropertyMap';
import Spinner from '../../components/common/Spinner';

export default function PropertiesPage() {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    type: searchParams.get('type') || '',
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    minPrice: '', maxPrice: ''
  });

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await propertiesAPI.getAll(filters);
      setProperties(res.data.properties);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(fetchProperties, 300);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleClear = () => setFilters({ city: '', type: '', category: '', search: '', minPrice: '', maxPrice: '' });

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/4">
        <SearchFilters filters={filters} setFilters={setFilters} onApply={fetchProperties} onClear={handleClear} />
      </div>
      <div className="w-full md:w-3/4 flex flex-col">
        <div className="flex justify-between items-center mb-4 bg-white p-3 rounded shadow-sm border">
          <h2 className="font-bold text-slate-700">{properties.length} Results Found</h2>
          <div className="flex bg-slate-100 rounded p-1">
            <button onClick={() => setViewMode('grid')} className={\`p-2 rounded \${viewMode === 'grid' ? 'bg-white shadow' : 'text-slate-500'}\`}><Grid size={20}/></button>
            <button onClick={() => setViewMode('map')} className={\`p-2 rounded \${viewMode === 'map' ? 'bg-white shadow' : 'text-slate-500'}\`}><Map size={20}/></button>
          </div>
        </div>

        {loading ? <Spinner /> : (
          viewMode === 'grid' ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map(p => <PropertyCard key={p._id} property={p} />)}
            </div>
          ) : (
            <div className="h-[600px] border rounded overflow-hidden">
              <PropertyMap properties={properties} />
            </div>
          )
        )}
      </div>
    </div>
  );
}`,
  'src/pages/public/PropertyDetailPage.jsx': `import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { propertiesAPI, inquiriesAPI, favoritesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { MapPin, BedDouble, Bath, Square, Heart, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [inquiry, setInquiry] = useState({ message: '', phone: '', email: '' });

  useEffect(() => {
    propertiesAPI.getById(id).then(res => {
      setProperty(res.data);
      if(res.data.images?.length > 0) setMainImage(res.data.images[0]);
      if(user) setInquiry({ message: 'I am interested in this property.', phone: user.phone || '', email: user.email || '' });
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [id, user]);

  const handleFavorite = async () => {
    if (!user) return toast.error('Login required');
    try {
      await favoritesAPI.toggle(id);
      toast.success('Favorites updated');
    } catch(err) { toast.error('Error updating favorites'); }
  };

  const handleInquiry = async (e) => {
    e.preventDefault();
    try {
      await inquiriesAPI.create({ ...inquiry, propertyId: id });
      toast.success('Inquiry sent successfully!');
      setShowModal(false);
    } catch (err) { toast.error('Failed to send inquiry'); }
  };

  if (loading) return <Spinner />;
  if (!property) return <div className="text-center py-20">Property not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Gallery */}
          <div className="rounded-xl overflow-hidden bg-slate-100 h-[400px]">
            {mainImage ? <img src={mainImage} className="w-full h-full object-cover" /> : <div className="h-full flex items-center justify-center">No Image</div>}
          </div>
          {property.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {property.images.map((img, i) => (
                <img key={i} src={img} onClick={() => setMainImage(img)} className="w-24 h-24 object-cover rounded cursor-pointer border-2 hover:border-sky-500" />
              ))}
            </div>
          )}
          
          {/* Details */}
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                <p className="text-slate-500 flex items-center gap-1"><MapPin size={18}/> {property.location.address}, {property.location.city}</p>
              </div>
              <h2 className="text-3xl font-bold text-sky-600">₹{property.price.toLocaleString('en-IN')}</h2>
            </div>
            
            <div className="flex gap-4 py-4 border-y text-slate-700">
              <span className="flex items-center gap-1"><BedDouble/> {property.bedrooms} Beds</span>
              <span className="flex items-center gap-1"><Bath/> {property.bathrooms} Baths</span>
              <span className="flex items-center gap-1"><Square/> {property.area} sqft</span>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Overview</h3>
              <p className="text-slate-600 whitespace-pre-wrap">{property.description}</p>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities?.map((am, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-700"><Check size={18} className="text-green-500"/> {am}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow border">
            <h3 className="font-bold text-lg mb-4">Listed By</h3>
            <p className="font-semibold text-slate-800">{property.owner?.name}</p>
            {user && <p className="text-sm text-slate-500 mt-1">{property.owner?.phone}</p>}
            
            <div className="mt-6 flex flex-col gap-3">
              <button onClick={() => setShowModal(true)} className="w-full bg-sky-600 text-white py-3 rounded font-bold hover:bg-sky-700 transition">
                Send Inquiry
              </button>
              <button onClick={handleFavorite} className="w-full border border-rose-200 text-rose-500 py-3 rounded font-bold hover:bg-rose-50 transition flex items-center justify-center gap-2">
                <Heart size={18}/> Save to Favorites
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Send Inquiry</h3>
            <form onSubmit={handleInquiry} className="space-y-4">
              <textarea required value={inquiry.message} onChange={e => setInquiry({...inquiry, message: e.target.value})} className="w-full border rounded p-3 h-32" placeholder="Your message..." />
              <input type="text" required value={inquiry.phone} onChange={e => setInquiry({...inquiry, phone: e.target.value})} className="w-full border rounded p-3" placeholder="Phone Number" />
              <div className="flex gap-2 pt-4">
                <button type="submit" className="flex-1 bg-sky-600 text-white py-2 rounded">Send</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-200 text-slate-800 py-2 rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}`,
  'src/pages/auth/LoginPage.jsx': `import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e, demoEmail, demoPass) => {
    if(e) e.preventDefault();
    try {
      await login(demoEmail || email, demoPass || password);
      toast.success('Logged in successfully');
      
      const from = location.state?.from?.pathname;
      if (from) return navigate(from);
      
      const u = JSON.parse(localStorage.getItem('user'));
      if(u.role === 'admin') navigate('/admin');
      else if(u.role === 'owner') navigate('/my-listings');
      else navigate('/');
    } catch (err) {
      toast.error('Login failed. Check credentials.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md border">
        <h2 className="text-center text-3xl font-bold text-slate-800">Sign in to your account</h2>
        
        <div className="bg-sky-50 p-4 rounded-lg border border-sky-100">
          <p className="text-sm font-bold text-sky-800 mb-3 text-center">🔑 Demo Accounts (click to fill & login)</p>
          <div className="flex flex-col gap-2">
            <button onClick={() => handleLogin(null, 'admin@demo.com', 'password123')} className="bg-white text-sm py-2 rounded border border-sky-200 hover:bg-sky-100">👤 Admin</button>
            <button onClick={() => handleLogin(null, 'owner@demo.com', 'password123')} className="bg-white text-sm py-2 rounded border border-sky-200 hover:bg-sky-100">🏠 Owner</button>
            <button onClick={() => handleLogin(null, 'buyer@demo.com', 'password123')} className="bg-white text-sm py-2 rounded border border-sky-200 hover:bg-sky-100">🛒 Buyer</button>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="text-sm font-medium text-slate-700">Email address</label>
            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full border rounded p-3" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 w-full border rounded p-3" />
          </div>
          <button type="submit" className="w-full bg-sky-600 text-white p-3 rounded font-bold hover:bg-sky-700 transition">Sign In</button>
        </form>
        <p className="text-center text-sm text-slate-600">
          Don't have an account? <Link to="/register" className="font-bold text-sky-600">Register</Link>
        </p>
      </div>
    </div>
  );
}`,
  'src/pages/auth/RegisterPage.jsx': `import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [data, setData] = useState({ name: '', email: '', password: '', role: 'buyer' });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(data);
      toast.success('Registration successful');
      navigate('/');
    } catch (err) {
      toast.error('Registration failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md border">
        <h2 className="text-center text-3xl font-bold text-slate-800">Create an account</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input required type="text" value={data.name} onChange={e=>setData({...data, name: e.target.value})} className="mt-1 w-full border rounded p-3" />
          </div>
          <div>
            <label className="text-sm font-medium">Email address</label>
            <input required type="email" value={data.email} onChange={e=>setData({...data, email: e.target.value})} className="mt-1 w-full border rounded p-3" />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input required type="password" value={data.password} onChange={e=>setData({...data, password: e.target.value})} className="mt-1 w-full border rounded p-3" minLength={6} />
          </div>
          <div>
            <label className="text-sm font-medium">Role</label>
            <select value={data.role} onChange={e=>setData({...data, role: e.target.value})} className="mt-1 w-full border rounded p-3">
              <option value="buyer">Buyer (Looking for properties)</option>
              <option value="owner">Owner (Listing properties)</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-sky-600 text-white p-3 rounded font-bold hover:bg-sky-700">Register</button>
        </form>
        <p className="text-center text-sm text-slate-600">
          Already have an account? <Link to="/login" className="font-bold text-sky-600">Login</Link>
        </p>
      </div>
    </div>
  );
}`
};

for (const [p, content] of Object.entries(files)) {
  const fullPath = path.join(basePath, p);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log('Frontend setup 2 created.');
