import React from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from "react-hot-toast";
import MarketNav from '../components/MarketNav'

const MarketLayout = () => {
  return (
    <div>
        <MarketNav/>
        <Outlet/>
        <Toaster/>
    </div>
  )
}

export default MarketLayout