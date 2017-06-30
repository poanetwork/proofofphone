function getPhoneByAddress(web3, config, sender, addr, cb) {
	attachToContract(web3, config, function(err, contract) {
		getPhoneByAddressCall(web3, contract, sender, addr, function(err, phone) {
			if (err) {
				console.log("error: " + err);
				cb(err);
				return;
			}
			console.log("getPhoneByAddressCall:");
			console.log("phone: " + phone);
			cb(null, phone);
		});

	});
}

function getPhoneByAddressCall(web3, contract, sender, addr, cb) {
	if (!web3.isConnected()) cb({code: 500, title: "Error", message: "check RPC"}, null);

	contract.getPhoneByAddress.call(addr, {from: sender}, function(err, result) {
		cb(err, result);
	});
}