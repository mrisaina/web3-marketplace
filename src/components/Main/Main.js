import React, { Component } from 'react'
import Table from '../Table/Table'
import ImagePreview from '../ImagePreview/ImagePreview'
import './Main.css'

class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imageUrl: '',
    }
  }

  handleImageInputChange = (event) => {
    this.setState({
      imageUrl: event.target.value,
    })
  }

  render() {
    return (
      <div id="content">
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
        >
          <div class="column-wrapper-1">
            <div className="form-group mr-sm-2">
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
            <div className="form-group mr-sm-2">
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
          </div>
          <button type="submit" className="btn btn-primary">
            Add Product
          </button>
        </form>
        <p>&nbsp;</p>
        <h2>Buy Product</h2>
        <Table products={this.props.products} />
      </div>
    )
  }
}

export default Main
