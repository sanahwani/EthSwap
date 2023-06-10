const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");



module.exports =async function(deployer) {

	//deploy token
	await deployer.deploy(Token);
  	const token=await Token.deployed()

  	//deploy EthSwap
 	await  deployer.deploy(EthSwap, token.address);// pass token address along ewhn dployng to bc
  	const ethSwap=await EthSwap.deployed()



   //transfer all tokens to ethswap (1 milliom)
   await token.transfer(ethSwap.address, '1000000000000000000000000')
};
