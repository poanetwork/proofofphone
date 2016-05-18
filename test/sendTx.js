var fs = require('fs');
var Web3 = require('web3');
var web3;
var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  if (config.environment == "live")
    web3 = new Web3(new Web3.providers.HttpProvider(config.smartContract.rpc.live));
  else if (config.environment == "dev")
    web3 = new Web3(new Web3.providers.HttpProvider(config.smartContract.rpc.test));
  else
    web3 = new Web3(new Web3.providers.HttpProvider(config.smartContract.rpc.test));
}

var message = "0x53b28b07b0fb582e5ed85c1be36e642eb8e0be331f0df48ed13e881436e0062a";
var val = 100000000000000000;

sendTransaction();

function sendTransaction() {
	console.log("config:");
	console.log(config);
	if(!web3.isConnected()) {
		console.log('{code: 200, title: "Error", message: "check RPC"}');
	} else {
		console.log(web3.eth.accounts);
		web3.eth.defaultAccount = web3.eth.accounts[0];
		console.log("web3.eth.defaultAccount:");
		console.log(web3.eth.defaultAccount);

		var contractAddress;
		if (config.environment == "live") {
			contractAddress = config.smartContract.contractAddress.live;
		} else if (config.environment == "dev") {
			contractAddress = config.smartContract.contractAddress.test;
		} else {
			contractAddress = config.smartContract.contractAddress.test;
		}

		var gasWillUsed = web3.eth.estimateGas({
		    from: web3.eth.defaultAccount,
		    to: contractAddress,
		    value: val,
		    data: message
		});
		//gasWillUsed = gasWillUsed + 60000;
		console.log(gasWillUsed);
		
		//sending test tx
		web3.eth.sendTransaction({
				gas: gasWillUsed, 
				value: val, 
				from: web3.eth.defaultAccount, 
				to: contractAddress, 
				data: message
		}, function(err, address) {
		  	if (!err)
		    	console.log(address);
			else {
				console.log("err:");
				console.log(err);
			}
		});
	}
}