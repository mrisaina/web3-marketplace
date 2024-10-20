require('@babel/register')
require('core-js/stable')
require('regenerator-runtime/runtime')
const path = require('path')

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
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
      path: path.resolve(__dirname, './node_modules/solc'),
    },
  },
}
