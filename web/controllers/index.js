module.exports = function (app) {
	var twilioClient = app.twilioClient;
	var MongoClient = app.MongoClient;
	var mongodbConnectionString = app.config.mongodbConnectionString;
	var randomInt = app.randomInt;
	var generateError = app.generateError;
	var web3 = app.web3;

	app.get('/', function(request, response) {
		response.render("index");
	});

	app.post('/sendCodeBySMS', function(request, response) {
		console.log(request.body);
		var globalToken = request.body.globalToken;
		if (globalToken != app.config.globalToken) return generateError(response, 401, "Unauthorized", "Wrong app token");

		var to = request.body.to;
		var code = randomInt(100000,1000000);
		console.log("code:" + code);
		twilioClient.messages.create({
		    body: code,
		    to: "+" + to,
		    from: app.config.sendSMS.twilio.phoneNumberLive
		}, function(err, message) {
			if (err) {
				console.log(err);
				return generateError(response, 500, "Can't send sms", err.message);
			}

			console.log("message.sid: " + message.sid);
			var token = "0x" + web3.sha3(code.toString());

			console.log("sms code:" + code);
			response.send({
		      success : {
		        code : 200,
		        title : "Success",
		        message : "SMS successfully sent",
		        token: token
		      }
		    });
		});
	});
}