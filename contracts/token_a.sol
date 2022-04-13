// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./erc20/ERC20.sol";

contract TokenA is ERC20 {
    constructor(uint256 initialSupply) public ERC20("TokenA", "ACOIN") {
        _mint(msg.sender, initialSupply);
    }
}