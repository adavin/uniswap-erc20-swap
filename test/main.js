const { expect } = require("chai");

describe("Uniswap + ERC-20 Contracts", function () { 
    let TokenA, TokenB, WETH;
    let owner, addr1, addr2, addrs;
    let pether, fether;
    let unifactory, router, pair;
    let tokenaLiquidityAmount, tokenbLiquidityAmount;

    beforeEach(async function () {
      [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
      [fether, pether] = [ethers.utils.formatEther, ethers.utils.parseEther];
      [tokenaLiquidityAmount, tokenbLiquidityAmount] = [pether('1000000'),pether('2000000')]
    });
  
    describe("Deploy Tokens", function () {  

        it("Deploy TokenA", async function () {
            TokenA = await (await ethers.getContractFactory("TokenA")).deploy(pether('1000000000.0'));
            expect(fether(await TokenA.balanceOf(owner.address))).to.equal('1000000000.0');
        });

        it("Deploy TokenB", async function () {
            TokenB = await (await ethers.getContractFactory("TokenB")).deploy(pether('2000000000.0'));
            expect(fether(await TokenB.balanceOf(owner.address))).to.equal('2000000000.0');
        });

        it("Deploy WETH", async function () {
            WETH = await (await ethers.getContractFactory("WETH")).deploy(pether('3000000000.0'));
            expect(fether(await WETH.balanceOf(owner.address))).to.equal('3000000000.0');
        });
    });
    
    describe("Deploy UniswapV2", function () {  

        it("Deploy UniswapV2Factory", async function () {
            unifactory = await (await ethers.getContractFactory("UniswapV2Factory")).deploy(owner.address);
            expect(await unifactory.feeToSetter()).to.equal(owner.address);
        });
        
        it("Deploy UniswapV2Router02", async function () {
            router = await (await ethers.getContractFactory("UniswapV2Router02")).deploy(unifactory.address, WETH.address);
            expect(await router.factory()).to.equal(unifactory.address);
        });
    });

    describe("Create Pairs + Liquidity", function () {  
        it("Create trading pair for TokenA and TokenB", async function () {
            await unifactory.createPair(TokenA.address, TokenB.address);
            pair = await ethers.getContractAt("UniswapV2Pair", (await unifactory.getPair(TokenA.address, TokenB.address)));
            expect(await pair.factory()).to.equal(unifactory.address);
        });

        it("\"Approve\" 1M TokenA and 2M TokenB for transfer", async function () {
            await TokenA.approve(router.address, tokenaLiquidityAmount);
            await TokenB.approve(router.address, tokenbLiquidityAmount);
            expect(fether(await TokenA.allowance(owner.address, router.address))).to.equal('1000000.0');
            expect(fether(await TokenB.allowance(owner.address, router.address))).to.equal('2000000.0');
        });

        it("Add liquidity 1M TokenA and 2M TokenB", async function () {
            await router.addLiquidity(TokenA.address, TokenB.address, tokenaLiquidityAmount, tokenbLiquidityAmount, tokenaLiquidityAmount, tokenbLiquidityAmount, owner.address, 0)
            expect(fether(await TokenA.balanceOf(owner.address))).to.equal('999000000.0');
            expect(fether(await TokenB.balanceOf(owner.address))).to.equal('1998000000.0');
        });
    });

    describe("Transfer TokenA to addr1 and swap for TokenB", function () {  
        
        let tradeAmount, amount_out;
        let tradeAmountStr = '1000.0';
        
        it(`Transfer ${tradeAmountStr} TokenA to new account addr1`, async function () {
            TokenA.transfer(addr1.address, pether(tradeAmountStr));
            tradeAmount = await TokenA.balanceOf(addr1.address);
            expect(fether(tradeAmount)).to.equal(tradeAmountStr);
        });

        it("Get quote for swap", async function () {
            //we take 1% off for 'slippage'
            amount_out = await router.connect(addr1.address).getAmountsOut(tradeAmount, [TokenA.address, TokenB.address]);
            expect(fether(amount_out[0])).to.equal(tradeAmountStr);
            amount_out = amount_out[1].sub(amount_out[1].div(100));
        });

        it("Execute swapExactTokensForTokens from addr1 to swap TokenA with TokenB", async function () {
            await TokenA.connect(addr1).approve(router.address, tradeAmount);
            expect(fether(await TokenA.allowance(addr1.address, router.address))).to.equal(tradeAmountStr);
            await router.connect(addr1).swapExactTokensForTokens(tradeAmount, amount_out, [TokenA.address, TokenB.address], addr1.address, 0);
            expect(fether(await TokenA.balanceOf(addr1.address))).to.equal('0.0');
        });

        it("Remove liquidity back to owner using removeLiquidity", async function () {
            const liquidity = (await pair.balanceOf(owner.address));
            await pair.approve(router.address, liquidity);
            await router.removeLiquidity(TokenA.address, TokenB.address, liquidity, 0, 0, owner.address, 0);
            expect(fether(await pair.balanceOf(owner.address))).to.equal('0.0');
        });
    });

  });
