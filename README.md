# uniswap-erc20-swap
 Minimal ERC-20 and UniswapV2 contracts with Hardhat + Mocha tests to deploy and swap tokens

To get started:
```npm install```

Then run
```npx hardhat console```   

In the console, you can get the INIT_CODE_HASH by pasting ```await ethers.utils.keccak256((await ethers.getContractFactory("UniswapV2Pair")).bytecode);```    
You need to take this code and replace it on ```Line 24``` in ```contracts/uniswap/router/```
```hex'287e6e67abb0c5fd7516232cd525568659086b2849d8346d547856f04fee7f5c' // init code hash```
Remove the '0x' from your INIT_CODE_HASH and replace the old value on the Line 24. 

Close out the console.
Now you can run   
```npx hardhat test```   

This will deploy 3 tokens (TokenA, TokenB, WETH), and deploy the Uniswap v2 Factory + Router, add/remove liquidity and perform swaps. 

