import React, { useState } from "react";

const WalletConnectButton = ({ onConnect, address, onLogout }) => {
  const [connecting, setConnecting] = useState(false);

  const connectWallet = async () => {
    setConnecting(true);
    try {
      if (window.ethereum) {
        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        onConnect(account);
      } else {
        alert("MetaMask or EVM wallet not found");
      }
    } finally {
      setConnecting(false);
    }
  };

  return address ? (
    <button className="wallet-btn connected" onClick={onLogout} title="Logout">
      {address.slice(0, 6)}...{address.slice(-4)} (Logout)
    </button>
  ) : (
    <button className="wallet-btn" onClick={connectWallet} disabled={connecting}>
      {connecting ? "Connecting..." : "Connect Wallet"}
    </button>
  );
};

export default WalletConnectButton;
