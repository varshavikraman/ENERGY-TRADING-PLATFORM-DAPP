import React, { useEffect, useState } from "react";
import { useWallet } from "../context/WalletContext";
import { readContract, writeContract } from "viem/actions";
import { formatEther } from "viem";
import ET from "../assets/ET.json";

const BuyEnergy = () => {
    const { address, connectWallet, client } = useWallet();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [txHash, setTxHash] = useState(null);

    // Load all listings
    async function loadListings() {
        try {
            setLoading(true);

            const count = await readContract(client, {
                address: ET.MARKETPLACE_ADDRESS,
                abi: ET.EnergyMarketplaceABI,
                functionName: "listingCount",
            });

            const items = [];
            for (let i = 0; i < Number(count); i++) {
                const listing = await readContract(client, {
                    address: ET.MARKETPLACE_ADDRESS,
                    abi: ET.EnergyMarketplaceABI,
                    functionName: "listings",
                    args: [i],
                });

                // listing = [producer, amount, price, active]
                if (listing[3] === true) {
                    items.push({
                        id: i,
                        producer: listing[0],
                        amount: Number(listing[1]),
                        priceWei: BigInt(listing[2]),
                        priceEth: formatEther(listing[2])
                    });
                }
            }

            setListings(items);
        } catch (err) {
            console.error(err);
            alert("Failed to load listings!");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadListings();
    }, []);

    // BUY FULL LISTING (no user input)
    const buy = async (listingId, amt, priceWei) => {
        try {
            if (!address) await connectWallet();

            //const amt = BigInt(amount);   // auto amount
            const totalCost = BigInt(amt) * priceWei;    // full lot price

            console.log("Buying:", amt.toString(), "ENG");
            console.log("Total cost (wei):", totalCost.toString());

            const tx = await writeContract(client, {
                address: ET.MARKETPLACE_ADDRESS,
                abi: ET.EnergyMarketplaceABI,
                functionName: "buyEnergy",
                args: [listingId, amt],
                value: totalCost,
                account: address,
            });

            //await client.waitForTransactionReceipt({ hash: tx });
            setTxHash(tx);
            alert("Energy Purchased!");

            loadListings();
        } catch (error) {
            console.error("Buy Error:", error);
            alert("Purchase failed!");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Energy Marketplace</h2>
                    <p className="text-gray-600 mt-2">Buy energy tokens from producers</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-200">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-gray-800">Available Listings</h3>
                        <button
                            onClick={loadListings}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-200"
                        >
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Refresh</span>
                        </button>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="text-center py-8">
                            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading marketplace listings...</p>
                        </div>
                    )}

                    {/* No listings */}
                    {listings.length === 0 && !loading ? (
                        <div className="text-center py-8">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <p className="text-gray-500">No active energy listings available</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {listings.map((ls) => (
                                <div key={ls.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 bg-white">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800 mb-2">Energy Listing #{ls.id + 1}</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-gray-500">Producer:</span>
                                                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                                        {ls.producer.slice(0, 6)}...{ls.producer.slice(-4)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-gray-500">Available:</span>
                                                    <span className="font-semibold text-green-600">{ls.amount} ENG</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-gray-500">Price:</span>
                                                    <span className="font-semibold text-emerald-600">{ls.priceEth} ETH</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Buy entire listing */}
                                    <button
                                        onClick={() => buy(ls.id, ls.amount, ls.priceWei)}
                                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow hover:shadow-md flex items-center justify-center space-x-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <span>Buy Now</span>
                                        <span>{ls.amount} ENG</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Transaction Hash */}
                    {txHash && (
                        <div className="mt-6 bg-green-50 border border-green-200 p-4 rounded-xl">
                            <p className="font-medium text-green-700">Purchase Successful!</p>
                            <p className="text-xs break-all">{txHash}</p>
                        </div>
                    )}
                    {!address && (
                        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
                            <p className="text-amber-700 text-sm">
                                Please connect your wallet to purchase energy
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BuyEnergy;
