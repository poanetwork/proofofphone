var express = require('express');
var http = require('http');
var https = require('https');
var twilio = require('twilio');
var mongodb = require('mongodb');
var bodyParser = require('body-parser');
var fs = require('fs');
var Web3 = require('web3');
var crypto = require('crypto');

var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

var twilioClient = twilio(config.sendSMS.twilio.accountSIDLive, config.sendSMS.twilio.authTokenLive);
var MongoClient = mongodb.MongoClient;

var web3;
if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  if (config.environment == "live")
    web3 = new Web3(new Web3.providers.HttpProvider(config.smartContract.rpc.live));
  else if (config.environment == "dev")
    web3 = new Web3(new Web3.providers.HttpProvider(config.smartContract.rpc.test));
  else
    web3 = new Web3(new Web3.providers.HttpProvider(config.smartContract.rpc.test));
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

if (config.environment == "live") {
  app.contractAddress = config.smartContract.contractAddress.live;
  app.contractWallet = config.smartContract.wallet.live;
} else if (config.environment == "dev") {
  app.contractAddress = config.smartContract.contractAddress.test;
  app.contractWallet = config.smartContract.wallet.test;
} else {
  app.contractAddress = config.smartContract.contractAddress.test;
  app.contractWallet = config.smartContract.wallet.test;
}

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

app.set('view engine', 'jade');

require('./helpers/commonHelper')(app);
require('./helpers/etherHelper')(app);
require('./controllers/index')(app);

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});