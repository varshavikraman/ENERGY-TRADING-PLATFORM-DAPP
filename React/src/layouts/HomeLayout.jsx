import React from 'react'
import { Outlet } from 'react-router-dom'
import {ToastContainer} from 'react-toastify'

const HomeLayout = () => {
  return (
    <div>
        <Outlet/>
        <ToastContainer/>
    </div>
  )
}

export default HomeLayout