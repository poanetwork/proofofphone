function getAddressByPhone(web3, config, sender, phoneNumber, cb) {
	attachToContract(web3, config, function(err, contract) {
		getAddressByPhoneCall(web3, contract, sender, phoneNumber, function(err, addr) {
			if (err) {
				console.log("error: " + err);
				cb(err);
				return;
			}
			console.log("getAddressByPhoneCall:");
			console.log("addr: " + addr);
			cb(null, addr);
		});

	});
}

function getAddressByPhoneCall(web3, contract, sender, phoneNumber, cb) {
	if (!web3.isConnected()) cb({code: 500, title: "Error", message: "check RPC"}, null);

	contract.getAddressByPhone.call(phoneNumber, {from: sender}, function(err, result) {
		cb(err, result);
	});
}