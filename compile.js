const fs = require('fs')
const solc = require('solc')

const source = fs.readFileSync('src/contracts/Marketplace.sol', 'utf8')
const input = {
  language: 'Solidity',
  sources: {
    'Marketplace.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['abi', 'bin', 'ast', 'metadata'],
      },
    },
  },
}

const output = JSON.parse(solc.compile(JSON.stringify(input)))

fs.writeFileSync('temp/Marketplace.json', JSON.stringify(output, null, 2))
