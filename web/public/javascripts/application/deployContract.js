function deployContract(web3, config, sender) {
	var contractABI = config.Ethereum.contracts.ProofOfPhone.abi;
	var compiled = config.Ethereum.contracts.ProofOfPhone.bin;

	console.log(web3.eth.accounts);
	web3.eth.defaultAccount = web3.eth.accounts[0];

	var gasWillUsed = web3.eth.estimateGas({
	    from: web3.eth.defaultAccount, 
	    data: compiled
	}, function(err, gasWillUsed) {
		console.log(gasWillUsed);
		gasWillUsed += 30000;

		var proofOfPhoneContract = web3.eth.contract(contractABI);
		proofOfPhoneContract.new(
		{
		   	data: compiled,
		   	gas: gasWillUsed,
		    from: sender
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
	});
}