require('dotenv').config();
require('@nomicfoundation/hardhat-toolbox');

const coinmarketcap = process.env.COINMARKETCAP;
const enabled = coinmarketcap !== undefined;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  gasReporter: {
    enabled,
    coinmarketcap,
    excludeContracts: ['NFT.sol'],
    // outputFile: './gasReport.txt',
    // noColors: true,
  },
};
