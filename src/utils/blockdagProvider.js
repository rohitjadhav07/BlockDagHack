import { ethers } from "ethers";

export const getBlockDAGProvider = () => {
  // For frontend, use a public RPC URL (env vars are not available in browser)
  return new ethers.JsonRpcProvider("https://rpc.primordial.bdagscan.com");
};
