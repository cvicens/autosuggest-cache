var express = require('express');
var corser = require("corser");

var app = express();
app.use(corser.create());

app.use(express.static(__dirname + '/dist'));

app.use('/', require('./lib/health.js')());
app.use('/hello', require('./lib/hello.js')());
app.use('/cache', require('./lib/cache.js')());

app.options("*", function (req, res) {
  // CORS
  res.writeHead(204);
  res.end();
});

var port = process.env.GKE_NODEJS_PORT || 8080;
var host = process.env.GKE_NODEJS_IP || '0.0.0.0';
var server = app.listen(port, host, function() {
  console.log("App started at: " + new Date() + " on port: " + port);
});
module.exports = server;