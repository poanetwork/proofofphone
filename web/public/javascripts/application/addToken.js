function addToken(web3, config, sender, phoneNumber, token, cb) {
	attachToContract(web3, config, function(err, contract) {
		newTokenTX(web3, contract, sender, phoneNumber, token, function(err, txHash) {
			//console.log("newTokenTX:");
			//console.log("result: " + txHash);
			cb(err, txHash);
		});

	});
}

function newTokenTX(web3, contract, sender, phoneNumber, token, cb) {
	if (!web3.isConnected()) return cb({code: 500, title: "Error", message: "check RPC"}, null);
	contract.newToken.sendTransaction(phoneNumber, token, {gas: 80000, from: sender}, function(err, result) {
		cb(err, result);
	});
}