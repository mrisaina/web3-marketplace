const Marketplace = artifacts.require('./Marketplace.sol')
const fs = require('fs')
const path = require('path')
const chai = require('chai')
chai.use(require('chai-as-promised')).should()
const assert = chai.assert

contract('Marketplace', ([deployer, seller, buyer]) => {
  let marketplace

  before(async () => {
    marketplace = await Marketplace.deployed()
  })

  describe('deployment checks', async () => {
    it('deploys successfully', async () => {
      const address = await marketplace.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await marketplace.name()
      assert.equal(name, "Mariia's Marketplace")
    })
  })

  describe('products', async () => {
    let result, productCount

    before(async () => {
      result = await marketplace.createProduct(
        'iPhone X',
        web3.utils.toWei('1', 'Ether'),
        { from: seller },
      )
      productCount = await marketplace.productCount()
    })

    it('creates products', async () => {
      assert.equal(productCount, 1)
      const event = result.logs[0].args
      assert.equal(
        event.id.toNumber(),
        productCount.toNumber(),
        'id is correct',
      )
      assert.equal(event.name, 'iPhone X', 'name is correct')
      assert.equal(event.price, '1000000000000000000', 'price is correct')
      assert.equal(event.owner, seller, 'owner is correct')
      assert.equal(event.purchased, false, 'purchased is correct')

      await marketplace.createProduct('', web3.utils.toWei('1', 'Ether'), {
        from: seller,
      }).should.be.rejected
      await marketplace.createProduct('iPhone X', 0, { from: seller }).should.be
        .rejected
    })

    it('sells products', async () => {
      let oldSellerBalance = await web3.eth.getBalance(seller)
      oldSellerBalance = new web3.utils.BN(oldSellerBalance)

      result = await marketplace.purchaseProduct(productCount, {
        from: buyer,
        value: web3.utils.toWei('1', 'Ether'),
      })

      const event = result.logs[0].args
      assert.equal(
        event.id.toNumber(),
        productCount.toNumber(),
        'id is correct',
      )
      assert.equal(event.name, 'iPhone X', 'name is correct')
      assert.equal(event.price, '1000000000000000000', 'price is correct')
      assert.equal(event.owner, buyer, 'owner is correct')
      assert.equal(event.purchased, true, 'purchased is correct')

      let newSellerBalance = await web3.eth.getBalance(seller)
      newSellerBalance = new web3.utils.BN(newSellerBalance)

      let price = web3.utils.toWei('1', 'Ether')
      price = new web3.utils.BN(price)

      const expectedBalance = oldSellerBalance.add(price)
      assert.equal(newSellerBalance.toString(), expectedBalance.toString())

      await marketplace.purchaseProduct(99, {
        from: buyer,
        value: web3.utils.toWei('1', 'Ether'),
      }).should.be.rejected
      await marketplace.purchaseProduct(productCount, {
        from: buyer,
        value: web3.utils.toWei('0.5', 'Ether'),
      }).should.be.rejected
      await marketplace.purchaseProduct(productCount, {
        from: deployer,
        value: web3.utils.toWei('1', 'Ether'),
      }).should.be.rejected
      await marketplace.purchaseProduct(productCount, {
        from: buyer,
        value: web3.utils.toWei('1', 'Ether'),
      }).should.be.rejected
    })
  })

  describe('JSON output checks', async () => {
    let jsonOutput

    before(async () => {
      const contractPath = path.join(__dirname, '../src/abis/Marketplace.json')
      jsonOutput = JSON.parse(fs.readFileSync(contractPath, 'utf8'))
    })

    it('should have ABI', async () => {
      const abi = jsonOutput.abi
      assert.isArray(abi, 'ABI should be an array')
    })

    it('should have bytecode', async () => {
      const bytecode = jsonOutput.bytecode
      assert.isString(bytecode, 'Bytecode should be a string')
      assert.isNotEmpty(bytecode, 'Bytecode should not be empty')
    })

    it('should have an AST', async () => {
      const ast = jsonOutput.ast
      assert.isObject(ast, 'AST should be an object')
    })

    it('should have metadata', async () => {
      const metadata = jsonOutput.metadata
      assert.isString(metadata, 'Metadata should be a string')
      assert.isNotEmpty(metadata, 'Metadata should not be empty')
    })

    it('should have expected structure and values', async () => {
      const abi = jsonOutput.abi
      const hasProductCreatedEvent = abi.some(
        (item) => item.type === 'event' && item.name === 'ProductCreated',
      )
      const hasProductPurchasedEvent = abi.some(
        (item) => item.type === 'event' && item.name === 'ProductPurchased',
      )
      const hasCreateProductFunction = abi.some(
        (item) => item.type === 'function' && item.name === 'createProduct',
      )
      const hasPurchaseProductFunction = abi.some(
        (item) => item.type === 'function' && item.name === 'purchaseProduct',
      )

      assert.isTrue(
        hasProductCreatedEvent,
        'Contract should have ProductCreated event',
      )
      assert.isTrue(
        hasProductPurchasedEvent,
        'Contract should have ProductPurchased event',
      )
      assert.isTrue(
        hasCreateProductFunction,
        'Contract should have createProduct function',
      )
      assert.isTrue(
        hasPurchaseProductFunction,
        'Contract should have purchaseProduct function',
      )
    })
  })
})