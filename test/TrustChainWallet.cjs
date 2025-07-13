const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TrustChainWallet", function () {
  let TrustChainWallet, wallet, owner, guardian1, guardian2, guardian3, other;

  beforeEach(async function () {
    [owner, guardian1, guardian2, guardian3, other] = await ethers.getSigners();
    TrustChainWallet = await ethers.getContractFactory("TrustChainWallet");
    wallet = await TrustChainWallet.deploy(
      [guardian1.address, guardian2.address, guardian3.address],
      2, // threshold
      owner.address // initialOwner
    );
    // await wallet.deployed(); // Not needed in recent Hardhat
  });

  it("should add and remove guardians", async function () {
    await wallet.addGuardian(other.address);
    expect(await wallet.isGuardian(other.address)).to.be.true;
    await wallet.removeGuardian(other.address);
    expect(await wallet.isGuardian(other.address)).to.be.false;
  });

  it("should initiate and approve recovery", async function () {
    await wallet.connect(guardian1).initiateRecovery(other.address);
    await wallet.connect(guardian1).approveRecovery();
    await wallet.connect(guardian2).approveRecovery();
    expect(await wallet.owner()).to.equal(other.address);
  });

  it("should not allow non-guardians to initiate recovery", async function () {
    await expect(wallet.connect(other).initiateRecovery(owner.address)).to.be.revertedWith("Not a guardian");
  });
});
