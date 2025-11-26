// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

interface IEnergyToken {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
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

    constructor(address registryAddress, address tokenAddress) {
        registry = IProducerRegistry(registryAddress);
        token = IEnergyToken(tokenAddress);
    }

    modifier onlyApprovedProducer() {
        require(registry.isApprovedProducer(msg.sender), "Not approved producer");
        _;
    }

    function listEnergy(uint256 _amt, uint256 _price) external onlyApprovedProducer {
        require(_amt > 0, "Invalid amount");
        require(_price > 0, "Invalid price");

        // Producer sends tokens upfront
        bool ok = token.transferFrom(msg.sender, address(this), _amt);
        require(ok, "Token transfer to marketplace failed");

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
        bool ok = token.transfer(msg.sender, _amt);
        require(ok, "Token transfer to buyer failed");

        // Update listing remaining amount
        ls.amount -= _amt;

        if (ls.amount == 0) {
            ls.active = false;
        }
        
        emit EnergyPurchased(listingId, msg.sender, _amt, cost);

    }
}
