const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'client');

const files = {
  'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { 900: '#0f172a', 800: '#1e293b', 700: '#334155' },
        sky: { 500: '#0ea5e9', 600: '#0284c7' }
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        body: ['system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}`,
  'src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

* { box-sizing: border-box; }
body { font-family: system-ui, sans-serif; background: #f8fafc; color: #0f172a; }`,
  '.env': `VITE_API_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=`,
  'src/services/api.js': `import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  getMe: () => api.get('/api/auth/me')
};

export const propertiesAPI = {
  getAll: (params) => api.get('/api/properties', { params }),
  getById: (id) => api.get(\`/api/properties/\${id}\`),
  getMyListings: () => api.get('/api/properties/my-listings'),
  create: (data) => api.post('/api/properties', data),
  update: (id, data) => api.put(\`/api/properties/\${id}\`, data),
  delete: (id) => api.delete(\`/api/properties/\${id}\`)
};

export const favoritesAPI = {
  getAll: () => api.get('/api/favorites'),
  toggle: (propertyId) => api.post('/api/favorites', { propertyId }),
  check: (propertyId) => api.get(\`/api/favorites/check/\${propertyId}\`)
};

export const inquiriesAPI = {
  create: (data) => api.post('/api/inquiries', data),
  getAll: () => api.get('/api/inquiries'),
  reply: (id, reply) => api.put(\`/api/inquiries/\${id}/reply\`, { reply }),
  delete: (id) => api.delete(\`/api/inquiries/\${id}\`)
};

export const adminAPI = {
  getStats: () => api.get('/api/admin/stats'),
  getUsers: () => api.get('/api/admin/users'),
  updateUser: (id, data) => api.put(\`/api/admin/users/\${id}\`, data),
  deleteUser: (id) => api.delete(\`/api/admin/users/\${id}\`),
  getProperties: (params) => api.get('/api/admin/properties', { params }),
  updatePropertyStatus: (id, status) => api.put(\`/api/admin/properties/\${id}/status\`, { status })
};

export default api;`,
  'src/context/AuthContext.jsx': `import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (token) {
        try {
          const res = await authAPI.getMe();
          setUser(res.data);
        } catch (error) {
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };
    init();
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    setToken(res.data.token);
    setUser(res.data);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data));
  };

  const register = async (data) => {
    const res = await authAPI.register(data);
    setToken(res.data.token);
    setUser(res.data);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);`,
  'src/App.jsx': `import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import HomePage from './pages/public/HomePage';
import PropertiesPage from './pages/public/PropertiesPage';
import PropertyDetailPage from './pages/public/PropertyDetailPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import FavoritesPage from './pages/buyer/FavoritesPage';
import BuyerInquiriesPage from './pages/buyer/BuyerInquiriesPage';

import AddPropertyPage from './pages/owner/AddPropertyPage';
import EditPropertyPage from './pages/owner/EditPropertyPage';
import ManageListingsPage from './pages/owner/ManageListingsPage';
import OwnerInquiriesPage from './pages/owner/OwnerInquiriesPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPropertiesPage from './pages/admin/AdminPropertiesPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/properties" element={<PropertiesPage />} />
              <Route path="/properties/:id" element={<PropertyDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/inquiries" element={<BuyerInquiriesPage />} />
              </Route>
              
              <Route element={<ProtectedRoute role="owner" />}>
                <Route path="/list-property" element={<AddPropertyPage />} />
                <Route path="/my-listings" element={<ManageListingsPage />} />
                <Route path="/owner/inquiries" element={<OwnerInquiriesPage />} />
                <Route path="/owner/properties/edit/:id" element={<EditPropertyPage />} />
              </Route>

              <Route element={<ProtectedRoute role="admin" />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/properties" element={<AdminPropertiesPage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;`,
  'src/components/layout/Navbar.jsx': `import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-navy-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold font-display flex items-center gap-2">
          🏠 <span className="text-sky-500">Estate</span>Hub
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" className="hover:text-sky-500">Home</NavLink>
          <NavLink to="/properties" className="hover:text-sky-500">Properties</NavLink>
          
          {!user ? (
            <>
              <Link to="/login" className="hover:text-sky-500">Login</Link>
              <Link to="/register" className="bg-sky-600 px-4 py-2 rounded text-white hover:bg-sky-500">Register</Link>
            </>
          ) : (
            <>
              {user.role === 'buyer' && (
                <>
                  <Link to="/favorites" className="hover:text-sky-500">Favorites</Link>
                  <Link to="/inquiries" className="hover:text-sky-500">My Inquiries</Link>
                </>
              )}
              {user.role === 'owner' && (
                <>
                  <Link to="/list-property" className="hover:text-sky-500">List Property</Link>
                  <Link to="/my-listings" className="hover:text-sky-500">My Listings</Link>
                  <Link to="/owner/inquiries" className="hover:text-sky-500">Inquiries</Link>
                </>
              )}
              {user.role === 'admin' && (
                <>
                  <Link to="/admin" className="hover:text-sky-500">Dashboard</Link>
                  <Link to="/admin/properties" className="hover:text-sky-500">Manage Listings</Link>
                  <Link to="/admin/users" className="hover:text-sky-500">Manage Users</Link>
                </>
              )}
              <div className="flex items-center gap-4 ml-4 border-l pl-4 border-slate-700">
                <span className="text-sm text-slate-300">Hi, {user.name}</span>
                <button onClick={logout} className="text-sm text-red-400 hover:text-red-300">Logout</button>
              </div>
            </>
          )}
        </div>
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden bg-navy-800 p-4 flex flex-col gap-4">
          <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/properties" onClick={() => setIsOpen(false)}>Properties</Link>
        </div>
      )}
    </nav>
  );
}`,
  'src/components/layout/Footer.jsx': `import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-slate-300 py-8">
      <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">EstateHub <span className="text-sm text-slate-400">by RentSure</span></h3>
          <p className="text-sm">Find your perfect home in India with zero broker fees and verified listings.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Quick Links</h4>
          <ul className="text-sm space-y-1">
            <li><a href="/properties" className="hover:text-sky-500">Browse Properties</a></li>
            <li><a href="/login" className="hover:text-sky-500">Login</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Contact</h4>
          <p className="text-sm">Email: support@estatehub.com</p>
          <p className="text-sm">Phone: +91 1800-123-4567</p>
        </div>
      </div>
      <div className="text-center mt-8 text-xs border-t border-slate-700 pt-4">
        &copy; 2024 EstateHub. All rights reserved.
      </div>
    </footer>
  );
}`,
  'src/components/common/Spinner.jsx': `import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Spinner() {
  return (
    <div className="flex justify-center items-center h-full min-h-[200px]">
      <Loader2 className="animate-spin text-sky-500" size={48} />
    </div>
  );
}`,
  'src/components/common/ProtectedRoute.jsx': `import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Spinner from './Spinner';

export default function ProtectedRoute({ role }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner />;
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (role && user.role !== role) {
    if (user.role === 'admin') return <Outlet />;
    toast.error('Unauthorized access');
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}`,
  'src/components/property/PropertyCard.jsx': `import React from 'react';
import { Link } from 'react-router-dom';
import { BedDouble, Bath, Square, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { favoritesAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function PropertyCard({ property }) {
  const { user } = useAuth();
  const fallbackImg = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800";
  const mainImage = property.images && property.images.length > 0 ? property.images[0] : fallbackImg;

  const handleFavorite = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to save properties');
    try {
      await favoritesAPI.toggle(property._id);
      toast.success('Favorites updated');
    } catch (err) {
      toast.error('Failed to update favorites');
    }
  };

  return (
    <Link to={\`/properties/\${property._id}\`} className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden border">
      <div className="relative h-48">
        <img src={mainImage} alt={property.title} className="w-full h-full object-cover" />
        <div className="absolute top-2 left-2 flex gap-2">
          {property.featured && <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">Featured</span>}
          <span className={\`text-xs px-2 py-1 rounded text-white \${property.category === 'sale' ? 'bg-green-500' : 'bg-sky-500'}\`}>
            For {property.category === 'sale' ? 'Sale' : 'Rent'}
          </span>
        </div>
        {user && user.role === 'buyer' && (
          <button onClick={handleFavorite} className="absolute top-2 right-2 bg-white/80 p-2 rounded-full hover:bg-white text-rose-500">
            <Heart size={18} />
          </button>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg truncate flex-1">{property.title}</h3>
          <p className="text-sky-600 font-bold ml-2">₹{property.price.toLocaleString('en-IN')}</p>
        </div>
        <p className="text-slate-500 text-sm mb-4">{property.location?.city}, {property.location?.state}</p>
        <div className="flex justify-between text-sm text-slate-600 border-t pt-3">
          <div className="flex items-center gap-1"><BedDouble size={16}/> {property.bedrooms}</div>
          <div className="flex items-center gap-1"><Bath size={16}/> {property.bathrooms}</div>
          <div className="flex items-center gap-1"><Square size={16}/> {property.area} sqft</div>
        </div>
        {property.status && property.status !== 'approved' && (
          <div className="mt-3 text-xs font-bold text-center p-1 rounded bg-slate-100">
            Status: {property.status.toUpperCase()}
          </div>
        )}
      </div>
    </Link>
  );
}`,
  'src/components/property/SearchFilters.jsx': `import React from 'react';

export default function SearchFilters({ filters, setFilters, onApply, onClear }) {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border space-y-4">
      <h3 className="font-bold mb-4">Filters</h3>
      <div>
        <label className="text-sm font-semibold">Search</label>
        <input name="search" value={filters.search || ''} onChange={handleChange} className="w-full border rounded p-2" placeholder="Keywords..." />
      </div>
      <div>
        <label className="text-sm font-semibold">City</label>
        <input name="city" value={filters.city || ''} onChange={handleChange} className="w-full border rounded p-2" placeholder="City..." />
      </div>
      <div>
        <label className="text-sm font-semibold">Category</label>
        <select name="category" value={filters.category || ''} onChange={handleChange} className="w-full border rounded p-2">
          <option value="">All</option>
          <option value="rent">Rent</option>
          <option value="sale">Sale</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-semibold">Property Type</label>
        <select name="type" value={filters.type || ''} onChange={handleChange} className="w-full border rounded p-2">
          <option value="">All</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="villa">Villa</option>
          <option value="studio">Studio</option>
          <option value="commercial">Commercial</option>
          <option value="plot">Plot</option>
        </select>
      </div>
      <div className="flex gap-2">
        <div className="w-1/2">
          <label className="text-sm font-semibold">Min Price</label>
          <input type="number" name="minPrice" value={filters.minPrice || ''} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div className="w-1/2">
          <label className="text-sm font-semibold">Max Price</label>
          <input type="number" name="maxPrice" value={filters.maxPrice || ''} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={onApply} className="flex-1 bg-sky-600 text-white py-2 rounded">Apply</button>
        <button onClick={onClear} className="flex-1 bg-slate-200 text-slate-800 py-2 rounded">Clear</button>
      </div>
    </div>
  );
}`,
  'src/components/property/PropertyMap.jsx': `import React from 'react';
import { LoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

const mapStyles = { height: '100%', width: '100%' };
const defaultCenter = { lat: 19.076, lng: 72.877 };

export default function PropertyMap({ properties }) {
  const [activeMarker, setActiveMarker] = React.useState(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="h-full min-h-[400px] w-full bg-slate-100 flex items-center justify-center p-4 text-center border rounded">
        <p className="text-slate-500">Add your Google Maps API key to .env to enable map view.</p>
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap mapContainerStyle={mapStyles} zoom={6} center={defaultCenter}>
        {properties.map(item => (
          item.location?.coordinates && (
            <Marker 
              key={item._id} 
              position={item.location.coordinates}
              onClick={() => setActiveMarker(item)}
            />
          )
        ))}
        {activeMarker && (
          <InfoWindow
            position={activeMarker.location.coordinates}
            onCloseClick={() => setActiveMarker(null)}
          >
            <div className="p-2">
              <img src={activeMarker.images?.[0]} className="w-full h-24 object-cover mb-2" alt="" />
              <h4 className="font-bold text-sm">{activeMarker.title}</h4>
              <p className="text-sky-600 font-bold">₹{activeMarker.price}</p>
              <a href={\`/properties/\${activeMarker._id}\`} className="text-xs text-blue-500 hover:underline">View Details</a>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}`
};

for (const [p, content] of Object.entries(files)) {
  const fullPath = path.join(basePath, p);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log('Frontend setup 1 created.');
