import React from 'react';
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
}