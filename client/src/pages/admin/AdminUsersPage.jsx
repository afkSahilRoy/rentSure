import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Spinner from '../../components/common/Spinner';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    adminAPI
      .getUsers()
      .then((res) => {
        setUsers(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await adminAPI.updateUser(id, { role: newRole });
      toast.success('User role permission updated');
      fetchUsers();
    } catch (err) {
      toast.error('Error updating user role');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this user account? This cannot be undone.')) {
      try {
        await adminAPI.deleteUser(id);
        toast.success('User account removed');
        fetchUsers();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Error deleting user');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F5F1EB]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-[#F5F1EB] min-h-screen text-[#3E362E] py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            to="/admin"
            className="text-xs uppercase tracking-widest text-[#766B61] hover:text-[#3E362E] flex items-center gap-1.5 transition-colors font-semibold"
          >
            <ArrowLeft size={14} />
            <span>Return to Dashboard</span>
          </Link>
          <span className="text-[10px] uppercase tracking-widest text-[#AC8968] font-bold">
            USER ACCESS CONTROL
          </span>
        </div>

        <div className="mb-8 pb-4 border-b border-[#DDD5CC]">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#3E362E]">
            Registered Members
          </h1>
          <p className="text-xs text-[#766B61] mt-1">
            Manage access credentials, role permissions, and active member accounts.
          </p>
        </div>

        <div className="bg-white rounded-sm border border-[#DDD5CC] shadow-xs overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F1EB] border-b border-[#DDD5CC] text-[10px] uppercase tracking-widest text-[#766B61] font-semibold">
                <th className="p-4">Legal Name</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4">Platform Role</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD5CC]/60 text-xs">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-[#F5F1EB]/30 transition-colors">
                  <td className="p-4 font-bold text-[#3E362E]">
                    {u.name} {u._id === currentUser._id && <span className="text-[10px] text-[#AC8968] font-normal ml-1">(Active Session)</span>}
                  </td>
                  <td className="p-4 text-[#766B61]">{u.email}</td>
                  <td className="p-4 text-[#766B61]">{u.phone || '—'}</td>
                  <td className="p-4 text-[#766B61]">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      disabled={u._id === currentUser._id}
                      className="bg-[#F5F1EB]/60 border border-[#DDD5CC] rounded-xs p-1.5 text-xs text-[#3E362E] font-medium focus:outline-none focus:border-[#865D36] disabled:opacity-60 cursor-pointer"
                    >
                      <option value="buyer">Buyer</option>
                      <option value="owner">Owner</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(u._id)}
                      disabled={u._id === currentUser._id}
                      className="p-1.5 text-[#766B61] hover:text-red-600 hover:bg-red-50 border border-[#DDD5CC] rounded-xs transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                      title={u._id === currentUser._id ? 'Cannot delete active admin account' : 'Delete Member'}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}