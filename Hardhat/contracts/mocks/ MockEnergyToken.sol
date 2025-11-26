// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

contract MockEnergyToken {
    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowance;

    function mint(address to, uint256 amount) external {
        balances[to] += amount;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        return true;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        require(balances[msg.sender] >= amount, "Insufficient balance");

        balances[msg.sender] -= amount;
        balances[to] += amount;
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(balances[from] >= amount, "Insufficient balance");
        require(allowance[from][msg.sender] >= amount, "Allowance too low");

        allowance[from][msg.sender] -= amount;
        balances[from] -= amount;
        balances[to] += amount;
        return true;
    }

    function balanceOf(address user) external view returns (uint256) {
        return balances[user];
    }
}
