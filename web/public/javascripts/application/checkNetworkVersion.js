//check current network page is connected to. Alerts, if not Oracles network
function checkNetworkVersion(web3, cb) {
  var msgNotOracles = "You aren't connected to Oracles network. Please, switch on Oracles plugin and choose Oracles network. Check Oracles network <a href='https://github.com/oraclesorg/oracles-wiki' target='blank'>wiki</a> for more info.";
  web3.version.getNetwork(function(err, netId) {
    if (err)
      console.log(err);
    console.log("netId: " + netId);
    switch (netId) {
      case "1": {
        console.log('This is mainnet');
        showAlert(null, msgNotOracles, "warning");
        cb(false);
      } break;
      case "2": {
        console.log('This is the deprecated Morden test network.');
        showAlert(null, msgNotOracles, "warning");
        cb(false);
      } break;
      case "3": {
        console.log('This is the ropsten test network.');
        showAlert(null, msgNotOracles, "warning");
        cb(false);
      }  break;
       case "12648430": {
         console.log('This is Oracles from Metamask');
         cb(true);
      }  break;
      default: {
        console.log('This is an unknown network.');
        showAlert(null, msgNotOracles, "warning");
        cb(false);
      } break;
    }
  })
}