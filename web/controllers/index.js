module.exports = function (app) {
	var twilioClient = app.twilioClient;
	var MongoClient = app.MongoClient;
	var mongodbConnectionString = app.config.mongodbConnectionString;
	var randomInt = app.randomInt;
	var attachToContract = app.attachToContract;

	app.get('/', function(request, response) {
		attachToContract(function(err, contract) {
			if (err) {
				response.render("index", {
					address: app.contractAddress
				});
			} else {
				response.render("index", {
					address: app.contractAddress
				});
			}
		});
	});

	app.post('/sendCodeBySMS', function(request, response) {
		console.log(request.body);
		var globalToken = request.body.globalToken;
		if (globalToken == app.config.globalToken) {
			var to = request.body.to;
			var code = randomInt(100000,1000000);
			twilioClient.messages.create({
			    body: code,
			    to: "+" + to,
			    from: app.config.sendSMS.twilio.phoneNumberLive
			}, function(err, message) {
				if (err) {
					console.log(err);
					response.send({
				      error : {
				        code : 500,
				        title : "Can't send sms",
				        message : err.message
				      }
				    });
				} else {
					console.log("message.sid: " + message.sid);
					insertSentCodeToDB(to, code, function(err) {
						if (err) {
							console.log(err);
							response.send({
						      error : {
						        code : 500,
						        title : "Can't insert code to db",
						        message : err.message
						      }
						    });
						} else {
							console.log("sms code:" + code);
							response.send({
						      success : {
						        code : 200,
						        title : "Success",
						        message : "SMS successfully sent"
						      }
						    });
						}
					});
				}
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

	function insertSentCodeToDB(phone, code, cb) {
		MongoClient.connect(mongodbConnectionString, function(err, db) {
		    if(err) {
		    	cb(err);
		    } else {
		    	var collection = db.collection('PhoneCodes');
			    collection.remove({phone: phone}, function(err, result) {
				    if(err) {
				    	db.close();
				    	cb(err);
				    } else {
				    	collection.insert({phone: phone, code: code}, function(err, docs) {
				    		if(err) {
						    	db.close();
						    	cb(err);
						    } else {
						    	db.close();
						    	cb(null);
						    }
					    });
				    }
				});
		    }
		});
	}

	app.post("/verifyCodeFromSMS", function(request, response) {
		console.log(request.body);
		var globalToken = request.body.globalToken;
		var code = request.body.code;
		var phone = request.body.phone;
		if (globalToken == app.config.globalToken) {
			MongoClient.connect(mongodbConnectionString, function(err, db) {
			    if(err) {
			    	response.send({
				      error : {
				        code : 500,
				        title : "Error",
				        message: err.message
				      }
				    });
			    } else {
			    	var collection = db.collection('PhoneCodes');
				    collection.find({"code": parseInt(code), "phone": phone }, function(err, cursor) {
					    if (err) { 
					    	console.log(err);
					    	response.send({
						      error : {
						        code : 500,
						        title : "Error",
						        message: "Wrong code"
						      }
						    });
					    } else {
					    	cursor.toArray(function(err, results) {
					    		console.log(err);
					    		if (!results) {
						    		response.send({
								      error : {
								        code : 500,
								        title : "Error",
								        message: "Wrong code"
								      }
								    });
						    	} else if (results.length > 0) {
						    		var hash = app.crypto.createHmac('sha256', app.config.salt)
					                   .update(code)
					                   .digest('hex');
									console.log(hash);
						    		console.log(results);
						    		var result = results[0];
						    		response.send({
								      success : {
								        code : 200,
								        message: hash
								      }
								    });
						    	} else {
						    		response.send({
								      error : {
								        code : 500,
								        title : "Error",
								        message: "Wrong code"
								      }
								    });
						    	}
						    	db.close();
					    	});
					    }
					});
			    }
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
}