pragma solidity >=0.4.21 <0.6.0;

pragma solidity ^0.5.0;

contract Marketplace {
    string public name;
    mapping(uint => Product) public products;
    uint public productCount = 0;

    constructor() public {
        name = "Mariia's Marketplace";
    }

    struct Product {
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchased;
    }

    event ProductCreated(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    event ProductPurchased(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    function createProduct(string memory _name, uint _price) public {
        require(bytes(_name).length > 0, "Product name must be provided.");
        require(_price > 0, "Product price must be greater than zero.");

        productCount++;
        products[productCount] = Product(productCount, _name, _price, msg.sender, false);

        emit ProductCreated(productCount, _name, _price, msg.sender, false);
    }

    function purchaseProduct(uint _id) public payable {
        // Fetch the product
        Product memory _product = products[_id];
        address payable _seller = _product.owner;

        // Validate product ID range
        require(_id > 0 && _id <= productCount, "Invalid product ID.");
        
        // Check for sufficient payment
        require(msg.value >= _product.price, "Not enough Ether to purchase this product.");
        
        // Ensure product has not been purchased already
        require(!_product.purchased, "Product has already been purchased.");
        
        // Check ownership to ensure buyer is not the seller
        require(_seller != msg.sender, "Buyer cannot be the seller.");

        // Transfer ownership to the buyer
        _product.owner = msg.sender;
        _product.purchased = true;

        // Update the product
        products[_id] = _product;

        // Transfer funds to the seller
        _seller.transfer(msg.value);

        emit ProductPurchased(_id, _product.name, _product.price, msg.sender, true);
    }
}
