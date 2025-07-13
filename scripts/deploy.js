require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const guardians = [
    // Replace with real guardian addresses
    "0x0000000000000000000000000000000000000001",
    "0x0000000000000000000000000000000000000002",
    "0x0000000000000000000000000000000000000003"
  ];
  const threshold = 2;
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const TrustChainWallet = await ethers.getContractFactory("TrustChainWallet");
  const wallet = await TrustChainWallet.deploy(guardians, threshold, deployer.address);
  await wallet.waitForDeployment();
  console.log("TrustChainWallet deployed to:", await wallet.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
