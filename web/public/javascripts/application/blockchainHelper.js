function attachToContract(web3, config, cb) {
  if(!web3.isConnected()) {
    if (cb) cb({code: 200, title: "Error", message: "check RPC"}, null);
    return;
  }

  console.log(web3.eth.accounts);
  web3.eth.defaultAccount = web3.eth.accounts[0];
  console.log("web3.eth.defaultAccount:");
  console.log(web3.eth.defaultAccount);
  
  var MyContract = web3.eth.contract(config.Ethereum.contracts.ProofOfPhone.abi);

  contract = MyContract.at(config.Ethereum[config.environment].contractAddress);
  
  if (cb) cb(null, contract);
}

function getTxCallBack(txHash, cb) {
  web3.eth.getTransaction(txHash, function(err, txDetails) {
    if (err) console.log(err);
    if (!txDetails) {
      setTimeout(function() {
        getTxCallBack(txHash, cb);
      }, 2000);
    } else if (!txDetails.blockNumber) {
      setTimeout(function() {
        getTxCallBack(txHash, cb);
      }, 2000)
    } else cb();
  });
};