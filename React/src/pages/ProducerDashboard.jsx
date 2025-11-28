import React, { useEffect, useState } from "react";
import { useWallet } from "../context/WalletContext";
import { readContract, getLogs, getContractEvents } from "viem/actions";
import ET from "../assets/ET.json"; 
import { formatEther } from "viem";
import toast from "react-hot-toast";

const ProducerDashboard = () => {
  const { client, address, connectWallet } = useWallet();

  const [producerDetails, setProducerDetails] = useState({});
  const [minted, setMinted] = useState(0n);
  const [listings, setListings] = useState([]);
  const [sales, setSales] = useState([]);

  const getStatusText = (status) => {
    if (status === 1) return "Pending";
    if (status === 2) return "Approved";
    if (status === 3) return "Rejected";
    return "";
  };

  const getStatusColor = (status) => {
    if (status === 2) return "text-green-600"; 
    if (status === 1) return "text-yellow-600"; 
    if (status === 3) return "text-red-600"; 
    return "text-gray-600"; 
  };

  useEffect(() => {
    const loadAllData = async () => {
      if (!client || !address) return;

      loadProducerDetails(); 
      loadMintedTokens();     

      const listingsData = await loadListings();
      if (listingsData) {
        await loadSales(listingsData);
      }
    };
    
    loadAllData();
    
  }, [client, address]); 

  const loadProducerDetails = async () => {
    try {
      const details = await readContract(client, {
        address: ET.Hoodi_REGISTRY_ADDRESS,
        abi: ET.ProducerRegistryABI,
        functionName: "getProducerDetails",
        args: [address],
      });
      setProducerDetails({
        name: details[0],
        location: details[1],
        capacity: details[2],
        aadhaarHash: details[3],
        status: details[4],
      });
    } catch (err) {
      console.error("Error loading producer details:", err);
      // toast.error("Error loading producer details:", err);
    }
  };

  const loadMintedTokens = async () => {
    try {
      const mintedAmt = await readContract(client, {
        address: ET.Hoodi_TOKEN_ADDRESS,
        abi: ET.EnergyTokenABI,
        functionName: "balanceOf",
        args: [address],
      });
      setMinted(mintedAmt);
    } catch (err) {
      console.error("Error loading minted amount:", err);
      // toast.error("Error loading minted amount:", err);
    }
  };

  const loadListings = async () => {
    try {
      const logs = await getContractEvents(client, {
        address: ET.Hoodi_MARKET_ADDRESS,
        abi: ET.EnergyMarketplaceABI,
        eventName: "EnergyListed",
        fromBlock: 0n,
        toBlock: "latest",
      });

      const mine = logs
        .filter(
          (log) =>
            log.args.producer.toLowerCase() === address.toLowerCase()
        )
        .map((log) => ({
          id: Number(log.args.listingId),
          amount: log.args.amount,
          price: log.args.price,
        }));

      setListings(mine);
      return mine;
    } catch (err) {
      console.error("Error loading listings:", err);
      // toast.error("Error loading listings:", err)
    }
  };

  const loadSales = async (listings) => {
    try {

      const producerListingIds = listings.map(l => l.id);

      if (producerListingIds.length === 0) {
        setSales([]);
        return;
      }

      const logs = await getContractEvents(client, {
        address: ET.Hoodi_MARKET_ADDRESS,
        abi: ET.EnergyMarketplaceABI,
        eventName: "EnergyPurchased",
        fromBlock: 0n,
        toBlock: "latest",
      });

      const mine = logs
        .filter(log => producerListingIds.includes(Number(log.args.listingId)))
        .map((log) => ({
          listingId: Number(log.args.listingId),
          buyer: log.args.buyer,
          amount: log.args.amount,
          total: log.args.totalCost,
        }));

      setSales(mine);
      
    } catch (err) {
      console.error("Error loading sales:", err);
      // toast.error("Error loading sales:", err)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {!client || !address ? (
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-200 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Connect Your Wallet</h3>
              <p className="text-gray-600 mb-6">Connect your wallet to view your producer dashboard</p>
              <button 
                onClick={connectWallet}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Producer Dashboard</h2>
              <p className="text-gray-600">Manage your energy production and sales</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Producer Details</span>
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-gray-800"><span className="font-medium text-sm text-gray-500">Name: </span>{producerDetails.name || " "}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800"><span className="font-medium text-sm text-gray-500">Location: </span>{producerDetails.location || " "}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      <span className="font-medium text-sm text-gray-500">Capacity: </span>
                      {producerDetails.capacity ? Number(producerDetails.capacity) : " "}
                    </p>
                  </div>
                  <div>
                    <p className={`font-medium ${getStatusColor(producerDetails.status)}`}>
                      <span className="font-medium text-sm text-gray-500">Status: </span>{getStatusText(producerDetails.status) || " "}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span>Minted Energy Tokens</span>
                </h3>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{minted} ET</p>
                  <p className="text-sm text-gray-500 mt-1">Total units minted</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Quick Stats</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Active Listings</span>
                    <span className="font-medium text-gray-800">{listings.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Total Sales</span>
                    <span className="font-medium text-gray-800">{sales.length}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Listings</h3>
                {listings.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <p className="text-gray-500">No active listings found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {listings.map((l) => (
                      <div key={l.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-gray-800">Listing {l.id + 1}</span>
                          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>{l.amount} ET</p>
                          <p>{formatEther(l.price)} ETH per token</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Sales</h3>
                {sales.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <p className="text-gray-500">No sales recorded yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sales.map((s, i) => (
                      <div key={i} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-gray-800">Sale #{i + 1}</span>
                          <span className="text-sm bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">Completed</span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Listing #{s.listingId} • {formatEther(s.amount)} ET</p>
                          <p className="font-mono text-xs">Buyer: {s.buyer.slice(0, 8)}...{s.buyer.slice(-6)}</p>
                          <p className="font-semibold text-green-700">Earned: {formatEther(s.total)} ETH</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProducerDashboard;