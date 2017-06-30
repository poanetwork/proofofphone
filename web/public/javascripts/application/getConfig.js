//gets config file with address of Oracles contract
function getConfig(cb) {
  $.getJSON("./javascripts/config.json", function(config) {
    cb(config);
  });
}