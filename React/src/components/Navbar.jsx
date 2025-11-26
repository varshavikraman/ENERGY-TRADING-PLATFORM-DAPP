import React from 'react'
import { Link } from 'react-router-dom'
import { useWallet } from "../context/WalletContext";
import logo from '../assets/Ecoflow_logo.png'

const Navbar = () => {
    const { address, connectWallet, disconnectWallet } = useWallet();

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
                            to="/producer-register"
                            className="px-4 py-2.5 rounded-xl text-base font-semibold transition-all duration-200 flex items-center space-x-2 text-white hover:bg-emerald-400 hover:shadow-sm hover:translate-y-[-1px]"
                        >
                            Producer Register
                        </Link>
                        <Link 
                            to="/mint"
                            className="px-4 py-2.5 rounded-xl text-base font-semibold transition-all duration-200 flex items-center space-x-2 text-white hover:bg-emerald-400 hover:shadow-sm hover:translate-y-[-1px]"
                        >
                            Mint Tokens
                        </Link>
                        <Link 
                            to="/list"
                            className="px-4 py-2.5 rounded-xl text-base font-semibold transition-all duration-200 flex items-center space-x-2 text-white hover:bg-emerald-400 hover:shadow-sm hover:translate-y-[-1px]"
                        >
                            List Energy
                        </Link>
                    </div>
                    

                    <div className="flex items-center space-x-4">
                        {address ? (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-3 bg-emerald-700/80 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-emerald-400/30">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-sm"></div>
                                    <span className="text-white text-base font-medium font-mono">
                                        {address.slice(0, 8)}...{address.slice(-6)}
                                    </span>
                                </div>
                                
                                <button 
                                    onClick={disconnectWallet}
                                    className="bg-white text-emerald-600 hover:bg-gray-50 px-5 py-2.5 rounded-xl text-base font-semibold transition-all duration-200 shadow hover:shadow-md hover:translate-y-[-1px] border border-emerald-200 flex items-center space-x-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <span>Disconnect</span>
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={connectWallet}
                                className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-gray-900 px-6 py-2.5 rounded-xl text-base font-bold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center space-x-3 border border-amber-300"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span>Connect Wallet</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar