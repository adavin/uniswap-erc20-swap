require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ganache");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
/*module.exports = {
  solidity: "0.8.9",
  solidity: "0.5.6",
};*/
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ],
  },
  hardhat: {
    chainId: 1337,
    throwOnTransactionFailures: true,
    throwOnCallFailures : true,
    allowUnlimitedContractSize: true
    },
  //defaultNetwork: "ganache",
    networks: {
      ganache: {
        defaultBalanceEther: 100,
        url: "http://127.0.0.1:7545",
        //gasMultiplier: 2,
        //blockGasLimit: 30000000000,
        //gas: 'auto',
        //gasPrice: 100,
        throwOnTransactionFailures: true,
        throwOnCallFailures : true,
        //hardfork: 'petersburg',
        allowUnlimitedContractSize: true,
        loggingEnabled: true,
      },
      
    },
};
