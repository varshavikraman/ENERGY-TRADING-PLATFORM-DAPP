import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/Ecoflow_logo.png'

const AdminNav = () => {
  return (
    <nav className="bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg border-b border-emerald-400">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <Link 
                                to="/" 
                                className="flex items-center space-x-3 group"
                                >
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow overflow-hidden">
                                        <img src={logo} alt="logo" className="h-20 w-20 object-contain" />
                                    </div>
                                    <span className="font-bold text-white text-xl tracking-tight group-hover:text-green-100 transition-colors">
                                        EcoFlow
                                    </span>
                            </Link>
                        </div>
    
                        <div className="flex items-center space-x-1">
                            <Link 
                                to="/admin"
                                className="px-4 py-2.5 rounded-xl text-base font-semibold transition-all duration-200 flex items-center space-x-2 text-white hover:bg-emerald-400 hover:shadow-sm hover:translate-y-[-1px]"
                            >
                                Admin Dashboard
                            </Link>
                            <Link 
                                to="/allProducer-requested"
                                className="px-4 py-2.5 rounded-xl text-base font-semibold transition-all duration-200 flex items-center space-x-2 text-white hover:bg-emerald-400 hover:shadow-sm hover:translate-y-[-1px]"
                            >
                                Requested Producers
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
  )
}

export default AdminNav