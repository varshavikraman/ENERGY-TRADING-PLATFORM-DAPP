import React from 'react'
import ProtectedAdminRoute from '../components/ProtectedAdminRoute'
import { Outlet } from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import AdminNav from '../components/AdminNav'

const AuthLayout = () => {
  return (
    <ProtectedAdminRoute>
      <AdminNav />
      <Outlet />
      <ToastContainer />
    </ProtectedAdminRoute>
  );
};

export default AuthLayout