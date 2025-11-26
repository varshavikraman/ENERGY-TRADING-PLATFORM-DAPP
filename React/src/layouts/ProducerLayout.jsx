import React from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from "react-hot-toast";
import Navbar from '../components/Navbar'

const ProducerLayout = () => {
  return (
    <div>
        <Navbar/>
        <Outlet/>
        <Toaster/>
    </div>
  )
}

export default ProducerLayout