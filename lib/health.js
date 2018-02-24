var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

function route() {
  var router = new express.Router();
  router.use(cors());
  router.use(bodyParser());

  router.get('/', function(req, res) {
    res.status(200).json({msg: 'alive'});
  });

  return router;
}

module.exports = route;
