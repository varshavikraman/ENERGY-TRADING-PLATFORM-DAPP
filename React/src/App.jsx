import React from 'react'
import {createBrowserRouter, RouterProvider, Navigate} from 'react-router-dom'
import Home from './pages/Home'
import ProducerRegister from './pages/ProducerRegister'
import AdminDashboard from './pages/AdminDashboard'
import MintTokens from './pages/MintTokens'
import ListEnergy from './pages/ListEnergy'
import BuyEnergy from './pages/BuyEnergy'
import AllProducers from './pages/AllProducers'
import HomeLayout from "./layouts/HomeLayout"
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout"

const router = createBrowserRouter([
  {
    element: <HomeLayout />,
    children: [
      {index:true, element:<Home />},
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "admin", element: <AdminDashboard />},
      { path: "allProducer-requested", element: <AllProducers />},
    ],
  },
  {
    element: <MainLayout />,
    children: [
      { path: "producer-register", element: <ProducerRegister /> },
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