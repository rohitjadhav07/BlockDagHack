import { DEPLOYED_WALLETS } from "../data/deployedWallets";
import React, { useEffect, useState } from "react";
import { useWallet } from "../context/WalletContext";
import { ethers } from "ethers";
import TrustChainWalletABI from "../contracts/TrustChainWalletABI.json";
import { getBlockDAGProvider } from "../utils/blockdagProvider";

export default function GuardianOfList() {
  const { address } = useWallet();
  const [guardianOf, setGuardianOf] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGuardianOf = async () => {
      setLoading(true);
      if (!address) {
        setGuardianOf([]);
        setLoading(false);
        return;
      }
      const provider = getBlockDAGProvider();
      const results = [];
      for (const { address: walletAddr, owner } of DEPLOYED_WALLETS) {
        try {
          const contract = new ethers.Contract(walletAddr, TrustChainWalletABI, provider);
          const isG = await contract.isGuardian(address);
          if (isG) {
            results.push({ wallet: walletAddr, owner });
          }
        } catch (error) {
          console.error(`Error checking guardian status for wallet ${walletAddr}:`, error);
        }
      }
      setGuardianOf(results);
      setLoading(false);
    };
    fetchGuardianOf();
  }, [address]);

  if (!address) return null;
  return (
    <section className="wallet-info">
      <h2>Wallets You Are Guardian Of</h2>
      {loading ? <p>Loading...</p> : (
        guardianOf.length === 0 ? <p>You are not a guardian of any wallet.</p> :
        <ul style={{paddingLeft:20}}>
          {guardianOf.map(({ wallet, owner }, i) => (
            <li key={i} style={{marginBottom:8}}>
              <span style={{fontWeight:'bold'}}>Wallet:</span> {wallet} <button onClick={()=>navigator.clipboard.writeText(wallet)}>Copy</button> {' '}
              <a href={`https://blockdagscan.io/address/${wallet}`} target="_blank" rel="noopener noreferrer">Explorer</a><br/>
              <span style={{fontWeight:'bold'}}>Owner:</span> {owner}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
