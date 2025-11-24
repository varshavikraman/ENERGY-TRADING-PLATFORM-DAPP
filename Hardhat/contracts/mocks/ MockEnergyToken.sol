// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

contract MockEnergyToken {
    mapping(address => uint256) public balance;

    function mint(address to, uint256 amt) external {
        balance[to] += amt;
    }

    function transferFrom(address from, address to, uint256 amt) external returns (bool) {
        require(balance[from] >= amt, "Insufficient balance");
        balance[from] -= amt;
        balance[to] += amt;
        return true;
    }
}
