require("@nomicfoundation/hardhat-toolbox");
require("@chainlink/env-enc").config();

const { ALCHEMY_API_KEY, PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: ALCHEMY_API_KEY,
      accounts: [PRIVATE_KEY],
    }
  }
};
