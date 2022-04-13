# uniswap-erc20-swap
 Minimal ERC-20 and UniswapV2 contracts with Hardhat + Mocha tests to deploy and swap tokens

To get started:
```npm install```

Then run
```npx hardhat console```   

In the console, you can get the INIT_CODE_HASH by pasting the line below:    
```await ethers.utils.keccak256((await ethers.getContractFactory("UniswapV2Pair")).bytecode);```    
You need to take this code and replace it on ```Line 24``` here:   
 ```contracts/uniswap/router/libraries/UniswapV2Library.sol```   
```hex'287e6e67abb0c5fd7516232cd525568659086b2849d8346d547856f04fee7f5c' // init code hash```   
Remove the '0x' from your INIT_CODE_HASH and replace the old value on the Line 24.    
If your bytecode for the UniswapV2Pair changes after compilation, you will need to update the init code, otherwise you will only need to do this once. 

Close out the console.
Now you can run   
```npx hardhat test```   

This will deploy 3 tokens (TokenA, TokenB, WETH), and deploy the Uniswap v2 Factory + Router, add/remove liquidity and perform swaps. 

### Notes
We killed the deadline modifier in the Router contracts, so you can enter 0 for any calls to the Router that require the deadline modifier.   
Deployment scripts have not been setup, but you can run the ```tests/main.js``` file to perform testing. 

Alternatively, if you have the correct init code hash in place, you could run ```npx hardhat console```  and then paste the commands below to achieve the same testing/deployment through the console. 
```javascript
const fether = ethers.utils.formatEther;
const pether = ethers.utils.parseEther;
const [owner, addr1, addr2, addr3] = await ethers.getSigners();
const TokenA = await ethers.getContractFactory("TokenA");
const tokena = await TokenA.deploy(pether('1000000000'));
const TokenB = await ethers.getContractFactory("TokenB");
const tokenb = await TokenB.deploy(pether('2000000000'));
const WETH = await ethers.getContractFactory("WETH");
const weth = await WETH.deploy(pether('3000000000'));
fether(await tokena.balanceOf(owner.address));
fether(await tokenb.balanceOf(owner.address));
const Unifactory = await ethers.getContractFactory("UniswapV2Factory");
const unifactory = await Unifactory.deploy(owner.address);
const tx = await unifactory.createPair(tokena.address, tokenb.address);
const pair = await ethers.getContractAt("UniswapV2Pair", (await unifactory.getPair(tokena.address, tokenb.address)));
const Unirouter = await ethers.getContractFactory("UniswapV2Router02");
const router = await Unirouter.deploy(unifactory.address, weth.address);
const tokenaLiquidityAmount = pether('1000000');
const tokenbLiquidityAmount = pether('2000000');
tx = await tokena.approve(router.address, tokenaLiquidityAmount);
tx = await tokenb.approve(router.address, tokenbLiquidityAmount);
fether(await tokena.allowance(owner.address, router.address));
fether(await tokenb.allowance(owner.address, router.address));
await unifactory.INIT_CODE_HASH();
tx = await router.addLiquidity(tokena.address, tokenb.address, tokenaLiquidityAmount, tokenbLiquidityAmount, tokenaLiquidityAmount, tokenbLiquidityAmount, owner.address, 0);
fether(await pair.balanceOf(owner.address));
tx = await tokena.transfer(addr1.address, pether('1000'));
const tradeAmount = await tokena.balanceOf(addr1.address);
const amount_out = await router.connect(addr1.address).getAmountsOut(tradeAmount, [tokena.address, tokenb.address]);
amount_out = amount_out[1].sub(amount_out[1].div(100));
fether(await tokena.balanceOf(owner.address));
fether(await tokenb.balanceOf(owner.address));
fether(await tokena.balanceOf(addr1.address));
fether(await tokenb.balanceOf(addr1.address));
tx = await tokena.connect(addr1).approve(router.address, tradeAmount);
tx = await router.connect(addr1).swapExactTokensForTokens(tradeAmount, amount_out, [tokena.address, tokenb.address], addr1.address, 0);
fether(await tokenb.balanceOf(addr1.address));
const liquidity = (await pair.balanceOf(owner.address));
tx = await pair.approve(router.address, liquidity);
tx = await router.removeLiquidity(tokena.address, tokenb.address, liquidity, 0, 0, owner.address, 0);
fether(await tokena.balanceOf(owner.address));
fether(await tokenb.balanceOf(owner.address));
fether(await tokena.balanceOf(addr1.address));
fether(await tokenb.balanceOf(addr1.address));
```
