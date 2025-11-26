import React, { useEffect, useState } from "react";
import { useWallet } from "../context/WalletContext";
import { readContract, writeContract } from "viem/actions";
import ET from "../assets/ET.json";

const AdminDashboard = () => {
  const { client, address, connectWallet } = useWallet();
  const [pending, setPending] = useState([]);

  const loadPending = async () => {
    try {
      const producers = await readContract(client, {
        address: ET.REGISTRY_ADDRESS,
        abi: ET.ProducerRegistryABI,
        functionName: "getPendingProducers",
        args: [],
      });

      const detailed = [];

      for (let i = 0; i < producers.length; i++) {
        const p = producers[i];

        const result = await readContract(client, {
          address: ET.REGISTRY_ADDRESS,
          abi: ET.ProducerRegistryABI,
          functionName: "getProducerDetails",
          args: [p],
        });

        detailed.push({
          wallet: p,
          name: result[0],
          location: result[1],
          capacity: result[2],
          aadhaarHash: result[3],
          status: result[4],
        });
      }

      setPending(detailed);

    } catch (error) {
      console.error(error);
      alert("Failed to load pending producers");
    }
  };

  // Load on mount + auto-refresh every 5 seconds
  useEffect(() => {
    loadPending();

    const interval = setInterval(() => {
      loadPending();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const approve = async (producer) => {
    if (!address) await connectWallet();

    const tx = await writeContract(client, {
      address: ET.REGISTRY_ADDRESS,
      abi: ET.ProducerRegistryABI,
      functionName: "approveProducer",
      args: [producer],
      account: address,
    });

    await client.waitForTransactionReceipt({ hash: tx });
    alert("Producer Approved!");
    loadPending();
    console.log("Approved Hash:", tx);
  };

  const reject = async (producer) => {
    if (!address) await connectWallet();

    const tx = await writeContract(client, {
      address: ET.REGISTRY_ADDRESS,
      abi: ET.ProducerRegistryABI,
      functionName: "rejectProducer",
      args: [producer],
      account: address,
    });

    await client.waitForTransactionReceipt({ hash: tx });
    alert("Producer Rejected!");
    loadPending();
    console.log("Rejected Hash:", tx);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
          <p className="text-gray-600 mt-2">Manage producer registration requests</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Pending Producers
          </h3>

          {pending.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500">No pending producer requests</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2  gap-4 mb-4">
              {pending.map((p, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2  gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">{p.name}</h4>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Location:</span> {p.location}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Capacity:</span> {p.capacity} units
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Wallet:</span> 
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded ml-1">
                          {p.wallet.slice(0, 8)}...{p.wallet.slice(-6)}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Aadhaar Hash:</span> 
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded ml-1">
                          {p.aadhaarHash.slice(0, 10)}...
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 shadow hover:shadow-md flex items-center justify-center space-x-2"
                      onClick={() => approve(p.wallet)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Approve</span>
                    </button>
                    <button
                      className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 shadow hover:shadow-md flex items-center justify-center space-x-2"
                      onClick={() => reject(p.wallet)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;