import React from 'react'
import ProtectedAdminRoute from '../components/ProtectedAdminRoute'
import { Outlet } from 'react-router-dom'
import { Toaster } from "react-hot-toast";
import AdminNav from '../components/AdminNav'

const AuthLayout = () => {
  return (
    <ProtectedAdminRoute>
      <AdminNav />
      <Outlet />
      <Toaster />
    </ProtectedAdminRoute>
  );
};

export default AuthLayout