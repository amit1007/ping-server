var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var qUser = require('../models/LocationDetails');
var moment = require('moment-timezone')
var pinglogger= require('../pingLogging.js');

/* GET ALL User */
// router.get('/', function(req, res, next) {    
//   console.log("Get locations")
//   qUser.find(function (err, products) {
//     if (err) return next(err);
//     res.json(products);
//   });
// });


pinglogger.pingloggerSystem.info("------------------=====================----------------------")
pinglogger.pingloggerSystem.info("We are now in location details ")

router.get('/', function(req, res, next) {    
  console.log("Get locations")
  timeZones = moment.tz.names()
//console.log(timeZones.length)

  offsetTmz = []
  for (i=0;i<timeZones.length;i++)
   { 
    element = {}
    // console.log(timeZones[i])
     element.id = moment.tz(timeZones[i]).format('Z')
     element.name = timeZones[i]

  //   console.log(element)
     offsetTmz.push(element);
   // console.log(offsetTmz)
   }

//console.log(offsetTmz)
  // console.log(offsetTmz)
  // if (err) return next(err);
     res.json(offsetTmz);
  // qUser.find(function (err, products) {
  //   if (err) return next(err);
  //   res.json(products);
  // });

});

// /* GET SINGLE User BY ID */
// router.get('/:id', function(req, res, next) {
//   console.log("Successfully Route Ping User By Id"+req.params.id)
//   qUser.findById("5b5c0e33b0d1d03b8f515b3c", function (err, post) {
//     if (err) return next(err);
//     res.json(post);
//   });
// });

/* SAVE User */
router.post('/', function(req, res, next) {
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
  pinglogger.pingloggerSystem.info("Post location details to create  ")

  qUser.create(req.body, function (err, post) {
    if (err) return next(pinglogger.pingloggerSystem.error(err));
    res.json(post);
  });
});

/* UPDATE User */
// router.put('/:id', function(req, res, next) {
//   qUser.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
//     if (err) return next(err);
//     res.json(post);
//   });
// });

// /* DELETE USer */
// router.delete('/:id', function(req, res, next) {
//   qUser.findByIdAndRemove(req.params.id, req.body, function (err, post) {
//     if (err) return next(err);
//     res.json(post);
//   });
// });
// /* Get Total Count*/
// router.get('/count', function(req, res, next) {
//   alerts.find(function (err, products) {
//   if (err) return next(err);
//   res.json(products.length);
// });
// });
module.exports = router;