const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const GIT_TAG = process.env.GIT_TAG || "NO_TAG_FROM_DOCKERFILE";

function route() {
  var router = new express.Router();
  router.use(cors());
  router.use(bodyParser());

  router.get('/', function(req, res) {
    res.status(200).json({msg: 'alive', tag: GIT_TAG});
  });

  return router;
}

module.exports = route;
