// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

contract MockProducerRegistry {
    mapping(address => bool) public approved;

    function setApproved(address p, bool val) external {
        approved[p] = val;
    }

    function isApprovedProducer(address p) external view returns (bool) {
        return approved[p];
    }
}
