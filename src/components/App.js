import React, { Component } from 'react'
import logo from '../logo.png'
import './App.css'
import Web3 from 'web3'
import Navbar from './Navbar'
import Main from './Main'
import EthSwap from '../abis/EthSwap.json'
import Token  from '../abis/Token.json'

class App extends Component {

  //loading web3  
  async componentWillMount(){  // this methd gets loaded bfre render methd
    await this.loadWeb3() //calling loadweb3 methd
    await this.loadBlockchainData()// import all the needed data from our applctn thts stored on bc
  }

  async loadBlockchainData(){
    const web3= window.web3
    //loading account from mrtamask
    const accounts=await web3.eth.getAccounts()
    this.setState({account:accounts[0]}) //setting data in state's account var
    console.log(this.state.account)


   const ethBalance=await web3.eth.getBalance(this.state.account)
   // this.setState({ethBalance:ethBalance}) or when u have same key and value
   this.setState({ ethBalance })
   console.log(this.state.ethBalance )

   //loading sc's directly from truffle-config file
   //taking Ethswap.json &Token.json which is an abi(whch tells how all the code works) . uisng ths abi to create js version of sc's so tht we can call its fns
  
//LOAD TOKEN sc

  const networkId= await web3.eth.net.getId()//gettng ntwrk id of n/w tht we r cnnctd to autmtcly from mm
  const tokenData=Token.networks[networkId]
  if(tokenData){ //if n/w id exists
    //creating new web3 contrct
    const token=new web3.eth.Contract(Token.abi, tokenData.address)// abi tells how sc works, what fn's are &  addrss= whre tht sc is on bc.
    console.log(token)
    this.setState({token}) //setting token to props

    let tokenBalance=await token.methods.balanceOf(this.state.account).call()//fetchng token bal of person cnnctd to bc from mm
    console.log("tokenBalance",tokenBalance.toString())
    this.setState({tokenBalance:tokenBalance.toString() })

  }else{
    window.alert('Token contract not deployed to detected Network ! ')
  }

//LOAD ETHSWAP sc
  const ethSwapData=EthSwap.networks[networkId]
  if(ethSwapData){ //if n/w id exists
    //creating new web3 contrct
    const ethSwap=new web3.eth.Contract(EthSwap.abi, ethSwapData.address)// abi tells how sc works, what fn's are &  addrss= whre tht sc is on bc.
    console.log(ethSwap)
    this.setState({ethSwap}) //setting token to props
  }else{
    window.alert('EthSwap contract not deployed to detected Network ! ')
  }

  this.setState({loading:false})// set laoding to false when all this is rendeered

  }

  async loadWeb3(){ 
    // pulling ethereum from metamask

    if(window.ethereum){
   
      window.web3= new Web3(window.ethereum)
      // await window.ethereum.enable() //To access user accounts 
      window.ethereum.request({ method: "eth_requestAccounts" });
          
    }
    else if(window.web3){
       window.web3= new Web3(window.ethereum);
     
    }
    else{
      window.alert('Non-Ethereum browser detected. You should consider trying metamask');
    }
 }

 //buytokens fn
 buyTokens=(etherAmount)=>{
  this.setState({loading:true})
  this.state.ethSwap.methods.buyTokens().send({value: etherAmount, from: this.state.account}).on('transactionHash',(hash)=>{
            this.setState({loading : false})
           })
  }   
  //SELL TOKENS FN
  //buytokens fn
 sellTokens = (tokenAmount) => {
    this.setState({ loading: true })
    this.state.token.methods.approve(this.state.ethSwap.address, tokenAmount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.ethSwap.methods.sellTokens(tokenAmount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }   

  //storing this in state so that we can access account at other places in app
  constructor(props){
    super(props)
    this.state={
      account: '', //setting default acc as empty string
      ethSwap:{},
      token:{},
      ethBalance:'0',
      tokenBalance:'0',
      loading:true 
    }
  }
  render() {
    let content
    if(this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <Main
        ethBalance={this.state.ethBalance}
        tokenBalance={this.state.tokenBalance}
        buyTokens={this.buyTokens}
        sellTokens={this.sellTokens}
      />

    }  //passing eth n token bal to main.js..also if its not loading, shoow the content(Wrttn blw)

    return (
      <div>

        <Navbar account={this.state.account}/> //importing Navbar component & passing account info to Navbar compo

        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{maxWidth: '600px'}}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
        
                </a>
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

//