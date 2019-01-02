var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var pinglogger= require('../../pingLogging.js');
var dateLocker =require('./RenewLicense');

/* GET ALL Channel */
// pinglogger.pingloggerSystem.info("------------------=====================----------------------")
// pinglogger.pingloggerSystem.info("We are now date Checker Route")
// router.get('/', function(req, res) {    
//   pinglogger.pingloggerSystem.info("------------------=====================----------------------")
//   pinglogger.pingloggerSystem.info("Get check Data")
//   console.log("In Date Locker Backend");
//   dateLocker.DateChecker("",function(DateLockerResult){
//       res.send(DateLockerResult);
//   })
// });

router.get('/RenewLicense', function(req, res) {    
    pinglogger.pingloggerSystem.info("------------------=====================----------------------")
    pinglogger.pingloggerSystem.info("Renew License")
    console.log("In Renew License Router  ");
    dateLocker.CreateRegisterKey("",function(DateLockerResult){
        res.send(DateLockerResult);
    })
  });

module.exports=router;