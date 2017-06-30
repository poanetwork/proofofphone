var fs = require('fs');

var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

var Web3 = require('web3');
var web3;
if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider(config.Ethereum[config.environment].rpc));
}

var contractABI = config.Ethereum.contracts.ProofOfPhone.abi;
var compiled = config.Ethereum.contracts.ProofOfPhone.bin;


//estimateGas();
deployContract();

function estimateGas() {
	web3.eth.defaultAccount = web3.eth.accounts[0];
	var balance = web3.eth.getBalance(web3.eth.defaultAccount);
	console.log(balance.toString(10));
	console.log(balance.toNumber());
	console.log(balance);
	var result = web3.eth.estimateGas({
	    from: web3.eth.defaultAccount, 
	    data: compiled
	});
	console.log(result);
}

function deployContract() {
	console.log(web3.eth.accounts);
	web3.eth.defaultAccount = web3.eth.accounts[0];

	var gasWillUsed = web3.eth.estimateGas({
	    from: web3.eth.defaultAccount, 
	    data: compiled
	});
	console.log(gasWillUsed);
	gasWillUsed += 30000;

	var proofOfPhoneContract = web3.eth.contract(contractABI);
	proofOfPhoneContract.new(
	{
	   	data: compiled,
	   	gas: gasWillUsed,
	    from: web3.eth.defaultAccount
	}, function(err, contract) {
	   	if (!err) {
	       if (typeof contract.address != 'undefined') {
	           	console.log("contract:");
		    	console.log(contract);

		    	console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
	       } else {
	       		console.log(contract.transactionHash);
	       }
	    } else {
	    	console.log("error:");
	    	console.log(err);
	    }
	});
};