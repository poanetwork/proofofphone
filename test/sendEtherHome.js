var fs = require('fs');
var Web3 = require('web3');
var web3;
var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
var contractABI = config.smartContract.abi;
var contractAddress;
if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  if (config.environment == "live") {
  	web3 = new Web3(new Web3.providers.HttpProvider(config.smartContract.rpc.live));
  	contractAddress = config.smartContract.contractAddress.live;
  } else if (config.environment == "dev") {
  	web3 = new Web3(new Web3.providers.HttpProvider(config.smartContract.rpc.test));
  	contractAddress = config.smartContract.contractAddress.test;
  } else {
  	web3 = new Web3(new Web3.providers.HttpProvider(config.smartContract.rpc.test));
  	contractAddress = config.smartContract.contractAddress.test;
  }
}

sendEtherHome();

function sendEtherHome() {
	if(!web3.isConnected()) {
		console.log('{code: 200, title: "Error", message: "check RPC"}');
	} else {
		var balance = web3.eth.getBalance(contractAddress);
		console.log(balance.toString(10));
		console.log(balance.toNumber());
		console.log(balance);

		return;

		attachToContract(function(err, contract) {
			contract.sendEtherToOwner.sendTransaction({from: web3.eth.defaultAccount}, function(err, result) {
				console.log("TEST");
				if (err)
					console.log(err);
				else
					console.log(result);
			});
		});
	}
}

function attachToContract(cb) {
	if(!web3.isConnected()) {
		if (cb) {
				cb({code: 200, title: "Error", message: "check RPC"}, null);
			}
	} else {
		console.log(web3.eth.accounts);
		web3.eth.defaultAccount = web3.eth.accounts[1];
		console.log("web3.eth.defaultAccount:");
		console.log(web3.eth.defaultAccount);
		
		var MyContract = web3.eth.contract(contractABI);

		contract = MyContract.at(contractAddress);
		
		if (cb) {
			cb(null, contract);
		}
	}
}