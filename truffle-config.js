require('@babel/register')
require('core-js/stable')
require('regenerator-runtime/runtime')

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '1337',
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: '0.5.0',
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
}
