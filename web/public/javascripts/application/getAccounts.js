//get current account chosen in MetaMask or opened at Parity
function getAccounts(cb) {
	web3.eth.getAccounts(function(err, accounts) {
		if (err) {
			$(".loading-container").hide();
			showAlert(err, err.message);
			return;
		}

		cb(accounts);
	});
}