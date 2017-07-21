function verifyCodeFromSMS(web3, config, sender, code, cb) {
	activatePair(web3, config, sender, code, function(err, txHash) {
		cb(err, txHash);
	});
}

function activatePair(web3, config, sender, code, cb) {
	attachToContract(web3, config, function(err, contract) {
		activatePairTX(web3, contract, sender, code, function(err, txHash) {
			//console.log("activatePairTX:");
			//console.log("result: " + txHash);
			cb(err, txHash);
		});

	});
}

function activatePairTX(web3, contract, sender, code, cb) {
	if (!web3.isConnected()) cb({code: 500, title: "Error", message: "check RPC"}, null);

	contract.activatePair.sendTransaction(code.toString(), {gas: 100000, from: sender}, function(err, result) {
		cb(err, result);
	});
}