var express = require('express');
var http = require('http');
var https = require('https');
var twilio = require('twilio');
var mongodb = require('mongodb');
var bodyParser = require('body-parser');
var fs = require('fs');
var crypto = require('crypto');
var Web3 = require('web3');

var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

var twilioClient = twilio(config.sendSMS.twilio.accountSIDLive, config.sendSMS.twilio.authTokenLive);
var MongoClient = mongodb.MongoClient;

var web3;
if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider(config.Ethereum[config.environment].rpc));
}

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var app = express();

app.config = config;
app.fs = fs;
app.http = http;
app.https = https;
app.bodyParser = bodyParser;
app.twilioClient = twilioClient;
app.web3 = web3;
app.crypto = crypto;
app.MongoClient = MongoClient;

function errorHandler(err, req, res, next) {
  	res.status(500);
  	res.send({
      error : {
        code : 500,
        message : "Error",
        err : err.message
      }
    });
}

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(errorHandler);

process.on('uncaughtException', function(err) {
  console.error(err.stack);
});

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'pug');

require('./helpers/commonHelper')(app);
require('./controllers/index')(app);

app.listen(app.get('port'), function () {
  console.log('ProofOfPhone is running on port', app.get('port'));
});