import React, { Component } from 'react'
import Table from '../Table/Table'
import './Main.css'

class Main extends Component {
  render() {
    return (
      <div id="content" className="main-content">
        <h1 className="add-product-title">Add Product</h1>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            const name = this.productName.value
            const price = window.web3.utils.toWei(
              this.productPrice.value.toString(),
              'Ether',
            )
            this.props.createProduct(name, price)
          }}
          className="product-form"
        >
          <div className="form-group">
            <input
              id="productName"
              type="text"
              ref={(input) => {
                this.productName = input
              }}
              className="form-control"
              placeholder="Product Name"
              required
            />
          </div>
          <div className="form-group">
            <input
              id="productPrice"
              type="text"
              ref={(input) => {
                this.productPrice = input
              }}
              className="form-control"
              placeholder="Product Price"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Add Product
          </button>
        </form>
        <p>&nbsp;</p>
        <Table
          products={this.props.products}
          purchaseProduct={this.props.purchaseProduct}
        />
      </div>
    )
  }
}

export default Main
