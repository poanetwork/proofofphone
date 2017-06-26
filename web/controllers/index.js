module.exports = function (app) {
	var twilioClient = app.twilioClient;
	var MongoClient = app.MongoClient;
	var mongodbConnectionString = app.config.mongodbConnectionString;
	var randomInt = app.randomInt;
	var attachToContract = app.attachToContract;
	var generateError = app.generateError;

	app.get('/', function(request, response) {
		attachToContract(function(err, contract) {
			if (err) {
				console.log(err);
				response.render("index", {
					address: app.contractAddress
				});
				return;
			}

			response.render("index", {
				address: app.contractAddress
			});
		});
	});

	app.post('/sendCodeBySMS', function(request, response) {
		console.log(request.body);
		var globalToken = request.body.globalToken;
		if (globalToken != app.config.globalToken) {
			generateError(response, 401, "Unauthorized", "Wrong app token");
			return;
		}

		var to = request.body.to;
		var code = randomInt(100000,1000000);
		twilioClient.messages.create({
		    body: code,
		    to: "+" + to,
		    from: app.config.sendSMS.twilio.phoneNumberLive
		}, function(err, message) {
			if (err) {
				console.log(err);
				generateError(response, 500, "Can't send sms", err.message);
				return;
			}

			console.log("message.sid: " + message.sid);
			insertSentCodeToDB(to, code, function(err) {
				if (err) {
					console.log(err);
					generateError(response, 500, "Can't insert code to db", err.message);
					return;
				}

				console.log("sms code:" + code);
				response.send({
			      success : {
			        code : 200,
			        title : "Success",
			        message : "SMS successfully sent"
			      }
			    });
			});
		});
	});

	function insertSentCodeToDB(phone, code, cb) {
		MongoClient.connect(mongodbConnectionString, function(err, db) {
		    if(err) return cb(err);

	    	var collection = db.collection('PhoneCodes');
		    collection.remove({phone: phone}, function(err, result) {
			    if (err) {
			    	db.close();
			    	return cb(err);
			    }

		    	collection.insert({phone: phone, code: code}, function(err, docs) {
		    		db.close();
		    		if (err) return cb(err);
			    	cb(null);
			    });
			});
		});
	}

	app.post("/verifyCodeFromSMS", function(request, response) {
		console.log(request.body);
		var globalToken = request.body.globalToken;
		var code = request.body.code;
		var phone = request.body.phone;
		if (globalToken != app.config.globalToken) {
			generateError(response, 401, "Unauthorized", "Wrong app token");
			return;
		}

		MongoClient.connect(mongodbConnectionString, function(err, db) {
		    if (err) {
		    	generateError(response, 500, "Error", err.message);
		    	return;
		    }

	    	var collection = db.collection('PhoneCodes');
		    collection.find({"code": parseInt(code), "phone": phone }, function(err, cursor) {
			    if (err) { 
			    	console.log(err);
			    	generateError(response, 500, "Error", "Wrong code");
			    	return;
			    }

		    	cursor.toArray(function(err, results) {
		    		console.log(err);
		    		if (!results) {
		    			generateError(response, 500, "Error", "Wrong code");
		    			return;
			    	}

			    	if (results.length == 0) {
		    			generateError(response, 500, "Error", "Wrong code");
		    			return;
			    	}  

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
			    	db.close();
		    	});
			});
		});
	});
}