require("@nomicfoundation/hardhat-toolbox");
require("@chainlink/env-enc").config();

const { SEPOLIA_URL, PRIVATE_KEY, SEPOLIA_API_KEY } = process.env;

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: SEPOLIA_URL,
      accounts: [PRIVATE_KEY],
    }
  },
  etherscan: {
    apiKey: SEPOLIA_API_KEY
  },
  sourcify: {
    // Disabled by default
    // Doesn't need an API key
    enabled: false
  }
};
