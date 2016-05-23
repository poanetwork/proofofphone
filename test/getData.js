var fs = require('fs');
var Web3 = require('web3');
var web3;
var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
var contractABI = config.smartContract.abi;
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

var contractAddress;
if (config.environment == "live") {
	contractAddress = config.smartContract.contractAddress.live;
} else if (config.environment == "dev") {
	contractAddress = config.smartContract.contractAddress.test;
} else {
	contractAddress = config.smartContract.contractAddress.test;
}

var wallet = "";
var phone = "";

getData();

function getData() {
	console.log("config:");
	console.log(config);
	if(!web3.isConnected()) {
		console.log('{code: 200, title: "Error", message: "check RPC"}');
	} else {
		console.log(web3.eth.accounts);
		web3.eth.defaultAccount = web3.eth.accounts[1];
		console.log("web3.eth.defaultAccount:");
		console.log(web3.eth.defaultAccount);

		attachToContract(function(err, contract) {

			contract.getPaymentByAddress.call(wallet, function(err, val) {
				console.log("getPaymentByAddress:");
				console.log("address: " + wallet);
				console.log("payment: " + val);
			});

			contract.getPaymentDataByAddress.call(wallet, function(err, val) {
				console.log("getPaymentDataByAddress:");
				console.log("address: " + wallet);
				console.log("paymentData: " + val);
			});

			contract.getPhoneByAddress.call(wallet, function(err, val) {
				console.log("getPhoneByAddress:");
				console.log("address: " + wallet);
				console.log("phone: " + val);
			});

			contract.hasPhone.call(wallet, function(err, val) {
				console.log("hasPhone:");
				console.log("address: " + wallet);
				console.log("isJoined: " + val);
			});

			contract.phones.call(phone, function(err, val) {
				console.log("getAddressByPhone:");
				console.log("phone: " + phone);
				console.log("address: " + val);
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