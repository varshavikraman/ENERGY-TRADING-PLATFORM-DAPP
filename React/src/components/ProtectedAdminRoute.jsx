import React, { useEffect, useState } from "react";
import { useWallet } from "../context/WalletContext";
import { readContract } from "viem/actions";
import ET from "../assets/ET.json";
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const { client, address, connectWallet } = useWallet();
  const [adminAddress, setAdminAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAdmin = async () => {
    const admin = await readContract(client, {
      address: ET.Hoodi_REGISTRY_ADDRESS,
      abi: ET.ProducerRegistryABI,
      functionName: "admin",
    });
    setAdminAddress(admin);
    setLoading(false);
  };

  useEffect(() => {
    if (client) loadAdmin();
  }, [client]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Checking Permissions</h3>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!address) {
    return <Navigate to="/" replace />;
  }

  if (address.toLowerCase() !== adminAddress.toLowerCase()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Access Denied</h3>
          <p className="text-gray-600 mb-4">You don't have administrator privileges for this section.</p>
          <div className="bg-green-50 rounded-lg p-4 text-sm border border-green-200">
            <p className="text-gray-600 font-mono break-all">
              Your address: {address.slice(0, 8)}...{address.slice(-6)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedAdminRoute;