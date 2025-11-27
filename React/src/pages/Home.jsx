import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import { useWallet } from "../context/WalletContext";
import { readContract } from "viem/actions";
import ET from "../assets/ET.json";

const Home = () => {
    const { client, address, connectWallet, disconnectWallet } = useWallet();
    const [admin, setAdmin] = useState(null);
    
    useEffect(() => {
        async function load() {
            if (!client) return;
            const a = await readContract(client, {
                address: ET.Hoodi_REGISTRY_ADDRESS,
                abi: ET.ProducerRegistryABI,
                functionName: "admin",
            });
            console.log(a)
            setAdmin(a);
        }
        load();
    }, [client]);

    const isAdmin = address && admin && address.toLowerCase() === admin.toLowerCase();

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
            <div className="flex justify-end mb-8">
                    {address ? (
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3 bg-emerald-700/80 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-emerald-400/30">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-sm"></div>
                                <span className="text-white text-sm font-medium font-mono">
                                    {address.slice(0, 8)}...{address.slice(-6)}
                                </span>
                            </div>
                            <button 
                                onClick={disconnectWallet}
                                className="bg-white text-emerald-600 hover:bg-gray-50 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow hover:shadow-md hover:translate-y-[-1px] border border-emerald-200 flex items-center space-x-2"
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
                            className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-gray-900 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center space-x-3 border border-amber-300"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span>Connect Wallet</span>
                        </button>
                    )}
            </div>

            <div className="max-w-4xl mx-auto">                
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Welcome to Energy Trading DApp
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Connect your wallet to interact with the marketplace and producer tools for sustainable energy trading.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-6 mb-8 justify-center items-center">
                    {isAdmin && (
                        <Link 
                            to="/admin" 
                            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px] border border-green-200 group w-full md:w-auto min-w-[300px]"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors">
                                        Admin Dashboard
                                    </h3>
                                    <p className="text-sm text-gray-600">Manage platform settings and users</p>
                                </div>
                            </div>
                        </Link>
                    )}
                    <Link 
                        to="/producer" 
                        className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px] border border-green-200 group w-full md:w-auto min-w-[300px]"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <h3 className="font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors">
                                    Producer Registry
                                </h3>
                                <p className="text-sm text-gray-600">Manage platform settings and users</p>
                            </div>
                        </div>
                    </Link>
                    <Link 
                        to="/market" 
                        className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px] border border-green-200 group w-full md:w-auto min-w-[300px]"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <h3 className="font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors">
                                    Marketplace
                                </h3>
                                <p className="text-sm text-gray-600">Trade energy tokens and assets</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Home