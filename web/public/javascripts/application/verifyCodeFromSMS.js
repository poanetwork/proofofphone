function verifyCodeFromSMS(web3, config, sender, token, cb) {
	activatePair(web3, config, sender, token, function(err, txHash) {
		cb(err, txHash);
	});
}

function activatePair(web3, config, sender, token, cb) {
	attachToContract(web3, config, function(err, contract) {
		activatePairTX(web3, contract, sender, token, function(err, txHash) {
			//console.log("activatePairTX:");
			//console.log("result: " + txHash);
			cb(err, txHash);
		});

	});
}

function activatePairTX(web3, contract, sender, token, cb) {
	if (!web3.isConnected()) cb({code: 500, title: "Error", message: "check RPC"}, null);

	contract.activatePair.sendTransaction(token, {gas: 800000, from: sender}, function(err, result) {
		cb(err, result);
	});
}