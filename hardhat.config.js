require("@nomicfoundation/hardhat-toolbox");
require("@chainlink/env-enc").config();

// 此处要打开VPN的TUN模式，代理所有流量
const { ProxyAgent, setGlobalDispatcher } = require("undici");
const proxyAgent = new ProxyAgent("http://127.0.0.1:7890");
setGlobalDispatcher(proxyAgent);

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
    // Use single Etherscan API key (v2 API) - recommended approach
    apiKey: SEPOLIA_API_KEY
  },
  sourcify: {
    // Disabled by default
    // Doesn't need an API key
    enabled: false
  }
};
