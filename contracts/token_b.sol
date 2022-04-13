// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./erc20/ERC20.sol";

contract TokenB is ERC20 {
    constructor(uint256 initialSupply) public ERC20("TokenB", "BCOIN") {
        _mint(msg.sender, initialSupply);
    }
}