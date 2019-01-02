var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var deliveryChannel = require('../models/DeliveryCahnnel');
var pinglogger= require('../pingLogging.js');

/* GET ALL User */
pinglogger.pingloggerSystem.info("------------------=====================----------------------")
pinglogger.pingloggerSystem.info("We are now in Delivery Channel")
router.get('/', function(req, res, next) {    
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
  pinglogger.pingloggerSystem.info("Call to Get All Delivery Channels")
  deliveryChannel.find({"IsActive": true},function (err, products) {
    if (err) return next(pinglogger.pingloggerSystem.error(err));
    // console.log(products);
    res.json(products);
  });
});


/* GET ALL Mobile App User Data */
router.get('/GetMobileAppDetails', function(req, res, next) {    
  console.log("Get All MobileApp  Details");
  deliveryChannel.find({"DeliveryChannelType": 'Mobile App'},function (err, products) {
    if (err) return next(err);
    // console.log(products);
    res.json(products);
  });
});


/* GET SINGLE User BY ID */
router.get('/:id', function(req, res, next) {
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
  pinglogger.pingloggerSystem.info("Call to Get  Delivery Channel by ID") 
  deliveryChannel.findById(req.params.id, function (err, post) {
    if (err) return next(pinglogger.pingloggerSystem.error(err));
    res.json(post);
  });
});

/* SAVE User */
router.post('/', function(req, res, next) {
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
  pinglogger.pingloggerSystem.info("Call to Save  Delivery Channel")
  deliveryChannel.create(req.body, function (err, post) {
    if (err) return next(pinglogger.pingloggerSystem.error(err));
    res.json(post);
  });
});

/* UPDATE User */
router.put('/:id', function(req, res, next) {
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
  pinglogger.pingloggerSystem.info("Call to Update  Delivery Channel")
  deliveryChannel.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(pinglogger.pingloggerSystem.error(err));
    res.json(post);
  });
});

/* DELETE USer */
router.delete('/:id', function(req, res, next) {
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
  pinglogger.pingloggerSystem.info("Call to delete  Delivery Channel")
  // deliveryChannel.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    deliveryChannel.findByIdAndUpdate({_id: req.params.id}, {$set: {"IsActive":false}} , function (err, post) {
    if (err) return next(pinglogger.pingloggerSystem.error(err));
    res.json(post);
  });
});


/* Get Total Count*/
router.get('/countChannel', function(req, res, next) {
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
  pinglogger.pingloggerSystem.info("Call to get of count Delivery Channel")
  deliveryChannel.find(function (err, products1) {
    if (err) {
      // console.log(err);
      return next(pinglogger.pingloggerSystem.error(err));
    }     
    res.json(products1.length);
  });
});


/* GET MobileApp Details */
router.get('/MobileAppDetails', function(req, res, next) {    
  console.log("GET Mobile Details");
  deliveryChannel.find({"DeliveryChannelType": "Mobile App"},function (err, products) {
    if (err) return next(err);
    // console.log(products);
    res.json(products);
  });
});

/* GET EmailApp Details */
router.get('/EmailAppDetails', function(req, res, next) {    
  console.log("GET Email Details");
  deliveryChannel.find({"DeliveryChannelType": "Email"},function (err, products) {
    if (err) return next(err);
    // console.log(products);
    res.json(products);
  });
});


module.exports = router;