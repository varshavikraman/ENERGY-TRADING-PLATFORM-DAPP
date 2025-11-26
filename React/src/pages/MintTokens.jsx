import React, { useState, useEffect } from "react";
import { useWallet } from "../context/WalletContext";
import { writeContract, readContract } from "viem/actions";
import ET from "../assets/ET.json";  

const MintTokens = () => {
    const { address, client, connectWallet } = useWallet();
    const [amount, setAmount] = useState("");
    const [balance, setBalance] = useState(0n);

    const loadBalance = async () => {
        if (!address) return;

        const bal = await readContract(client, {
            address: ET.TOKEN_ADDRESS,
            abi: ET.EnergyTokenABI,
            functionName: "balanceOf",
            args: [address],
        });

        setBalance(bal);
    };

    useEffect(() => {
        if (client && address) loadBalance();
    }, [client, address]);

    const mint = async () => {
        try {
            if (!address) await connectWallet();

            const tx = await writeContract(client, {
                address: ET.TOKEN_ADDRESS,
                abi: ET.EnergyTokenABI,
                functionName: "mintEnergy",
                args: [BigInt(amount)],
                account: address,
            });

            console.log("Tx Hash:", tx);
            
            await client.waitForTransactionReceipt({ hash: tx });

            alert("Mint successful!");

            setAmount("");

            await loadBalance();
        } catch (err) {
            console.error(err);
            alert("Mint failed!");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
            <div className="flex justify-end mb-8">
                    <div className="p-4 bg-white border border-green-200 rounded-xl shadow-sm">
                        <p className="text-gray-700 font-medium">
                            Your Total Minted Tokens: 
                            <span className="font-bold text-green-700 ml-2">{balance.toString()}</span>
                        </p>
                    </div>
                </div>
            <div className="max-w-md mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-200">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">Mint Energy Tokens</h2>
                        <p className="text-gray-600 mt-2">Create new energy tokens for trading</p>
                    </div>
                    {!address && (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
                            <p className="text-amber-700 text-sm">
                                Please connect your wallet to mint tokens
                            </p>
                        </div>
                    )}
                    <div className="my-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Amount to Mint
                        </label>
                        <input
                            type="number"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                            placeholder="Enter amount in units"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        onClick={mint}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center space-x-2"
                    >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Mint Tokens</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MintTokens;