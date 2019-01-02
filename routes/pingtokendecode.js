var qsocks = require('qsocks');
var fs = require('fs');
var request = require('request');
var Promise = require("promise");
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

// var VerifyToken = require('../VerifyToken');
var User = require('../models/User');
var pinglogger= require('../pingLogging.js');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
// // var User = require('../../../models/User');
// var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
// var config = require('../src/app/config.js');

var pinglogger= require('../pingLogging.js');

pinglogger.pingloggerSystem.info("------------------=====================----------------------")
pinglogger.pingloggerSystem.info("We are now in Triggered Alerts --->HyperCube")
// var js2xmlparser = require('js2xmlparser');

// var appList = require('./lib/app-list');
// var connList = require('./lib/app-connections');
// var appTables = require('./lib/app-tables');
// var libDimensions = require('./lib/app-library-dimensions');
// var libMeasures = require('./lib/app-library-measures');
// var libObjects = require('./lib/app-library-masterobjects');
// var appBookmarks = require('./lib/app-bookmarks');
// var appSheets = require('./lib/app-sheets');
// var appStories = require('./lib/app-stories');

var cmd_args = process.argv;
var using_defaults = true;
var server_address = 'ec2-18-207-196-75.compute-1.amazonaws.com';
var server_certificate = __dirname + '\/client.pfx';
var user_directory = 'QLIK-SENSE';
var user_name = 'testuser1';
var origin = 'QLIK-SENSE';
var single_app = false;
var single_app_id = '';
var data ={};


var TokenInfo = function (LoggedToken,callback){
    try {
        pinglogger.pingloggerSystem.info("Token Info Callback");
        // console.log('****** In User Token callback Info *********',LoggedToken);
        // console.log('****** User Fetch Data *********',JSON.stringify(res));
        var token = LoggedToken;
        // console.log('#####Ping Comman',LoggedToken) 
            jwt.verify(token, config.secret, function(err, decoded) {   
            //   console.log('decoded token done it')   
              if (err) 
                return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });    
           
               if (err) return res.status(500).send("There was a problem finding the user.");
             //  res.userId=decoded.id;
             //req.userId = decoded.id;
            
             //res.send(decoded.id)
            // console.log(decoded.PingGroupID);
            // console.log(decoded.id);
            // console.log("DEcoded Information ping"+JSON.stringify(decoded,null,4))
                let result = { UserID: decoded.id,LoggedUser:decoded.User }
            // res.status(200).send({ UserID: decoded.id,LoggedUser:decoded.User });
             return callback(result);
            // res.status(200).send({User});
        });          
                
    } catch (error) {
        console.log(error);
    }
       
            
  }//matrix
module.exports=TokenInfo;