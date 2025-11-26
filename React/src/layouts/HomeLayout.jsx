import React from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from "react-hot-toast";

const HomeLayout = () => {
  return (
    <div>
        <Outlet/>
        <Toaster/>
    </div>
  )
}

export default HomeLayout