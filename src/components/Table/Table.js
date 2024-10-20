import React, { Component } from 'react'
import './Table.css' // Assuming you're adding CSS here or in the same file

class Table extends Component {
  handleBuyClick = (event) => {
    this.props.purchaseProduct(event.target.name, event.target.value)
  }

  renderEmptyRows = (numRows = 5) => {
    let emptyRows = []
    for (let i = 0; i < numRows; i++) {
      emptyRows.push(
        <tr key={i} className="empty-row">
          <td className="empty-cell">-</td>
          <td className="empty-cell">-</td>
          <td className="empty-cell">-</td>
          <td className="empty-cell">-</td>
          <td className="empty-cell">-</td>
        </tr>,
      )
    }
    return emptyRows
  }

  render() {
    const { products } = this.props
    return (
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th scope="col" className="id">
                #
              </th>
              <th scope="col" className="name">
                Name
              </th>
              <th scope="col" className="price">
                Price
              </th>
              <th scope="col" className="owner">
                Owner
              </th>
              <th scope="col" className="buy-btn">
                Buy
              </th>
            </tr>
          </thead>
          <tbody id="productList">
            {products.length > 0
              ? products.map((product, key) => (
                  <tr key={key}>
                    <th scope="row">{product.id.toString()}</th>
                    <td>{product.name}</td>
                    <td>
                      {window.web3.utils.fromWei(
                        product.price.toString(),
                        'Ether',
                      )}{' '}
                      Eth
                    </td>
                    <td>{product.owner}</td>
                    <td>
                      {!product.purchased ? (
                        <button
                          name={product.id}
                          value={product.price}
                          onClick={this.handleBuyClick}
                          className="buy-button"
                        >
                          Buy
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))
              : this.renderEmptyRows()}
          </tbody>
        </table>
      </div>
    )
  }
}

export default Table
