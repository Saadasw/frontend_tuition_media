"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { BrowserProvider } from "ethers";


// Add this at the top of your page.tsx
declare global {
    interface Window {
      ethereum?: any;
    }
  }
  
export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask is not installed!");
        return;
      }

      setLoading(true);

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      setAddress(userAddress);

      // Step 1: Request nonce from backend
      const nonceRes = await fetch(`http://127.0.0.1:8000/api/get_nonce?address=${userAddress}`);
      if (!nonceRes.ok) throw new Error("Failed to get nonce");
      const { nonce }: { nonce: string } = await nonceRes.json();

      // Step 2: Ask user to sign the nonce
      const signature = await signer.signMessage(nonce);

      // Step 3: Send address + signature back to backend for verification
      const verifyRes = await fetch("http://127.0.0.1:8000/api/verify_signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: userAddress, signature }),
      });

      if (verifyRes.ok) {
        alert("✅ Login successful!");
      } else {
        alert("❌ Login failed.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setAddress(null); // 👈 Just clear address
    alert("Logged out!");
  };


  return(
    <main className="flex flex-col items-center justify-center min-h-screen space-y-6">
      <h1 className="text-2xl font-bold">Login with MetaMask</h1>

      {address ? (
        <>
          <p className="text-gray-700">Connected as: {address}</p>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded"
          >
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded disabled:opacity-50"
        >
          {loading ? "Connecting..." : "Connect MetaMask"}
        </button>
      )}
    </main>
  );
}
