pragma solidity ^0.5.0;

import "./Token.sol";

 contract EthSwap{
 	string public name="EthSwap Instant Exchange";
 	Token public token;
 	uint public rate=100;

 	event TokensPurchased(
 		address account,// whos buying token
 		address token, //add of purchsd token
 		uint amount,
 		uint rate
 	);

 		event TokensSold(
 		address account,
 		address token, 
 		uint amount,
 		uint rate
 	);

//passing address of  token along
 	constructor (Token _token) public{
 		token=_token;

 	}

 //calculate no. of tokens to buy-> amt of ethereum * redemption rate
 //redemption rate-> no. of tokens they recve fr 1 ether(here 1eth=100UG)

	function buyTokens() public payable{

		uint  tokenAmount= msg.value*rate;
		
		//MKE SURE THAT exchnge has enough tokens. this ->refrnces to ethswaps address
		require(token.balanceOf(address(this))>=tokenAmount);  

		token.transfer(msg.sender, tokenAmount);

		//emit an event
		emit TokensPurchased(msg.sender,address(token), tokenAmount, rate);
		
 	}	

 	//sell token 
 	function sellTokens(uint _amount) public{
 		//opp. of buy tokens. trnsfr tokens frm investor to ethSwap in exchnge of ether

 		//user can't sell more tokens than they have
 		require(token.balanceOf(msg.sender) >= _amount);

 		//cal amt of ether to redeem
 		uint etherAmount= _amount / rate;

 		//require that ethswap has nough tokens
 		require(address(this).balance >=etherAmount);

 		//performing sale
 		//allwng s.contrct to spend ur tokens fr u. also allow approve fn first to let this fn work

 		token.transferFrom(msg.sender, address(this), _amount); //who's it going from, who is it going to & amt
 		msg.sender.transfer(etherAmount);

 		emit TokensSold(msg.sender, address(token), _amount, rate);
 	}
 }		



