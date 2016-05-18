module.exports = function (app) {
	var web3 = app.web3;

	var contract;
	app.attachToContract = attachToContract;

	var contractABI = app.config.smartContract.abi;

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

			contract = MyContract.at(app.contractAddress);
			
			if (cb) {
				cb(null, contract);
			}
		}
	}

	function newPhoneToAddr(wallet, phone, cb) {
		if(!web3.isConnected()) {
			cb({code: 500, title: "Error", message: "check RPC"}, null);
		} else {
			contract.newPhoneToAddr.sendTransaction(wallet, phone, {gas: 100000, from: web3.eth.defaultAccount}, function(err, result) {
				cb(err, result);
			});
		}
	}

	app.post('/newPhoneToAddr', function(request, response) {
		var globalToken = request.body.globalToken;
		if (globalToken == app.config.globalToken) {
			var phone = parseInt(request.body.phone);
			var wallet = request.body.wallet;
			var code = request.body.code;
			console.log(wallet);
			console.log(request.body.wallet);
			var isHex  = /^0x[0-9A-Fa-f]{40}$/i.test(wallet);
			if (isHex) {
				contract.getPaymentByAddress.call(wallet, function(err, val) {
					console.log("err:");
					console.log(err);
					console.log("val:");
					console.log(val);
					if (val > 0) {
						contract.getPaymentDataByAddress.call(wallet, function(err, paymentData) {
							console.log("err:");
							console.log(err);
							console.log("paymentData:");
							console.log(paymentData);


							var hash = app.crypto.createHmac('sha256', app.config.salt)
		                   	.update(code)
		                   	.digest('hex');

		                   	console.log("hash:");
		                   	console.log(hash);

		                   	//var hashBuf = new Buffer(hash, 'binary').toString('hex');
							//console.log("hashBuf:");
		                   	//console.log(hashBuf.toString());
		                   	
		                   	console.log(paymentData.substring(2) + " == " + hash);
							if (paymentData.substring(2) == hash) {
								newPhoneToAddr(wallet, phone, function(err, result) {
									console.log(err);
									console.log(result);
									response.send({
								      success : {
								        code : 200,
								        title : "Success",
								        message : "Phone successfully joined"
								      }
								    });
								});
							} else {
								response.send({
							      error : {
							        code : 1000,
							        title : "Warning",
							        message : "Sent message doesn't match with the one displayed on the page"
							      }
							    });
							}
						});
					} else {
						response.send({
					      error : {
					        code : 1000,
					        title : "Warning",
					        message : "Payment wasn't sent yet"
					      }
					    });
					}
				});
			} else {
				response.send({
			      error : {
			        code : 500,
			        title : "Error",
			        message : "Not valid address"
			      }
			    });
			}
		} else {
			response.send({
		      error : {
		        code : 401,
		        title : "Unauthorized",
		        message : "Wrong app token"
		      }
		    });
		}
	});

	app.post('/getPhoneByAddress', function(request, response) {
		var globalToken = request.body.globalToken;
		if (globalToken == app.config.globalToken) {
			var wallet = request.body.wallet;
			var isHex  = /^0x[0-9A-Fa-f]{40}$/i.test(wallet)
			if (isHex) {

				var phone = contract.getPhoneByAddress.call(wallet, function(err, obj) {
					console.log("err:");
					console.log(err);
					console.log("obj:");
					console.log(obj);
					response.send({
				      success : {
				        code : 200,
				        title : "Success",
				        message : "Phone successfully joined",
				        phone: obj
				      }
				    });
				});
			} else {
				response.send({
			      error : {
			        code : 500,
			        title : "Error",
			        message : "Not valid address"
			      }
			    });
			}
		} else {
			response.send({
		      error : {
		        code : 401,
		        title : "Unauthorized",
		        message : "Wrong app token"
		      }
		    });
		}
	});

	app.post('/getAddressByPhone', function(request, response) {
		var globalToken = request.body.globalToken;
		if (globalToken == app.config.globalToken) {
			
			var phone = parseInt(request.body.phone);
			var address = contract.phones.call(phone, function(err, address) {
				console.log(address);
				response.send({
			      success : {
			        code : 200,
			        title : "Success",
			        message : "Phone successfully joined",
			        addr: address
			      }
			    });
			});
		} else {
			response.send({
		      error : {
		        code : 401,
		        title : "Unauthorized",
		        message : "Wrong app token"
		      }
		    });
		}
	});
};