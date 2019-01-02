var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var alerts = require('../models/createAlertSchema.js');
var mobileU=require('../models/MobileUser');
var moment = require('moment');
var pinglogger= require('../pingLogging.js');
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
// // var User = require('../../../models/User');
// var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
// var config = require('../src/app/config');


// // var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
// var bcrypt = require('bcryptjs');
// var config = require('../config'); // get config file

pinglogger.pingloggerSystem.info("------------------=====================----------------------")
pinglogger.pingloggerSystem.info("We are now in create Route ")
// moment().locale(;

moment().format('DD/MMM/YYYY');
moment().toLocaleString('en-us', { month: "short" });
/* GET ALL Alert's */
// router.get('/', function(req, res, next) {
//     alerts.find(function (err, products) {
//     if (err) return next(err);
//     res.json(products);
//   });
// });

//Fetch Logged User Id wise Data
router.get('/LoggedUserWiseAlertData/:id', function(req, res, next) {
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
  pinglogger.pingloggerSystem.info("Logged user data in create Route ")
    alerts.find({"UserID":req.params.id ,"IsActive":true},function (err, products) {
      // console.log('logged.products',products)
  if (err) return next(pinglogger.pingloggerSystem.error(err));
  res.json(products);
});
});

//Fetch Logged User Id wise Data
router.get('/', function(req, res, next) {
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
  pinglogger.pingloggerSystem.info("Logged user data in create Route ")
    alerts.find({"IsActive":true},function (err, products) {
      // console.log('logged.products',products)
  if (err) return next(pinglogger.pingloggerSystem.error(err));
  res.json(products);
});
});

/* GET ALL MobileUser's */
router.get('/MobileNotify', function(req, res, next) {
   
        try {
          pinglogger.pingloggerSystem.info("------------------=====================----------------------")
          pinglogger.pingloggerSystem.info("get mobile user in create Route ")
        
       //  console.log("Token Information"+JSON.stringify(req.headers,null,4))
          var EmailId = req.headers['token']; 
           // console.log("UserToken"+EmailId)
          
             mobileU.findOne({ Email : EmailId},function(err,mobileuser){
              try {
                    if(err) return next(pinglogger.pingloggerSystem.error(err));
               // console.log(mobileuser);
                    res.json(mobileuser);
              } catch (error) {
                console.log(error);
              }
            })
        } catch (error) {
          console.log(error);
        }
   });  
 

// });


/* Get Total Count*/
router.get('/count', function(req, res, next) {
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
  pinglogger.pingloggerSystem.info("get count of create Route ")
  alerts.find(function (err, products) {
  if (err) return next(pinglogger.pingloggerSystem.error(err));
  res.json(products.length);
});
});   


/* GET SINGLE Alert's BY ID */
router.get('/:id', function(req, res, next) {
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
  pinglogger.pingloggerSystem.info("alert by id create Route ")
    alerts.findById(req.params.id, function (err, post) {
    if (err) return next(pinglogger.pingloggerSystem.error(err));
    res.json(post);
  });
});

/* SAVE Alert's */
router.post('/', function(req, res, next) {
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
  pinglogger.pingloggerSystem.info("We are now in save alert in create Route ")
    alerts.create(req.body, function (err, post) {
      //console.log(err)
    if (err) 
     return next(pinglogger.pingloggerSystem.error(err));
    res.json(post);
  });
});

/* UPDATE Alert's */
router.put('/:id', function(req, res, next) {
    alerts.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* UPDATE Alert's */
router.put('/trigger/:id', function(req, res, next) {
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
pinglogger.pingloggerSystem.info("We are now in triggered alert in create Route ")
  alerts.update({_id: req.body.id}, {$set: {"trigger":req.body.trigger}}, function(err,post){
    if (err) return next(pinglogger.pingloggerSystem.error(err));
    res.json(post);
  });   
});

/* DELETE Alert's */
// router.delete('/:id', function(req, res, next) {
//   console.log('delete alert.....')
//     alerts.findByIdAndRemove(req.params.id, req.body, function (err, post) {
//     if (err) return next(err);
//     res.json(post);
//   });
// });

router.delete('/:id', function(req, res, next) {
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
  pinglogger.pingloggerSystem.info("We are now in soft delete alert in create Route ")
  // qUser.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    alerts.findByIdAndUpdate({_id: req.params.id}, {$set: {"IsActive":false}} , function (err, post) {
    if (err) return next(pinglogger.pingloggerSystem.error(err));
    res.json(post);
  });
});


//email template --> query string

router.get('/unsubscribe/:paramA/:paramB', function(req, res, next) {
  console.log("route successfully....");
  console.log(req.params.paramA);
  console.log(req.params.paramB);
 
    alerts.update({frmCntAlertID: req.params.paramA}, {$set: {"trigger":req.params.paramB}}, function(err,post){
      if (err) return next(pinglogger.pingloggerSystem.error(err));
      res.json({save:"You have successfully unsubscribed"});
    });   
});

/* GET ALL User */
// router.get('/', function(req, res, next) {    
//   console.log("GET User IsActive");
//   alerts.find({"IsActive": true},function (err, products) {
//     if (err) return next(err);
//     console.log(products);
//     res.json(products);
//   });
// });


//From Vishal 

// This is for Pingbot Purpose
// get alert by alert id
router.get('/getdatabyalertid/:id', function(req, res, next){
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
  pinglogger.pingloggerSystem.info("alert by id create Route ")
    alerts.find({frmCntAlertID : req.params.id,  IsActive: true}, function (err, post) {
    if (err) return next(pinglogger.pingloggerSystem.error(err));
    res.json(post);
  });
})

//  modify Alert by alert id
router.put('/getdatabyalertid/:id', function(req, res, next) {
  console.log(req.body)
  edit_data = { 
                "frmCntAlertName": req.body.frmCntAlertName,
                "frmCntDelivertTo": req.body.frmCntDelivertTo,
                "frmCntRecipient":req.body.frmCntRecipient,
                "frmCntDataSource": req.body.frmCntDataSource,
                "frmCntApplication":
                { "Appid": req.body.frmCntApplication.Appid,
                  "AppName":  req.body.frmCntApplication.AppName },
                "frmCntMeasures":
                { "Appid": req.body.frmCntMeasures.Appid,
                  "pingMeasuresqLabel":  req.body.frmCntMeasures.pingMeasuresqLabel,
                  "pingMeasuresqDef": req.body.frmCntMeasures.pingMeasuresqDef},
                "frmCntCurrentValue": req.body.frmCntCurrentValue,
                "frmCntCondition": req.body.frmCntCondition,
                "frmCntFunction": req.body.frmCntFunction,
                "frmCntNumberformat": req.body.frmCntNumberformat,
                "diamentionValue": req.body.diamentionValue,
                "filterValue": req.body.filterValue,
                "frmCntFieldValue": { "Field": req.body.frmCntFieldValue.Field, "Value": req.body.frmCntFieldValue.Value },
                "frmCntTrigger": req.body.frmCntTrigger,
                "UserID": req.body.UserID,
                "frmGrpShedules": req.body.frmGrpShedules
              }
  // console.log("Edit data", edit_data)
  alerts.update({frmCntAlertID :req.params.id}, {$set:edit_data}, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

// login wise noactive data
router.get('/LoggedUserWiseAlertData/Notactive/:id', function(req, res, next) {
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
  pinglogger.pingloggerSystem.info("Logged user data in create Route ")
    alerts.find({"UserID":req.params.id ,"IsActive":false},function (err, products) {
      // console.log('logged.products',products)
  if (err) return next(pinglogger.pingloggerSystem.error(err));
  res.json(products);
});
});
// End for Pingbot Purpose

module.exports = router;