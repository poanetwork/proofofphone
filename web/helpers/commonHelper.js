module.exports = function (app) {
	app.randomInt = randomInt;
	
	function randomInt (low, high) {
	    return Math.floor(Math.random() * (high - low) + low);
	}
};