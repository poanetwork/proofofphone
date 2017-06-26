module.exports = function (app) {
	app.randomInt = randomInt;
	app.generateError = generateError;
	
	function randomInt (low, high) {
	    return Math.floor(Math.random() * (high - low) + low);
	}

	function generateError (response, code, title, message) {
		response.send({
	      error : {
	        code : code,
	        title : title,
	        message : message
	      }
	    });
	}
};