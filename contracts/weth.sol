// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./erc20/ERC20.sol";

contract WETH is ERC20 {
    constructor(uint256 initialSupply) public ERC20("Wrapper Ethereum testnet", "WETH") {
        _mint(msg.sender, initialSupply);
    }
}