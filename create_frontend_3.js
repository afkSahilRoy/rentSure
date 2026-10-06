const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'client');

const files = {
  'src/pages/buyer/FavoritesPage.jsx': `import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { favoritesAPI } from '../../services/api';
import PropertyCard from '../../components/property/PropertyCard';
import Spinner from '../../components/common/Spinner';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    favoritesAPI.getAll().then(res => {
      setFavorites(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        My Saved Properties <span className="bg-sky-100 text-sky-600 text-sm px-3 py-1 rounded-full">{favorites.length}</span>
      </h2>
      
      {favorites.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border shadow-sm">
          <h3 className="text-xl font-bold mb-4">No saved properties yet</h3>
          <p className="text-slate-500 mb-6">Browse our listings and click the heart icon to save your favorites.</p>
          <Link to="/properties" className="bg-sky-600 text-white px-6 py-3 rounded hover:bg-sky-700">Browse Properties</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map(prop => <PropertyCard key={prop._id} property={prop} />)}
        </div>
      )}
    </div>
  );
}`,
  'src/pages/buyer/BuyerInquiriesPage.jsx': `import React, { useEffect, useState } from 'react';
import { inquiriesAPI } from '../../services/api';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';

export default function BuyerInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = () => {
    inquiriesAPI.getAll().then(res => {
      setInquiries(res.data);
      setLoading(false);
    });
  };

  const handleDelete = async (id) => {
    if(window.confirm('Delete this inquiry?')) {
      try {
        await inquiriesAPI.delete(id);
        toast.success('Inquiry deleted');
        fetchInquiries();
      } catch(err) { toast.error('Error deleting'); }
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">My Inquiries</h2>
      {inquiries.length === 0 ? (
        <div className="text-center py-10 bg-white rounded border">No inquiries sent yet.</div>
      ) : (
        <div className="space-y-4">
          {inquiries.map(inq => (
            <div key={inq._id} className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  <img src={inq.property?.images?.[0] || ''} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <h3 className="font-bold">{inq.property?.title}</h3>
                    <p className="text-sm text-slate-500">{inq.property?.location?.city}</p>
                    <p className="text-xs text-slate-400">{new Date(inq.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={\`text-xs px-2 py-1 rounded \${inq.status==='replied' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}\`}>
                    {inq.status.toUpperCase()}
                  </span>
                  <button onClick={() => handleDelete(inq._id)} className="text-rose-500 hover:bg-rose-50 p-1 rounded"><Trash2 size={18}/></button>
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded text-sm mb-3 border">
                <strong>My Message:</strong> <p>{inq.message}</p>
              </div>
              {inq.status === 'replied' && (
                <div className="bg-sky-50 p-3 rounded text-sm border border-sky-100">
                  <strong>Reply from {inq.owner?.name}:</strong> <p>{inq.reply}</p>
                  <p className="text-xs text-slate-400 mt-1">{new Date(inq.repliedAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}`,
  'src/pages/owner/AddPropertyPage.jsx': `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertiesAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AddPropertyPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    title: '', description: '', category: 'rent', type: 'apartment', price: '',
    address: '', city: '', state: '', zipCode: '', lat: '', lng: '',
    bedrooms: 0, bathrooms: 0, area: '', furnishing: 'unfurnished',
    amenities: [], images: ['']
  });

  const allAmenities = ['WiFi', 'Parking', 'Pool', 'Gym', 'Security', 'Balcony', 'Power Backup', 'Lift', 'Garden', 'Playground'];

  const handleAmenity = (am) => {
    if(data.amenities.includes(am)) setData({...data, amenities: data.amenities.filter(a => a !== am)});
    else setData({...data, amenities: [...data.amenities, am]});
  };

  const handleImageChange = (index, value) => {
    const newImgs = [...data.images];
    newImgs[index] = value;
    setData({...data, images: newImgs});
  };

  const addImageField = () => {
    if(data.images.length < 10) setData({...data, images: [...data.images, '']});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...data, location: { address: data.address, city: data.city, state: data.state, zipCode: data.zipCode, coordinates: { lat: Number(data.lat), lng: Number(data.lng) } } };
      payload.images = data.images.filter(img => img.trim() !== '');
      await propertiesAPI.create(payload);
      toast.success('Property created successfully! Awaiting admin approval.');
      navigate('/my-listings');
    } catch(err) {
      toast.error('Failed to create property');
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded mb-6 text-sm">
        ℹ️ Your listing will be reviewed by an admin before going live.
      </div>
      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl shadow border">
        <h2 className="text-3xl font-bold">Add New Property</h2>
        
        {/* Basic */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold border-b pb-2">Basic Info</h3>
          <div><label className="block text-sm font-bold mb-1">Title</label><input required className="w-full border p-2 rounded" value={data.title} onChange={e=>setData({...data, title: e.target.value})} /></div>
          <div><label className="block text-sm font-bold mb-1">Description</label><textarea required className="w-full border p-2 rounded h-24" value={data.description} onChange={e=>setData({...data, description: e.target.value})} /></div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-sm font-bold mb-1">Category</label><select className="w-full border p-2 rounded" value={data.category} onChange={e=>setData({...data, category: e.target.value})}><option value="rent">Rent</option><option value="sale">Sale</option></select></div>
            <div><label className="block text-sm font-bold mb-1">Type</label><select className="w-full border p-2 rounded" value={data.type} onChange={e=>setData({...data, type: e.target.value})}><option value="apartment">Apartment</option><option value="house">House</option><option value="villa">Villa</option><option value="studio">Studio</option><option value="commercial">Commercial</option><option value="plot">Plot</option></select></div>
            <div><label className="block text-sm font-bold mb-1">Price (₹)</label><input type="number" required className="w-full border p-2 rounded" value={data.price} onChange={e=>setData({...data, price: e.target.value})} /></div>
          </div>
        </section>

        {/* Location */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold border-b pb-2">Location</h3>
          <div><label className="block text-sm font-bold mb-1">Address</label><input required className="w-full border p-2 rounded" value={data.address} onChange={e=>setData({...data, address: e.target.value})} /></div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-sm font-bold mb-1">City</label><input required className="w-full border p-2 rounded" value={data.city} onChange={e=>setData({...data, city: e.target.value})} /></div>
            <div><label className="block text-sm font-bold mb-1">State</label><input className="w-full border p-2 rounded" value={data.state} onChange={e=>setData({...data, state: e.target.value})} /></div>
            <div><label className="block text-sm font-bold mb-1">Zip Code</label><input className="w-full border p-2 rounded" value={data.zipCode} onChange={e=>setData({...data, zipCode: e.target.value})} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold mb-1">Latitude (for map)</label><input type="number" step="any" className="w-full border p-2 rounded" value={data.lat} onChange={e=>setData({...data, lat: e.target.value})} /></div>
            <div><label className="block text-sm font-bold mb-1">Longitude (for map)</label><input type="number" step="any" className="w-full border p-2 rounded" value={data.lng} onChange={e=>setData({...data, lng: e.target.value})} /></div>
          </div>
        </section>

        {/* Details */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold border-b pb-2">Details</h3>
          <div className="grid grid-cols-4 gap-4">
            <div><label className="block text-sm font-bold mb-1">Bedrooms</label><select className="w-full border p-2 rounded" value={data.bedrooms} onChange={e=>setData({...data, bedrooms: e.target.value})}>{[0,1,2,3,4,5,6,7,8,9,10].map(n=><option key={n} value={n}>{n}</option>)}</select></div>
            <div><label className="block text-sm font-bold mb-1">Bathrooms</label><select className="w-full border p-2 rounded" value={data.bathrooms} onChange={e=>setData({...data, bathrooms: e.target.value})}>{[0,1,2,3,4,5,6,7,8,9,10].map(n=><option key={n} value={n}>{n}</option>)}</select></div>
            <div><label className="block text-sm font-bold mb-1">Area (sq ft)</label><input type="number" className="w-full border p-2 rounded" value={data.area} onChange={e=>setData({...data, area: e.target.value})} /></div>
            <div><label className="block text-sm font-bold mb-1">Furnishing</label><select className="w-full border p-2 rounded" value={data.furnishing} onChange={e=>setData({...data, furnishing: e.target.value})}><option value="unfurnished">Unfurnished</option><option value="semi-furnished">Semi-furnished</option><option value="fully-furnished">Fully-furnished</option></select></div>
          </div>
        </section>

        {/* Amenities */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold border-b pb-2">Amenities</h3>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {allAmenities.map(am => (
              <label key={am} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={data.amenities.includes(am)} onChange={() => handleAmenity(am)} /> {am}</label>
            ))}
          </div>
        </section>

        {/* Images */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold border-b pb-2">Images (URLs)</h3>
          {data.images.map((img, i) => (
            <div key={i} className="flex gap-2">
              <input className="flex-1 border p-2 rounded" placeholder="Image URL (e.g. Unsplash link)" value={img} onChange={e => handleImageChange(i, e.target.value)} />
              {img && <img src={img} className="w-10 h-10 object-cover rounded" />}
            </div>
          ))}
          {data.images.length < 10 && <button type="button" onClick={addImageField} className="text-sky-600 font-bold text-sm">+ Add More Image</button>}
        </section>

        <button disabled={loading} type="submit" className="w-full bg-sky-600 text-white font-bold py-3 rounded hover:bg-sky-700">{loading ? 'Saving...' : 'Submit Property'}</button>
      </form>
    </div>
  );
}`,
  'src/pages/owner/EditPropertyPage.jsx': `import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { propertiesAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';

export default function EditPropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    propertiesAPI.getById(id).then(res => {
      const p = res.data;
      setData({
        title: p.title, description: p.description, category: p.category, type: p.type, price: p.price,
        address: p.location?.address || '', city: p.location?.city || '', state: p.location?.state || '', zipCode: p.location?.zipCode || '', lat: p.location?.coordinates?.lat || '', lng: p.location?.coordinates?.lng || '',
        bedrooms: p.bedrooms, bathrooms: p.bathrooms, area: p.area || '', furnishing: p.furnishing || 'unfurnished',
        amenities: p.amenities || [], images: p.images?.length ? p.images : ['']
      });
      setLoading(false);
    }).catch(() => { toast.error('Error fetching property'); navigate('/my-listings'); });
  }, [id]);

  const allAmenities = ['WiFi', 'Parking', 'Pool', 'Gym', 'Security', 'Balcony', 'Power Backup', 'Lift', 'Garden', 'Playground'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...data, location: { address: data.address, city: data.city, state: data.state, zipCode: data.zipCode, coordinates: { lat: Number(data.lat), lng: Number(data.lng) } } };
      payload.images = data.images.filter(img => img.trim() !== '');
      await propertiesAPI.update(id, payload);
      toast.success('Property updated!');
      navigate('/my-listings');
    } catch(err) { toast.error('Failed to update property'); }
    setSubmitting(false);
  };

  if (loading) return <Spinner />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl shadow border">
        <h2 className="text-3xl font-bold">Edit Property</h2>
        <section className="space-y-4">
          <h3 className="text-xl font-semibold border-b pb-2">Basic Info</h3>
          <div><label className="block text-sm font-bold mb-1">Title</label><input required className="w-full border p-2 rounded" value={data.title} onChange={e=>setData({...data, title: e.target.value})} /></div>
          <div><label className="block text-sm font-bold mb-1">Description</label><textarea required className="w-full border p-2 rounded h-24" value={data.description} onChange={e=>setData({...data, description: e.target.value})} /></div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-sm font-bold mb-1">Category</label><select className="w-full border p-2 rounded" value={data.category} onChange={e=>setData({...data, category: e.target.value})}><option value="rent">Rent</option><option value="sale">Sale</option></select></div>
            <div><label className="block text-sm font-bold mb-1">Type</label><select className="w-full border p-2 rounded" value={data.type} onChange={e=>setData({...data, type: e.target.value})}><option value="apartment">Apartment</option><option value="house">House</option><option value="villa">Villa</option><option value="studio">Studio</option><option value="commercial">Commercial</option><option value="plot">Plot</option></select></div>
            <div><label className="block text-sm font-bold mb-1">Price (₹)</label><input type="number" required className="w-full border p-2 rounded" value={data.price} onChange={e=>setData({...data, price: e.target.value})} /></div>
          </div>
        </section>
        
        <section className="space-y-4">
          <h3 className="text-xl font-semibold border-b pb-2">Location</h3>
          <div><label className="block text-sm font-bold mb-1">Address</label><input required className="w-full border p-2 rounded" value={data.address} onChange={e=>setData({...data, address: e.target.value})} /></div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-sm font-bold mb-1">City</label><input required className="w-full border p-2 rounded" value={data.city} onChange={e=>setData({...data, city: e.target.value})} /></div>
          </div>
        </section>

        <button disabled={submitting} type="submit" className="w-full bg-sky-600 text-white font-bold py-3 rounded">{submitting ? 'Saving...' : 'Update Property'}</button>
      </form>
    </div>
  );
}`,
  'src/pages/owner/ManageListingsPage.jsx': `import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { propertiesAPI } from '../../services/api';
import { Edit, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';

export default function ManageListingsPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = () => {
    propertiesAPI.getMyListings().then(res => {
      setProperties(res.data);
      setLoading(false);
    });
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this property?')) {
      try {
        await propertiesAPI.delete(id);
        toast.success('Deleted successfully');
        fetchProperties();
      } catch(err) { toast.error('Error deleting'); }
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Listings</h2>
        <Link to="/list-property" className="bg-sky-600 text-white px-4 py-2 rounded font-bold hover:bg-sky-700">+ Add New Property</Link>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-20 bg-white border rounded">
          <p className="text-slate-500 mb-4">You haven't listed any properties yet. List one now!</p>
          <Link to="/list-property" className="bg-sky-600 text-white px-6 py-3 rounded">List Property</Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {properties.map(p => (
            <div key={p._id} className="bg-white p-4 rounded-lg shadow-sm border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={p.images?.[0]} className="w-20 h-20 object-cover rounded" />
                <div>
                  <h3 className="font-bold text-lg">{p.title}</h3>
                  <p className="text-sm text-slate-500">{p.location?.city} • ₹{p.price.toLocaleString('en-IN')}</p>
                  <div className="flex gap-2 mt-1">
                    <span className={\`text-xs px-2 py-1 rounded \${p.status==='approved'?'bg-green-100 text-green-700':p.status==='rejected'?'bg-red-100 text-red-700':'bg-yellow-100 text-yellow-700'}\`}>
                      {p.status.toUpperCase()}
                    </span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded flex items-center gap-1"><Eye size={12}/> {p.views}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Link to={\`/owner/properties/edit/\${p._id}\`} className="p-2 text-blue-500 hover:bg-blue-50 rounded"><Edit size={20}/></Link>
                <button onClick={() => handleDelete(p._id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={20}/></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}`,
  'src/pages/owner/OwnerInquiriesPage.jsx': `import React, { useEffect, useState } from 'react';
import { inquiriesAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';

export default function OwnerInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({});

  useEffect(() => { fetchInquiries(); }, []);

  const fetchInquiries = () => {
    inquiriesAPI.getAll().then(res => {
      setInquiries(res.data);
      setLoading(false);
    });
  };

  const handleReply = async (id) => {
    try {
      await inquiriesAPI.reply(id, replyText[id]);
      toast.success('Reply sent');
      fetchInquiries();
    } catch(err) { toast.error('Error replying'); }
  };

  if (loading) return <Spinner />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">Inquiries on My Properties</h2>
      {inquiries.length === 0 ? (
        <div className="text-center py-10 bg-white rounded border">No inquiries received yet.</div>
      ) : (
        <div className="space-y-4">
          {inquiries.map(inq => (
            <div key={inq._id} className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex gap-4 border-b pb-4 mb-4">
                <img src={inq.property?.images?.[0]} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-bold">{inq.property?.title}</h3>
                  <p className="text-sm text-slate-500">From: {inq.buyer?.name} ({inq.buyer?.email}) • {inq.phone}</p>
                  <p className="text-xs text-slate-400 mt-1">{new Date(inq.createdAt).toLocaleString()}</p>
                </div>
                <span className={\`text-xs px-2 py-1 rounded h-fit \${inq.status==='replied' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}\`}>
                  {inq.status.toUpperCase()}
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded text-sm mb-4">
                <strong>Message:</strong> <p>{inq.message}</p>
              </div>
              
              {inq.status === 'pending' ? (
                <div className="flex gap-2">
                  <textarea className="flex-1 border rounded p-2 text-sm h-10" placeholder="Type your reply..." value={replyText[inq._id] || ''} onChange={e => setReplyText({...replyText, [inq._id]: e.target.value})} />
                  <button onClick={() => handleReply(inq._id)} className="bg-sky-600 text-white px-4 rounded text-sm font-bold">Send Reply</button>
                </div>
              ) : (
                <div className="bg-sky-50 p-3 rounded text-sm border border-sky-100">
                  <strong>Your Reply:</strong> <p>{inq.reply}</p>
                  <p className="text-xs text-slate-400 mt-1">{new Date(inq.repliedAt).toLocaleString()}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}`
};

for (const [p, content] of Object.entries(files)) {
  const fullPath = path.join(basePath, p);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log('Frontend setup 3 created.');
