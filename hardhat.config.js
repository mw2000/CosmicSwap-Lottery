require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("dotenv");

const {PRIVATE_KEY} = process.env;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  gasReporter: {
    enabled: true,
    currency: 'CHF',
    gasPrice: 21
  },
  networks: {
    hardhat: {
      mining: {
        auto: false,
        interval: 5000
      },
      blockGasLimit: 13000000,
      gasPrice: 20
    },
    bsc_mainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      gasPrice: 20000000000,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.6.12"
      },
      {
        version: "0.6.6"
      },
      {
        version: "0.7.3"
      }
    ]
  } 
};
