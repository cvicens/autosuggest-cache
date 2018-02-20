const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const port = process.env.CACHE_PORT || 6379;
const host = process.env.CACHE_HOST || '0.0.0.0';

const SEARCH_MAX_SIZE = 20;

console.log('host', host, 'port', port);

const redis = require('redis');
const client = redis.createClient(port, host, {
  retry_strategy: function (options) {
      if (options.error && options.error.code === 'ECONNREFUSED') {
          // End reconnecting on a specific error and flush all commands with
          // a individual error
          return new Error('The server refused the connection');
      }
      if (options.total_retry_time > 1000 * 60 * 60) {
          // End reconnecting after a specific timeout and flush all commands
          // with a individual error
          return new Error('Retry time exhausted');
      }
      if (options.attempt > 10) {
          // End reconnecting with built in error
          return undefined;
      }
      // reconnect after
      return Math.min(options.attempt * 100, 3000);
  }
});
let cacheReady = false;

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

client.on("connect", function () {
  console.log("connected");
});

client.on("reconnecting", function () {
  console.log("reconnecting");
  cacheReady = false;
});

client.on("end", function (d) {
  console.log("end", d);
  cacheReady = false;
});

client.on("error", function (err) {
  console.log("error >>>> " + err);
  cacheReady = false;
});

client.on("ready", function () {
  console.log("ready");
  cacheReady = true;
  _populate ();
});

function _populate() {
  //{"sku":sku-43900,"name":"Duracell - AAA Batteries (4-Pack)","type":"HardGood","price":5.49,"upc":"041333424019","category":[{"id":"pcmcat312300050015","name":"Connected Home & Housewares"},{"id":"pcmcat248700050021","name":"Housewares"},{"id":"pcmcat303600050001","name":"Household Batteries"},{"id":"abcat0208002","name":"Alkaline Batteries"}],"shipping":5.49,"description":"Compatible with select electronic devices; AAA size; DURALOCK Power Preserve technology; 4-pack","manufacturer":"Duracell","model":"MN2400B4Z","url":"http://www.bestbuy.com/site/duracell-aaa-batteries-4-pack/sku-43900.p?id=1051384074145&skuId=sku-43900&cmp=RMXCC","image":"http://img.bbystatic.com/BestBuy_US/images/products/4390/43900_sa.jpg"},
  //{"sku":sku-48530,"name":"Duracell - AA 1.5V CopperTop Batteries (4-Pack)","type":"HardGood","price":5.49,"upc":"041333415017","category":[{"id":"pcmcat312300050015","name":"Connected Home & Housewares"},{"id":"pcmcat248700050021","name":"Housewares"},{"id":"pcmcat303600050001","name":"Household Batteries"},{"id":"abcat0208002","name":"Alkaline Batteries"}],"shipping":5.49,"description":"Long-lasting energy; DURALOCK Power Preserve technology; for toys, clocks, radios, games, remotes, PDAs and more","manufacturer":"Duracell","model":"MN1500B4Z","url":"http://www.bestbuy.com/site/duracell-aa-1-5v-coppertop-batteries-4-pack/sku-48530.p?id=1099385268988&skuId=sku-48530&cmp=RMXCC","image":"http://img.bbystatic.com/BestBuy_US/images/products/4853/48530_sa.jpg"},
  //{"sku":sku-127687,"name":"Duracell - AA Batteries (8-Pack)","type":"HardGood","price":7.49,"upc":"041333825014","category":[{"id":"pcmcat312300050015","name":"Connected Home & Housewares"},{"id":"pcmcat248700050021","name":"Housewares"},{"id":"pcmcat303600050001","name":"Household Batteries"},{"id":"abcat0208002","name":"Alkaline Batteries"}],"shipping":5.49,"description":"Compatible with select electronic devices; AA size; DURALOCK Power Preserve technology; 8-pack","manufacturer":"Duracell","model":"MN1500B8Z","url":"http://www.bestbuy.com/site/duracell-aa-batteries-8-pack/sku-127687.p?id=1051384045676&skuId=sku-127687&cmp=RMXCC","image":"http://img.bbystatic.com/BestBuy_US/images/products/1276/127687_sa.jpg"},
  //{"sku":sku-150115,"name":"Energizer - MAX Batteries AA (4-Pack)","type":"HardGood","price":4.99,"upc":"039800011329","category":[{"id":"pcmcat312300050015","name":"Connected Home & Housewares"},{"id":"pcmcat248700050021","name":"Housewares"},{"id":"pcmcat303600050001","name":"Household Batteries"},{"id":"abcat0208002","name":"Alkaline Batteries"}],"shipping":5.49,"description":"4-pack AA alkaline batteries; battery tester included","manufacturer":"Energizer","model":"E91BP-4","url":"http://www.bestbuy.com/site/energizer-max-batteries-aa-4-pack/sku-150115.p?id=1051384046217&skuId=sku-150115&cmp=RMXCC","image":"http://img.bbystatic.com/BestBuy_US/images/products/1501/150115_sa.jpg"},
  //{"sku":sku-185230,"name":"Duracell - C Batteries (4-Pack)","type":"HardGood","price":8.99,"upc":"041333440019","category":[{"id":"pcmcat312300050015","name":"Connected Home & Housewares"},{"id":"pcmcat248700050021","name":"Housewares"},{"id":"pcmcat303600050001","name":"Household Batteries"},{"id":"abcat0208002","name":"Alkaline Batteries"}],"shipping":5.49,"description":"Compatible with select electronic devices; C size; DURALOCK Power Preserve technology; 4-pack","manufacturer":"Duracell","model":"MN1400R4Z","url":"http://www.bestbuy.com/site/duracell-c-batteries-4-pack/sku-185230.p?id=1051384046486&skuId=sku-185230&cmp=RMXCC","image":"http://img.bbystatic.com/BestBuy_US/images/products/1852/185230_sa.jpg"},


  client.hset("SKUs", "sku-43900",  '{"sku":"sku-43900","name":"Duracell - AAA Batteries (4-Pack)","type":"HardGood","price":5.49,"upc":"041333424019","category":[{"id":"pcmcat312300050015","name":"Connected Home & Housewares"},{"id":"pcmcat248700050021","name":"Housewares"},{"id":"pcmcat303600050001","name":"Household Batteries"},{"id":"abcat0208002","name":"Alkaline Batteries"}],"shipping":5.49,"description":"Compatible with select electronic devices; AAA size; DURALOCK Power Preserve technology; 4-pack","manufacturer":"Duracell","model":"MN2400B4Z","url":"http://www.bestbuy.com/site/duracell-aaa-batteries-4-pack/sku-43900.p?id=1051384074145&skuId=sku-43900&cmp=RMXCC","image":"http://img.bbystatic.com/BestBuy_US/images/products/4390/43900_sa.jpg"}');
  client.hset("SKUs", "sku-48530",  '{"sku":"sku-48530","name":"Duracell - AA 1.5V CopperTop Batteries (4-Pack)","type":"HardGood","price":5.49,"upc":"041333415017","category":[{"id":"pcmcat312300050015","name":"Connected Home & Housewares"},{"id":"pcmcat248700050021","name":"Housewares"},{"id":"pcmcat303600050001","name":"Household Batteries"},{"id":"abcat0208002","name":"Alkaline Batteries"}],"shipping":5.49,"description":"Long-lasting energy; DURALOCK Power Preserve technology; for toys, clocks, radios, games, remotes, PDAs and more","manufacturer":"Duracell","model":"MN1500B4Z","url":"http://www.bestbuy.com/site/duracell-aa-1-5v-coppertop-batteries-4-pack/sku-48530.p?id=1099385268988&skuId=sku-48530&cmp=RMXCC","image":"http://img.bbystatic.com/BestBuy_US/images/products/4853/48530_sa.jpg"}');
  client.hset("SKUs", "sku-127687", '{"sku":"sku-127687","name":"Duracell - AA Batteries (8-Pack)","type":"HardGood","price":7.49,"upc":"041333825014","category":[{"id":"pcmcat312300050015","name":"Connected Home & Housewares"},{"id":"pcmcat248700050021","name":"Housewares"},{"id":"pcmcat303600050001","name":"Household Batteries"},{"id":"abcat0208002","name":"Alkaline Batteries"}],"shipping":5.49,"description":"Compatible with select electronic devices; AA size; DURALOCK Power Preserve technology; 8-pack","manufacturer":"Duracell","model":"MN1500B8Z","url":"http://www.bestbuy.com/site/duracell-aa-batteries-8-pack/sku-127687.p?id=1051384045676&skuId=sku-127687&cmp=RMXCC","image":"http://img.bbystatic.com/BestBuy_US/images/products/1276/127687_sa.jpg"}');
  client.hset("SKUs", "sku-150115", '{"sku":"sku-150115","name":"Energizer - MAX Batteries AA (4-Pack)","type":"HardGood","price":4.99,"upc":"039800011329","category":[{"id":"pcmcat312300050015","name":"Connected Home & Housewares"},{"id":"pcmcat248700050021","name":"Housewares"},{"id":"pcmcat303600050001","name":"Household Batteries"},{"id":"abcat0208002","name":"Alkaline Batteries"}],"shipping":5.49,"description":"4-pack AA alkaline batteries; battery tester included","manufacturer":"Energizer","model":"E91BP-4","url":"http://www.bestbuy.com/site/energizer-max-batteries-aa-4-pack/sku-150115.p?id=1051384046217&skuId=sku-150115&cmp=RMXCC","image":"http://img.bbystatic.com/BestBuy_US/images/products/1501/150115_sa.jpg"}');
  client.hset("SKUs", "sku-185230", '{"sku":"sku-185230","name":"Duracell - C Batteries (4-Pack)","type":"HardGood","price":8.99,"upc":"041333440019","category":[{"id":"pcmcat312300050015","name":"Connected Home & Housewares"},{"id":"pcmcat248700050021","name":"Housewares"},{"id":"pcmcat303600050001","name":"Household Batteries"},{"id":"abcat0208002","name":"Alkaline Batteries"}],"shipping":5.49,"description":"Compatible with select electronic devices; C size; DURALOCK Power Preserve technology; 4-pack","manufacturer":"Duracell","model":"MN1400R4Z","url":"http://www.bestbuy.com/site/duracell-c-batteries-4-pack/sku-185230.p?id=1051384046486&skuId=sku-185230&cmp=RMXCC","image":"http://img.bbystatic.com/BestBuy_US/images/products/1852/185230_sa.jpg"}');

  client.zadd("du", 0, "sku-43900");
  client.zadd("du", 0, "sku-48530");
  client.zadd("du", 0, "sku-127687");
  client.zadd("du", 0, "sku-185230");

  client.zadd("dur", 0, "sku-43900");
  client.zadd("dur", 0, "sku-48530");
  client.zadd("dur", 0, "sku-127687");
  client.zadd("dur", 0, "sku-185230");

  client.zadd("dura", 0, "sku-43900");
  client.zadd("dura", 0, "sku-48530");
  client.zadd("dura", 0, "sku-127687");
  client.zadd("dura", 0, "sku-185230");

  client.zadd("durac", 4, "sku-43900");
  client.zadd("durac", 4, "sku-48530");
  client.zadd("durac", 4, "sku-127687");
  client.zadd("durac", 4, "sku-185230");

  client.zadd("durace", 0, "sku-43900");
  client.zadd("durace", 0, "sku-48530");
  client.zadd("durace", 0, "sku-127687");
  client.zadd("durace", 0, "sku-185230");

  client.zadd("duracel", 0, "sku-43900");
  client.zadd("duracel", 0, "sku-48530");
  client.zadd("duracel", 0, "sku-127687");
  client.zadd("duracel", 0, "sku-185230");

  client.zadd("duracell", 0, "sku-43900");
  client.zadd("duracell", 0, "sku-48530");
  client.zadd("duracell", 0, "sku-127687");
  client.zadd("duracell", 0, "sku-185230");

  client.zadd("duracell ", 0, "sku-43900");
  client.zadd("duracell ", 0, "sku-48530");
  client.zadd("duracell ", 0, "sku-127687");
  client.zadd("duracell ", 0, "sku-185230");

  client.zadd("duracell -", 0, "sku-43900");
  client.zadd("duracell -", 0, "sku-48530");
  client.zadd("duracell -", 0, "sku-127687");
  client.zadd("duracell -", 6, "sku-185230");

  client.zadd("duracell - ", 0, "sku-43900");
  client.zadd("duracell - ", 0, "sku-48530");
  client.zadd("duracell - ", 0, "sku-127687");
  client.zadd("duracell - ", 0, "sku-185230");

  client.zadd("duracell - a", 4, "sku-43900");
  client.zadd("duracell - a", 4, "sku-48530");
  client.zadd("duracell - a", 4, "sku-127687");

  client.zadd("duracell - c", 6, "sku-185230");

  client.zadd("duracell - aa", 0, "sku-43900");
  client.zadd("duracell - aa", 0, "sku-48530");
  client.zadd("duracell - aa", 0, "sku-127687");

  client.zadd("duracell - c ", 0, "sku-185230");

  client.zadd("duracell - aaa", 0, "sku-43900");

  client.zadd("duracell - aa ", 0, "sku-48530");
  client.zadd("duracell - aa ", 0, "sku-127687");

  client.zadd("duracell - c ", 0, "sku-185230");

  client.zadd("en", 0, "sku-150115");
  client.zadd("ene", 0, "sku-150115");
  client.zadd("ener", 0, "sku-150115");
  client.zadd("energ", 0, "sku-150115");


  client.zadd("bl", 0, "sku-003");
  client.zadd("bl", 0, "sku-004");
  client.zadd("blo", 0, "sku-003");
  client.zadd("bla", 0, "sku-004");
}

function searchProduct(name) {
  return new Promise(function(resolve, reject) {
    if (!cacheReady) {
      reject({result:'ERROR', msg: "CACHE_NOT_READY"});
      return;
    }  

    if (!name) {
      reject({result:'ERROR', msg: "WRONG_ARGUMENTS", details: "No search term found"});
    }
    
    // ZRANGE name START STOP
    // STOP SEARCH_MAX_SIZE or -1 for unlimited
    client.zrange(name.toLowerCase(), 0, SEARCH_MAX_SIZE - 1, function (err, replies) {
      if (err) {
        reject({result:'ERROR', msg: "CACHE_ERROR", details: err});
      } else {
        console.log(replies.length + " replies:");
        replies.forEach(function (reply, i) {
            console.log("    " + i + ": " + reply);
        });
        resolve(replies);
      }
    });
  });
}



function decorateProduct(skus) {
  return new Promise(function(resolve, reject) {
    if (skus.constructor != Array) {
      reject({result:'ERROR', msg: "DATA_ERROR", details: 'Data is not an array of SKUs'});
      return;
    }

    if (skus.length <= 0) {
      resolve([]);
    }

    // HMGET SKUs sku1 sku2 ...
    client.hmget('SKUs', skus, function (err, replies) {
      if (err) {
        reject({result:'ERROR', msg: "CACHE_ERROR", details: err});
      } else {
        console.log(replies.length + " replies:");
        replies.forEach(function (reply, i) {
            console.log("    " + i + ": " + reply);
        });
        resolve(replies.map((element) => { 
          const product = JSON.parse(element);
          return {sku: product.sku, name: product.name};
        }));
      }
    });
  });
}

function route() {
  var router = new express.Router();
  router.use(cors());
  router.use(bodyParser.json());
  router.use(bodyParser.urlencoded({ extended: true }));

  router.get('/products/:name', function(req, res) {
    var name = req.params.name;
    console.log('Fetch products by name ', name);
    if (typeof name === 'undefined' || name == '') {
      res.status(400).json([]);
    }
    
    searchProduct(name)
    .then(function (skus) {
      return decorateProduct(skus);
    })
    .then(function (data) {
      res.status(200).json(data);
    })
    .catch(function (err) {
      res.status(500).json({ok: false, msg: err})
    });
  });

  return router;
}

module.exports = route;
