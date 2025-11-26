import React, { useEffect, useState } from "react";
import { useWallet } from "../context/WalletContext";
import { readContract, getLogs } from "viem/actions";
import ET from "../assets/ET.json";
import { formatEther } from "viem";

const MarketplaceDashboard = () => {
    const { client } = useWallet();

    const [marketBalance, setMarketBalance] = useState(0n);
    const [totalSold, setTotalSold] = useState(0n);
    const [totalEth, setTotalEth] = useState(0n);
    const [loading, setLoading] = useState(true);

    async function loadMarketplaceBalance() {
        const bal = await readContract(client, {
            address: ET.Hoodi_TOKEN_ADDRESS,
            abi: ET.EnergyTokenABI,
            functionName: "balanceOf",
            args: [ET.Hoodi_MARKETPLACE_ADDRESS],
        });
        setMarketBalance(bal);
    }

    const energyPurchasedEvent = ET.EnergyMarketplaceABI.find(
        (x) => x.type === "event" && x.name === "EnergyPurchased"
    );

    async function loadTokensSold() {
        const logs = await getLogs(client, {
            address: ET.Hoodi_MARKETPLACE_ADDRESS,
            event: energyPurchasedEvent,
        });

        let sold = 0n;

        logs.forEach(log => {
            sold += log.args.amount; 
        });

        setTotalSold(sold);
    }

    async function loadEthEarned() {
        const logs = await getLogs(client, {
            address: ET.Hoodi_MARKETPLACE_ADDRESS,
            event: energyPurchasedEvent,
        });

        let total = 0n;

        logs.forEach(log => {
            total += log.args.totalCost; 
        });

        setTotalEth(total);
    }

    useEffect(() => {
        async function loadAll() {
            try {
                await loadMarketplaceBalance();
                await loadTokensSold();
                await loadEthEarned();
            } catch (error) {
                console.error("Dashboard error:", error);
            } finally {
                setLoading(false);
            }
        }

        loadAll();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Marketplace Analytics</h2>
                    <p className="text-gray-600">Real-time marketplace performance metrics</p>
                </div>
                <div>
                    {loading ? (
                        <div className="bg-white text-center py-12">
                            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading marketplace analytics...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-all duration-200">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Tokens Locked</h3>
                                <p className="text-green-600 font-bold text-2xl">
                                    {marketBalance.toString()} ENG
                                </p>
                                <p className="text-gray-500 text-sm mt-2">Available in marketplace</p>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-all duration-200">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Tokens Sold</h3>
                                <p className="text-emerald-600 font-bold text-2xl">
                                    {totalSold.toString()} ENG
                                </p>
                                <p className="text-gray-500 text-sm mt-2">Total energy traded</p>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-all duration-200">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">ETH Earned</h3>
                                <p className="text-green-700 font-bold text-2xl">
                                    {formatEther(totalEth)} ETH
                                </p>
                                <p className="text-gray-500 text-sm mt-2">Total revenue generated</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MarketplaceDashboard;