import React, { useEffect, useState } from "react";
import { useWallet } from "../context/WalletContext";
import { readContract } from "viem/actions";
import ET from "../assets/ET.json";

const AllProducers = () => {
  const { client } = useWallet();
  const [producers, setProducers] = useState([]);

  const loadProducers = async () => {
    const addresses = await readContract(client, {
      address: ET.Hoodi_REGISTRY_ADDRESS,
      abi: ET.ProducerRegistryABI,
      functionName: "getAllProducers",
    });

    const list = [];
    for (let p of addresses) {
      const details = await readContract(client, {
        address: ET.Hoodi_REGISTRY_ADDRESS,
        abi: ET.ProducerRegistryABI,
        functionName: "getProducerDetails",
        args: [p],
      });

      list.push({
        wallet: p,
        name: details[0],
        location: details[1],
        capacity: Number(details[2]),
        aadhaarHash: details[3],
        status: Number(details[4]),
      });
    }

    setProducers(list);
  };

  useEffect(() => {
    loadProducers();
  }, []);

  const getStatus = (s) => {
    if (s === 1) return "Pending";
    if (s === 2) return "Approved";
    if (s === 3) return "Rejected";
    return "None";
  };

  const getStatusColor = (s) => {
    if (s === 1) return "bg-amber-100 text-amber-800 border-amber-200";
    if (s === 2) return "bg-green-100 text-green-800 border-green-200";
    if (s === 3) return "bg-red-100 text-red-800 border-red-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">All Producers</h1>
          <p className="text-gray-600">View all registered energy producers on the platform</p>
        </div>

        {/* Producers Grid */}
        <div>

          {producers.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <p className="text-gray-500">No producers found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {producers.map((p, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 bg-white">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-lg text-gray-800">{p.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(p.status)}`}>
                      {getStatus(p.status)}
                    </span>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-600">{p.location}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span className="text-gray-600">
                        <span className="font-medium">Capacity:</span> {p.capacity} units
                      </span>
                    </div>

                    <div className="flex items-start space-x-2">
                      <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                      <div>
                        <span className="text-gray-600 block">Aadhaar Hash:</span>
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
                          {p.aadhaarHash.slice(0, 10)}...
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="text-gray-600 font-mono text-xs">
                        {p.wallet.slice(0, 8)}...{p.wallet.slice(-6)}
                      </span>
                    </div>
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

export default AllProducers;