require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    blockdag: {
      url: process.env.BLOCKDAG_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
