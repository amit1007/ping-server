var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var channelTypes = require('../models/ChannelTypeDetail');
var pinglogger= require('../pingLogging.js');

/* GET ALL channel type  */
pinglogger.pingloggerSystem.info("------------------=====================----------------------")
pinglogger.pingloggerSystem.info("We are now in Channel Type Details")
router.get('/', function(req, res, next) {    
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
  pinglogger.pingloggerSystem.info("get Channel Type Details")
  channelTypes.find(function (err, products) {
    if (err) return next(pinglogger.pingloggerSystem.error(err));
   // console.log("Channel TYpe"+products);
    res.json(products);
  });
});

/* GET SINGLE Channel type BY ID */
router.get('/:id', function(req, res, next) {
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
  pinglogger.pingloggerSystem.info("get Channel Type Details by Id ")
  channelTypes.findById(req.params.id, function (err, post) {
    if (err) return next(pinglogger.pingloggerSystem.error(err));
    res.json(post);
  });
});

/* SAVE Channel TYpe */
router.post('/', function(req, res, next) {
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
  pinglogger.pingloggerSystem.info("Create Channel Type Details")
  channelTypes.create(req.body, function (err, post) {
    if (err) return next(pinglogger.pingloggerSystem.error(err));
    res.json(post);
  });
});

/* UPDATE channel TYpe */
router.put('/:id', function(req, res, next) {
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
  pinglogger.pingloggerSystem.info("Find and Update Channel Type Details")
  channelTypes.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(pinglogger.pingloggerSystem.error(err));
    res.json(post);
  });
});

/* DELETE Channel */
router.delete('/:id', function(req, res, next) {
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
  pinglogger.pingloggerSystem.info("Remove Channel Type Details")
  channelTypes.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(pinglogger.pingloggerSystem.error(err));
    res.json(post);
  });
});
/* Get Total channel Type Count*/
router.get('/count', function(req, res, next) {
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
  pinglogger.pingloggerSystem.info("Get count of Channel Type Details")
  alerts.find(function (err, products) {
  if (err) return next(pinglogger.pingloggerSystem.error(err));
  res.json(products.length);
});
});
module.exports = router;