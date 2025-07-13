import { useState } from "react";
import { ethers } from "ethers";
import TrustChainWalletABI from "../contracts/TrustChainWalletABI.json";
import { TRUST_CHAIN_WALLET_ADDRESS } from "../contracts/contractAddress";

export function useTrustChainWallet(signer) {
  const [txStatus, setTxStatus] = useState(null);
  const [error, setError] = useState(null);
  // const provider = getBlockDAGProvider(); // Removed unused variable
  const contract = signer
    ? new ethers.Contract(TRUST_CHAIN_WALLET_ADDRESS, TrustChainWalletABI, signer)
    : null;

  // Add a guardian
  const addGuardian = async (guardian) => {
    setTxStatus("pending"); setError(null);
    try {
      const tx = await contract.addGuardian(guardian);
      await tx.wait();
      setTxStatus("success");
    } catch (e) {
      setError(e.message);
      setTxStatus("error");
    }
  };

  // Remove a guardian
  const removeGuardian = async (guardian) => {
    setTxStatus("pending"); setError(null);
    try {
      const tx = await contract.removeGuardian(guardian);
      await tx.wait();
      setTxStatus("success");
    } catch (e) {
      setError(e.message);
      setTxStatus("error");
    }
  };

  // Initiate recovery
  const initiateRecovery = async (newOwner) => {
    setTxStatus("pending"); setError(null);
    try {
      const tx = await contract.initiateRecovery(newOwner);
      await tx.wait();
      setTxStatus("success");
    } catch (e) {
      setError(e.message);
      setTxStatus("error");
    }
  };

  // Approve recovery
  const approveRecovery = async () => {
    setTxStatus("pending"); setError(null);
    try {
      const tx = await contract.approveRecovery();
      await tx.wait();
      setTxStatus("success");
    } catch (e) {
      setError(e.message);
      setTxStatus("error");
    }
  };

  // Read-only: get guardians
  const getGuardians = async () => {
    try {
      return await contract.getGuardians();
    } catch {
      return [];
    }
  };

  // Check if an address is a guardian
  const isGuardian = async (address) => {
    try {
      return await contract.isGuardian(address);
    } catch {
      return false;
    }
  };

  return {
    addGuardian,
    removeGuardian,
    initiateRecovery,
    approveRecovery,
    getGuardians,
    isGuardian,
    txStatus,
    error,
  };
}
