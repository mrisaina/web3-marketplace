import React, { Component } from 'react'

class Table extends Component {
  render() {
    return (
      <div>
        <table className="table">
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
            {this.props.products.map((product, key) => (
              <tr key={key}>
                <th scope="row">{product.id.toString()}</th>
                <td>{product.name}</td>
                <td>
                  {window.web3.utils.fromWei(product.price.toString(), 'Ether')}{' '}
                  Eth
                </td>
                <td>{product.owner}</td>
                <td>
                  {!product.purchased ? (
                    <button
                      name={product.id}
                      value={product.price}
                      onClick={(event) => {
                        this.props.purchaseProduct(
                          event.target.name,
                          event.target.value,
                        )
                      }}
                    >
                      Buy
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}

export default Table
