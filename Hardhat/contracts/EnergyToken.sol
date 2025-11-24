// SPDX-License-Identifier: MIT
pragma solidity  0.8.30;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface IProducerRegistry {
    function isApprovedProducer(address producer) external view returns (bool);
}

contract EnergyToken is ERC20 {
    IProducerRegistry public registry;

    constructor(address registryAddress)
        ERC20("EnergyToken", "ENG")
    {
        registry = IProducerRegistry(registryAddress);
    }

    function mintEnergy(uint256 amount) external {
        require(registry.isApprovedProducer(msg.sender), "Not approved producer");
        _mint(msg.sender, amount);
    }
}
