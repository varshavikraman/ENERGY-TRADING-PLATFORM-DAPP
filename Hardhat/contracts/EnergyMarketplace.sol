// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

interface IEnergyToken {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

interface IProducerRegistry {
    function isApprovedProducer(address producer) external view returns (bool);
}

contract EnergyMarketplace {
    struct Listing {
        address producer;
        uint256 amount;       
        uint256 price;
        bool active;
    }

    IEnergyToken public token;
    IProducerRegistry public registry;
    uint256 public listingCount;

    mapping(uint256 => Listing) public listings;

    event EnergyListed(
        uint256 indexed listingId,
        address indexed producer,
        uint256 amount,
        uint256 price
    );

    event EnergyPurchased(
        uint256 indexed listingId,
        address indexed buyer,
        uint256 amount,
        uint256 totalCost
    );

    constructor(address tokenAddress, address registryAddress) {
        token = IEnergyToken(tokenAddress);
        registry = IProducerRegistry(registryAddress);
    }

    modifier onlyApprovedProducer() {
        require(registry.isApprovedProducer(msg.sender), "Not approved producer");
        _;
    }

    function listEnergy(uint256 _amt, uint256 _price) external onlyApprovedProducer {
        require(_amt > 0, "Invalid amount");
        require(_price > 0, "Invalid price");

        listings[listingCount] = Listing({
            producer: msg.sender,
            amount: _amt,
            price: _price,
            active: true
        });

        emit EnergyListed(listingCount, msg.sender, _amt, _price);

        listingCount++;
    }

    function buyEnergy(uint256 listingId, uint256 _amt) external payable {
        Listing storage ls = listings[listingId];

        require(ls.active, "Inactive listing");
        require(_amt > 0 && _amt <= ls.amount, "Invalid amount");

        uint256 cost = _amt * ls.price;
        require(msg.value == cost, "Incorrect ETH amount");

        // Transfer ETH to producer
        payable(ls.producer).transfer(msg.value);

        // Transfer energy tokens to buyer
        bool ok = token.transferFrom(ls.producer, msg.sender, _amt);
        require(ok, "Token transfer failed");

        // Update listing remaining amount
        ls.amount -= _amt;

        if (ls.amount == 0) {
            ls.active = false;
        }
        
        emit EnergyPurchased(listingId, msg.sender, _amt, cost);

    }
}
