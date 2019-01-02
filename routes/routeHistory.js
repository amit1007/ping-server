var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var alerts = require('../models/historyAlert.js');
var pinglogger= require('../pingLogging.js');
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
// var User = require('../../../models/User');
// var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
// var config = require('../src/app/config');

pinglogger.pingloggerSystem.info("------------------=====================----------------------")
pinglogger.pingloggerSystem.info("We are now in history route ")

/* GET ALL Alert's */
router.get('/', function(req, res, next) {

  var UserToken = req.headers['token'];
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
  pinglogger.pingloggerSystem.info("We are now in get alert history in route " + UserToken);
  jwt.verify(UserToken, config.secret, function(err, decoded) {   
    try {
     // console.log('decoded token done it in Alert History',JSON.stringify(decoded,null,4))   
     // console.log("User User Id",decoded.User.PingUserID) 
      if (err) 
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });    
   
       if (err) return res.status(500).send("There was a problem finding the user.");
       alerts.find({"LogginUserID":decoded.User.PingUserID},function (err, products) {
        if (err) return next(pinglogger.pingloggerSystem.error(err));
        res.json(products);
      });
    } catch (error) {
      console.log(error);
    }
   
    //  mobileU.findOne({"Email":decoded.User.EmailID.toLowerCase()},function(err,mobileuser){
    //   if (err) return next(pinglogger.pingloggerSystem.error(err));
    //   console.log("Data From Database ID WIse",mobileuser)
    //     res.json(mobileuser);
    // })   
        
   }); 
});

/* GET ALL Alert's */
router.get('/LoggedUserWiseAlertHistoryData/:id', function(req, res, next) {
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
  pinglogger.pingloggerSystem.info("Logged user data in create Route ")
    alerts.find({"LogginUserID":req.params.id},function (err, products) {
      // console.log('logged.products',products)
  if (err) return next(pinglogger.pingloggerSystem.error(err));
  res.json(products);
});
});

/* Get Alert by alertID */
router.get('/graph', function(req, res, next) {
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
  pinglogger.pingloggerSystem.info("We are now in get alert history graph in route ")
    alerts.find({"alertID": req.headers['p-graph-alertid']},function (err, Record) {
    if (err) return next(pinglogger.pingloggerSystem.error(err));
    res.json(Record);
  });
});

router.get('/:id', function(req, res, next) {
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
  pinglogger.pingloggerSystem.info("We are now in find  alert history by id in route ")
  alerts.findById(req.params.id, function (err, post) {
  if (err) return next(pinglogger.pingloggerSystem.error(err));
  res.json(post);
});
});
module.exports = router;