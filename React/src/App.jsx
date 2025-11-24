import React from 'react'
import {createBrowserRouter, RouterProvider, Navigate} from 'react-router-dom'
import Home from './pages/Home'
import ProducerRegister from './pages/ProducerRegister'
import AdminDashboard from './pages/AdminDashboard'
import MintTokens from './pages/MintTokens'
import ListEnergy from './pages/ListEnergy'
import BuyEnergy from './pages/BuyEnergy'
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout"
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {index:true, element:<Home />},
    ],
  },
  {
    element: <MainLayout />,
    children: [
      { path: "producer-register", element: <ProducerRegister /> },
      { path: "admin", element: ( <ProtectedAdminRoute> <AdminDashboard /></ProtectedAdminRoute>)},
      { path: "mint", element: <MintTokens /> },
      { path: "list", element: <ListEnergy /> },
      { path: "market", element: <BuyEnergy /> },
    ],
  },
])
const App = () => {
  return <RouterProvider router={router} />
}

export default App