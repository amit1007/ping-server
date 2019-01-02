var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var channelDetails = require('../models/ChannelName');
var pinglogger= require('../pingLogging.js');

/* GET ALL Channel */
pinglogger.pingloggerSystem.info("------------------=====================----------------------")
pinglogger.pingloggerSystem.info("We are now in Channel Name")
router.get('/', function(req, res, next) {    
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
  pinglogger.pingloggerSystem.info("Get all channel Name ")
  channelDetails.find(function (err, products) {
    if (err) return next(pinglogger.pingloggerSystem.error(err));
    //console.log(products);
    res.json(products);
  });
});

/* GET SINGLE Cahnnel Details BY ID */
router.get('/:id', function(req, res, next) {
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
  pinglogger.pingloggerSystem.info("Get  channels Name by ID ")
  channelDetails.findById("5b5c0e33b0d1d03b8f515b3c", function (err, post) {
    if (err) return next(pinglogger.pingloggerSystem.error(err));
    res.json(post);
  });
});

/* SAVE Channel Details */
router.post('/', function(req, res, next) {
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
  pinglogger.pingloggerSystem.info("Create  channel Name ")
  channelDetails.create(req.body, function (err, post) {
    if (err) return next(pinglogger.pingloggerSystem.error(err));
    res.json(post);
  });
});

/* UPDATE Channel Details */
router.put('/:id', function(req, res, next) {
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
  pinglogger.pingloggerSystem.info("Soft Delete  channel Name ")
  channelDetails.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(pinglogger.pingloggerSystem.error(err));
    res.json(post);
  });
});

/* DELETE Cahnnel Details */
router.delete('/:id', function(req, res, next) {
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
  pinglogger.pingloggerSystem.info("Delete  channel Name ")
  channelDetails.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(pinglogger.pingloggerSystem.error(err));
    res.json(post);
  });
});
/* Get Total channel Details Count*/
router.get('/count', function(req, res, next) {
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
  pinglogger.pingloggerSystem.info("get Count of channel Name ")
  alerts.find(function (err, products) {
  if (err) return next(pinglogger.pingloggerSystem.error(err));
  res.json(products.length);
});
});
module.exports = router;