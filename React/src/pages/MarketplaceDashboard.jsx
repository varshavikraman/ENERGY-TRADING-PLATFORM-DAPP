import React, { useEffect, useState } from "react";
import { useWallet } from "../context/WalletContext";
import { readContract, getLogs, getBalance } from "viem/actions";
import ET from "../assets/ET.json";
import { formatEther } from "viem";

const MarketplaceDashboard = () => {
    const { client, address } = useWallet();

    const [marketBalance, setMarketBalance] = useState(0n);
    const [totalSold, setTotalSold] = useState(0n);
    const [totalEth, setTotalEth] = useState(0n);

    const [walletBalance, setWalletBalance] = useState(0n);
    const [userTokens, setUserTokens] = useState(0n);
    const [purchasesCount, setPurchasesCount] = useState(0);

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

    async function loadMarketplaceSalesMetrics() {
        const logs = await getLogs(client, {
            address: ET.Hoodi_MARKETPLACE_ADDRESS,
            abi: ET.EnergyMarketplaceABI, 
            eventName: "EnergyPurchased",
        });

        let sold = 0n;
        let total = 0n;
        
        logs.forEach(log => {
            sold += log.args.amount;
            total += log.args.totalCost;
        });

        setTotalSold(sold);
        setTotalEth(total);
    }

    async function loadWalletBalance() {
        if (!address) return;
        const bal = await getBalance(client,{ address });
        setWalletBalance(bal);
    }

    async function loadUserTokens() {
        if (!address) return;

        const bal = await readContract(client, {
            address: ET.Hoodi_TOKEN_ADDRESS,
            abi: ET.EnergyTokenABI,
            functionName: "balanceOf",
            args: [address],
        });

        setUserTokens(bal);
    }

    async function loadUserPurchases() {
        if (!address) return;

        const logs = await getLogs(client, {
            address: ET.Hoodi_MARKETPLACE_ADDRESS,
            abi: ET.EnergyMarketplaceABI,
            eventName: "EnergyPurchased",
            args: { buyer: address }, 
        });

        setPurchasesCount(logs.length);
    }

    useEffect(() => {
        async function loadAll() {
            setLoading(true); 
            try {
                await loadMarketplaceBalance();
                await loadMarketplaceSalesMetrics(); 

                if (address) {
                    await loadWalletBalance();
                    await loadUserTokens();
                    await loadUserPurchases();
                }
            } catch (error) {
                console.error("Dashboard Error:", error);
            } finally {
                setLoading(false);
            }
        }

        if (client) loadAll();
    }, [client, address]);


    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Marketplace Analytics</h2>
                    <p className="text-gray-600">Real-time marketplace & user performance metrics</p>
                </div>

                {loading ? (
                    <div className="bg-white text-center py-12 rounded-xl shadow-md">
                        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading marketplace analytics...</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Marketplace Overview</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-all">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Tokens Locked</h3>
                                    <p className="text-green-600 font-bold text-2xl">{marketBalance.toString()} ENG</p>
                                    <p className="text-gray-500 text-sm mt-2">Available in marketplace</p>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-all">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Tokens Sold</h3>
                                    <p className="text-emerald-600 font-bold text-2xl">{totalSold.toString()} ENG</p>
                                    <p className="text-gray-500 text-sm mt-2">Total energy traded</p>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-all">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">ETH Earned</h3>
                                    <p className="text-green-700 font-bold text-2xl">{formatEther(totalEth)} ETH</p>
                                    <p className="text-gray-500 text-sm mt-2">Total revenue generated</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Dashboard</h3>
                            {address ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-all">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Wallet Balance</h3>
                                        <p className="text-green-700 font-bold text-2xl">{formatEther(walletBalance)} ETH</p>
                                        <p className="text-gray-500 text-sm mt-2">Your connected wallet balance</p>
                                    </div>

                                    <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-all">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Your ENG Tokens</h3>
                                        <p className="text-emerald-600 font-bold text-2xl">{userTokens.toString()} ENG</p>
                                        <p className="text-gray-500 text-sm mt-2">Energy tokens in your wallet</p>
                                    </div>

                                    <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-all">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Purchases Made</h3>
                                        <p className="text-indigo-600 font-bold text-2xl">{purchasesCount}</p>
                                        <p className="text-gray-500 text-sm mt-2">Completed energy purchases</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-white border border-gray-200 rounded-xl shadow-md">
                                    <p className="text-gray-600">Connect your wallet to view your personal metrics.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarketplaceDashboard;