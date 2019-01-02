var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var pinglogger= require('../pingLogging.js');
const fs = require('fs');
var path = require('path');
var jsonFile=path.join(__dirname, '../','pingConfig.json');
// var nodemailer = require('nodemailer');
var req_connection = require('../RoxAIQlikSenseAPI/QlikTicketGenration')
var DataSourceEdit = require('../models/DataSourceEdit');


pinglogger.pingloggerSystem.info("------------------=====================----------------------")
pinglogger.pingloggerSystem.info("We are now in Data Source ")

router.post('/', function(req, res, next) {
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
  pinglogger.pingloggerSystem.info("Test Data Source");  
 
  // let getSession = req.session["passport"]["user"];
  // console.log("getSession");  console.log(getSession);
   
  req_connection.Qlikgen(req.body,req.body.connect,function(connection){
      console.log("connection");
       console.log(connection);
       if(connection.status === 200){
              DataSourceEdit.countDocuments(function (err, count) {
                if (!err && count === 0) {
                  console.log("Insert");
                  DataSourceEdit.InsertData(req.body,function(err, sample){
                      if(err){throw err;}
                      console.log(sample);
              
                      fs.exists(jsonFile, function(exists){
                          if(exists){
                            fs.readFile(jsonFile, function readFileCallback(err, data){
                                  if(err){

                                  }
                                  else{
                                       obj = JSON.parse(data); 
                                       obj.hostName = req.body.hostname;
                                       var json = JSON.stringify(obj); 
                                       fs.writeFile(jsonFile, json,function writeFileCallback(err,d1){

                                       });
                                  }
                            })
                          }
                      });
                     
                  });
                }
                else{
                  console.log("Update");
                  DataSourceEdit.findOneAndUpdate({dataSourceId:"01"},req.body,function(err,editDataSource){
                    if(err){
                      console.log(err);
                    }
                    else{
                      console.log(editDataSource)
                                fs.exists(jsonFile, function(exists){
                                  if(exists){
                                    fs.readFile(jsonFile, function readFileCallback(err, data){
                                          if(err){

                                          }
                                          else{
                                              obj = JSON.parse(data); 
                                              obj.hostName = req.body.hostname;
                                              var json = JSON.stringify(obj); 
                                              fs.writeFile(jsonFile, json,function writeFileCallback(err,d1){

                                              });
                                          }
                                    })
                                  }
                              });
                   
                
                    }
                  });
                  
                }
            });
       res.send(connection);
       }
       else{
        res.send(connection);
       }
     

      
        
  })
 
 
  

});





// router.get('/', function(req, res, next) {

//   DataSourceEdit.find(function (err, products) {
//     console.log('This is old findDATA API')
//     if (err) return next(err);
//     res.json(products);
//   });
// });



/* GET SINGLE BOOK BY ID */
router.get('/:id', function(req, res, next) {
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
  pinglogger.pingloggerSystem.info("get data source by id")
  DataSourceEdit.findById(req.params.id, function (err, post) {
    if (err) return next(pinglogger.pingloggerSystem.error(err));
    res.json(post);
  });
});


router.get('/:id', function(req, res, next) {
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
  pinglogger.pingloggerSystem.info("find  Data Source id ")
  DataSourceEdit.findById(req.params.id, function (err, post) {
    if (err) return next(pinglogger.pingloggerSystem.error(err));
    res.json(post);
  });
});

// /* DELETE USer */
// router.delete('/:id', function(req, res, next) {
//   console.log('This is Delete Users old findByIdAndRemove')
//   DataSourceEdit.findByIdAndRemove(req.params.id, req.body, function (err, post) {
//     if (err) return next(err);
//     res.json(post);
//   });
// });

router.put('/:id', function(req, res, next) {
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
  pinglogger.pingloggerSystem.info("Edit Data Source ")
  DataSourceEdit.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(pinglogger.pingloggerSystem.error(err));
    res.json(post);
  });
});




// /* Get Total Count*/
// router.get('/count', function(req, res, next) {
//   console.log('Get Toatal Count..')
//   DataSourceEdit.find(function (err, products) {
//   if (err) return next(err);
//   res.json(products.length);
// });
// });

/* DELETE USer */
router.delete('/:id', function(req, res, next) {
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
  pinglogger.pingloggerSystem.info("soft delete Data Source ")
  // qUser.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    DataSourceEdit.findByIdAndUpdate({_id: req.params.id}, {$set: {"IsActive":false}} , function (err, post) {
    if (err) return next(pinglogger.pingloggerSystem.error(err));
    res.json(post);
  });
});

/* GET ALL User */
router.get('/', function(req, res, next) {    
  pinglogger.pingloggerSystem.info("------------------=====================----------------------")
  pinglogger.pingloggerSystem.info("get active Data Source ")
  DataSourceEdit.find({"IsActive": true},function (err, products) {
    if (err) return next(pinglogger.pingloggerSystem.error(err));
    // console.log(products);
    res.json(products);
  });
});

/* Get Total Count*/
// router.get('/countChannel', function(req, res, next) {
//   console.log("Get Total Count");
//   DataSourceEdit.find(function (err, products1) {
//     if (err) {
//       // console.log(err);
//       return next(err);
//     }     
//     res.json(products1.length);
//   });
// });

module.exports = router;
