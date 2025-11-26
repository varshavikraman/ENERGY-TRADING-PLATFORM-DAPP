import React, { useState } from "react";
import { useWallet } from "../context/WalletContext";
import { writeContract, readContract } from "viem/actions";
import ET from "../assets/ET.json";  
import {  parseEther } from "viem";
import toast from "react-hot-toast";

const ListEnergy = () => {
    const { address, connectWallet, client } = useWallet();
    const [amt, setAmt] = useState("");
    const [price, setPrice] = useState("");

    const list = async () => {
        try {
            if (!address) await connectWallet();

            // 1. Approve marketplace to spend tokens
            const approveTx = await writeContract(client, {
                address: ET.Hoodi_TOKEN_ADDRESS,
                abi: ET.EnergyTokenABI,
                functionName: "approve",
                args: [ET.Hoodi_MARKETPLACE_ADDRESS, BigInt(amt)],
                account: address,
            });
            console.log("Approve Tx:", approveTx);

            // 2. Now list energy
            const tx = await writeContract(client, {
                address: ET.Hoodi_MARKETPLACE_ADDRESS,
                abi: ET.EnergyMarketplaceABI,
                functionName: "listEnergy",
                args: [
                    BigInt(amt),
                    parseEther(price)
                ],
                account: address,
            });

            console.log("List Tx:", tx);

            // alert("Energy listed successfully!");
            toast.success("Energy listed successfully!");
            setAmt("");
            setPrice("");
        } catch (err) {
            console.error(err);
            // alert("Listing failed!");
            toast.error("Listing failed!");
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
            <div className="max-w-md mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-200">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">List Energy for Sale</h2>
                        <p className="text-gray-600 mt-2">Sell your energy tokens on the marketplace</p>
                    </div>
                    {!address && (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
                            <p className="text-amber-700 text-sm">
                                Please connect your wallet to list energy
                            </p>
                        </div>
                    )}
                    <div className="mt-4 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                               Token Amount 
                            </label>
                            <input
                                type="number"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                                placeholder="Enter token amount"
                                value={amt}
                                onChange={(e) => setAmt(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price per Token
                            </label>
                            <input
                                type="number"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                                placeholder="Enter price per token"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            onClick={list}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center space-x-2"
                        >
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>List Energy</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListEnergy;