const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'client');

const files = {
  'src/pages/admin/AdminDashboard.jsx': `import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { Users, Home, AlertCircle, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import Spinner from '../../components/common/Spinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats().then(res => {
      setStats(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Spinner />;

  const StatCard = ({ title, value, icon, color }) => (
    <div className={\`bg-white p-6 rounded-xl shadow-sm border-l-4 \${color}\`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-slate-500 text-sm font-semibold">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-full">{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      
      {stats.pendingProperties > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg mb-6 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold"><AlertCircle /> ⚠️ {stats.pendingProperties} properties awaiting approval</div>
          <Link to="/admin/properties?status=pending" className="bg-yellow-500 text-white px-4 py-2 rounded text-sm font-bold">Review Now</Link>
        </div>
      )}

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Users" value={stats.totalUsers} icon={<Users className="text-blue-500"/>} color="border-blue-500" />
        <StatCard title="Total Properties" value={stats.totalProperties} icon={<Home className="text-indigo-500"/>} color="border-indigo-500" />
        <StatCard title="Pending Approval" value={stats.pendingProperties} icon={<AlertCircle className="text-yellow-500"/>} color="border-yellow-500" />
        <StatCard title="Total Inquiries" value={stats.totalInquiries} icon={<MessageSquare className="text-purple-500"/>} color="border-purple-500" />
        <StatCard title="Approved Listings" value={stats.approvedProperties} icon={<CheckCircle className="text-green-500"/>} color="border-green-500" />
        <StatCard title="Rejected Listings" value={stats.rejectedProperties} icon={<XCircle className="text-red-500"/>} color="border-red-500" />
        <StatCard title="Buyers" value={stats.buyerCount} icon={<Users className="text-teal-500"/>} color="border-teal-500" />
        <StatCard title="Owners" value={stats.ownerCount} icon={<Users className="text-orange-500"/>} color="border-orange-500" />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Recent Properties</h3>
            <Link to="/admin/properties" className="text-sm text-sky-600 hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {stats.recentProperties.map(p => (
              <div key={p._id} className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center gap-3">
                  <img src={p.images?.[0]} className="w-10 h-10 rounded object-cover" />
                  <div><p className="text-sm font-bold">{p.title}</p><p className="text-xs text-slate-500">By {p.owner?.name}</p></div>
                </div>
                <span className={\`text-xs px-2 py-1 rounded \${p.status==='approved'?'bg-green-100 text-green-700':p.status==='rejected'?'bg-red-100 text-red-700':'bg-yellow-100 text-yellow-700'}\`}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Recent Users</h3>
            <Link to="/admin/users" className="text-sm text-sky-600 hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {stats.recentUsers.map(u => (
              <div key={u._id} className="flex justify-between items-center border-b pb-2">
                <div><p className="text-sm font-bold">{u.name}</p><p className="text-xs text-slate-500">{u.email}</p></div>
                <span className="text-xs bg-slate-100 px-2 py-1 rounded">{u.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}`,
  'src/pages/admin/AdminPropertiesPage.jsx': `import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminAPI, propertiesAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Check, X, Trash2 } from 'lucide-react';
import Spinner from '../../components/common/Spinner';

export default function AdminPropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentTab = searchParams.get('status') || 'all';

  useEffect(() => { fetchProperties(); }, [currentTab]);

  const fetchProperties = () => {
    setLoading(true);
    adminAPI.getProperties({ status: currentTab }).then(res => {
      setProperties(res.data);
      setLoading(false);
    });
  };

  const handleStatus = async (id, status) => {
    try {
      await adminAPI.updatePropertyStatus(id, status);
      toast.success(\`Property \${status}\`);
      fetchProperties();
    } catch(err) { toast.error('Error updating'); }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Delete this property entirely?')) {
      try {
        await propertiesAPI.delete(id);
        toast.success('Deleted');
        fetchProperties();
      } catch(err) { toast.error('Error deleting'); }
    }
  };

  const tabs = ['all', 'pending', 'approved', 'rejected'];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Manage Properties</h2>
      
      <div className="flex gap-2 mb-6 border-b">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setSearchParams({ status: tab })} className={\`px-4 py-2 capitalize font-semibold border-b-2 \${currentTab === tab ? 'border-sky-600 text-sky-600' : 'border-transparent text-slate-500'}\`}>
            {tab}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : (
        <div className="bg-white rounded-lg shadow border overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b">
                <th className="p-3 text-sm">Property</th>
                <th className="p-3 text-sm">Owner</th>
                <th className="p-3 text-sm">Details</th>
                <th className="p-3 text-sm">Status</th>
                <th className="p-3 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map(p => (
                <tr key={p._id} className="border-b hover:bg-slate-50">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0]} className="w-12 h-12 rounded object-cover" />
                      <div><p className="font-bold text-sm w-48 truncate" title={p.title}>{p.title}</p><p className="text-xs text-sky-600">₹{p.price}</p></div>
                    </div>
                  </td>
                  <td className="p-3 text-sm"><div>{p.owner?.name}</div><div className="text-xs text-slate-500">{p.owner?.email}</div></td>
                  <td className="p-3 text-sm capitalize">{p.location?.city} • {p.category} • {p.type}</td>
                  <td className="p-3">
                    <span className={\`text-xs px-2 py-1 rounded \${p.status==='approved'?'bg-green-100 text-green-700':p.status==='rejected'?'bg-red-100 text-red-700':'bg-yellow-100 text-yellow-700'}\`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      {p.status !== 'approved' && <button onClick={() => handleStatus(p._id, 'approved')} className="p-1 bg-green-100 text-green-700 rounded" title="Approve"><Check size={16}/></button>}
                      {p.status !== 'rejected' && <button onClick={() => handleStatus(p._id, 'rejected')} className="p-1 bg-red-100 text-red-700 rounded" title="Reject"><X size={16}/></button>}
                      <button onClick={() => handleDelete(p._id)} className="p-1 bg-slate-200 text-slate-600 rounded ml-2" title="Delete"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {properties.length === 0 && <tr><td colSpan="5" className="p-4 text-center text-slate-500">No properties found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}`,
  'src/pages/admin/AdminUsersPage.jsx': `import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import Spinner from '../../components/common/Spinner';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = () => {
    adminAPI.getUsers().then(res => {
      setUsers(res.data);
      setLoading(false);
    });
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await adminAPI.updateUser(id, { role: newRole });
      toast.success('Role updated');
      fetchUsers();
    } catch(err) { toast.error('Error updating role'); }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Delete this user? This cannot be undone.')) {
      try {
        await adminAPI.deleteUser(id);
        toast.success('User deleted');
        fetchUsers();
      } catch(err) { toast.error(err.response?.data?.message || 'Error deleting user'); }
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Manage Users</h2>
      <div className="bg-white rounded-lg shadow border overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b">
              <th className="p-3 text-sm">Name</th>
              <th className="p-3 text-sm">Email</th>
              <th className="p-3 text-sm">Phone</th>
              <th className="p-3 text-sm">Joined</th>
              <th className="p-3 text-sm">Role</th>
              <th className="p-3 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-b hover:bg-slate-50">
                <td className="p-3 text-sm font-bold">{u.name} {u._id === currentUser._id && '(You)'}</td>
                <td className="p-3 text-sm">{u.email}</td>
                <td className="p-3 text-sm">{u.phone || '-'}</td>
                <td className="p-3 text-sm text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <select 
                    value={u.role} 
                    onChange={e => handleRoleChange(u._id, e.target.value)} 
                    disabled={u._id === currentUser._id}
                    className="border rounded p-1 text-sm bg-white"
                  >
                    <option value="buyer">Buyer</option>
                    <option value="owner">Owner</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-3">
                  <button 
                    onClick={() => handleDelete(u._id)} 
                    disabled={u._id === currentUser._id}
                    className="p-2 text-red-500 hover:bg-red-50 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <Trash2 size={18}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
console.log('Frontend setup 4 created.');
