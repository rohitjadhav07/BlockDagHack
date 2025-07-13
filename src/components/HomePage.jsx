import React from "react";

const HomePage = () => (
  <section className="home-info">
    <h1>Welcome to TrustChain: Social Recovery Smart Wallet Layer</h1>
    <p>
      TrustChain is a modern, secure smart wallet UI for the BlockDAG testnet. It features:
    </p>
    <ul>
      <li><b>Wallet creation with guardians</b> for social recovery</li>
      <li><b>Guardian-based recovery</b> (multisig, social recovery)</li>
      <li><b>Gasless login</b> using BlockDAG SDKs</li>
      <li><b>ETH/BDAG transfers</b> and transaction history with undo requests</li>
      <li><b>Guardian management</b> (add/remove guardians)</li>
      <li><b>Modern UX</b> and security best practices</li>
    </ul>
    <h2>How it works</h2>
    <ol>
      <li>Connect your wallet to get started.</li>
      <li>Add guardians to your wallet for social recovery.</li>
      <li>Use the <b>Guardians</b> tab to manage guardians.</li>
      <li>Use the <b>Send Tokens</b> tab to transfer ETH/BDAG.</li>
      <li>In case of lost access, use <b>Recover Wallet</b> with your guardians.</li>
    </ol>
    <p>
      All actions are performed securely with your connected wallet. Your guardians can help you recover access if needed.
    </p>
    <p style={{marginTop:20, fontStyle:'italic', color:'#888'}}>This is a testnet demo. Do not use for mainnet funds.</p>
  </section>
);

export default HomePage;
