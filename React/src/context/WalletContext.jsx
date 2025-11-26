import { createContext, useContext, useState, useEffect } from "react";
import { createWalletClient, custom } from "viem";
import { hardhat, hoodi } from "viem/chains";
import toast from "react-hot-toast";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [address, setAddress] = useState("");

  const client = createWalletClient({
    chain: hoodi,
    transport: custom(window.ethereum),
  });

  const connectWallet = async () => {
    try {
        if (!window.ethereum) {
            toast.error("MetaMask not installed!");
            //alert("MetaMask not installed!");
            return;
        }

        const [addr] = await client.requestAddresses();

      setAddress(addr);
      console.log("Connected:", addr);
      toast.success("Wallet Connected!");
      //alert("Wallet Connected!");
      return addr;
    } catch (err) {
      console.error("Wallet connection failed:", err);
      toast.error("Wallet connection failed!");
      //alert("Wallet connection failed!");

    }
  };

    useEffect(() => {
        if (!window.ethereum) return;

        window.ethereum.on("accountsChanged", (accounts) => {
        console.log("Accounts changed:", accounts);
        setAddress(accounts[0] || "");
        });

        window.ethereum.on("chainChanged", () => {
        console.log("Chain changed. Reloading...");
        window.location.reload();
        });

        return () => {
        if (!window.ethereum) return;
        window.ethereum.removeAllListeners("accountsChanged");
        window.ethereum.removeAllListeners("chainChanged");
        };
    }, []);

    const disconnectWallet = () => {
        setAddress("");
        toast("Wallet Disconnected");
        //alert("Wallet Disconnected");
    };

  return (
    <WalletContext.Provider value={{ address, connectWallet, disconnectWallet, client }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
