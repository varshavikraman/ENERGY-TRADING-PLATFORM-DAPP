import React, { useState } from "react";
import { useWallet } from "../context/WalletContext";
import { writeContract } from 'viem/actions';
import ET from '../assets/ET.json';
import { keccak256, toBytes } from "viem";

const ProducerRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        capacity: '',
        aadhaar: ''
    });

    const { address, connectWallet, client } = useWallet();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!address) {
                await connectWallet();
            }

            const hashedAadhaar = keccak256(toBytes(formData.aadhaar));

            const tx = await writeContract(client, {
                address: ET.Hoodi_REGISTRY_ADDRESS,
                abi: ET.ProducerRegistryABI,
                functionName: "requestProducerApproval",
                args: [
                    formData.name,
                    formData.location,
                    BigInt(formData.capacity),
                    hashedAadhaar
                ],
                account: address,
            });

            // alert("Producer request submitted!");
            toast.success("Producer request submitted!");
            console.log("Tx Hash:", tx);

            setFormData({
                name: "",
                location: "",
                capacity: "",
                aadhaar: ""
            });
        } catch (err) {
            console.error(err);
            // alert("Transaction failed!");
            toast.error("Transaction failed!");
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
            <div className="max-w-md mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-200">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">Producer Registration</h2>
                        <p className="text-gray-600 mt-2">Register as an energy producer on the platform</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Producer Name
                            </label>
                            <input 
                                type="text" 
                                name="name"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location
                            </label>
                            <input 
                                type="text" 
                                name="location"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                                placeholder="Enter your location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Production Capacity
                            </label>
                            <input 
                                type="number" 
                                name="capacity"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                                placeholder="Enter capacity in units"
                                value={formData.capacity}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Aadhaar No.
                            </label>
                            <input 
                                type="text" 
                                name="aadhaar"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                                placeholder="Enter Aadhaar or IPFS hash"
                                value={formData.aadhaar}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                        >
                            Request Approval
                        </button>
                    </form>

                    {!address && (
                        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
                            <p className="text-amber-700 text-sm">
                                Please connect your wallet to submit the registration
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProducerRegister