import React from 'react'
import { Outlet } from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import MarketNav from '../components/MarketNav'

const MarketLayout = () => {
  return (
    <div>
        <MarketNav/>
        <Outlet/>
        <ToastContainer/>
    </div>
  )
}

export default MarketLayout