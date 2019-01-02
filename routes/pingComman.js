var express = require('express');
var router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
var LocalStrategy   = require('passport-local').Strategy;
var app = require('../app');
const { isLoggedIn } = require('../config/auth');
var nodemailer = require('nodemailer'); 
var channelDetails = require('../models/DeliveryCahnnel');


//module import
// const User = require('../models/User');


router.get('/getVerify',isLoggedIn,function(req,res){
  try {
    console.log(req.session["passport"]["user"]) ;
    res.send(req.session["passport"]["user"]);
  } catch (error) {
    res.send(403,error);
  }
});

var CreatedSendMail = function (UserData,callback){
  try {
    pinglogger.pingloggerSystem.info("------------------=====================----------------------")
    pinglogger.pingloggerSystem.info("We are now in ValidateID  user id  route ")
    pinglogger.pingloggerSystem.info("In Validate Mail ID Function"+JSON.stringify(req.body,null,4));
    var data =JSON.stringify(req.body,null,4);
    var usrmail = UserData.EmailID;
    var datetime = new Date();
    pinglogger.pingloggerSystem.info(datetime);
    var UserEmail;
    if(usrmail!="" || usrmail !=null)
    {
            //var condition = req.body.frmCntCondition=="equalto"?"Equal To":req.body.frmCntCondition=="lessthan"?"Less Than":req.body.frmCntCondition=="greaterthan"?"Greater Than":req.body.frmCntCondition=="lessthanorequalto"?"Less Than or Equal To":req.body.frmCntCondition=="greaterthanorequalto"?"Greater Than or Equal To":"NaN";
            channelDetails.find({"IsActive": true},function (err, products) {
              pinglogger.pingloggerSystem.info("------------------=====================----------------------")
              pinglogger.pingloggerSystem.info("We are now in get active user route ")
              if (err) return next(pinglogger.pingloggerSystem.error(err));
              // console.log(products);
              res.json(products);
              UserEmail=products[0].EmailUserName;
              UserPassword=products[0].Password;
              pinglogger.pingloggerSystem.info(UserEmail)
              pinglogger.pingloggerSystem.info("User Email Credentials"+UserEmail)
              var mess ={
                  Password : UserPassword,
                  emailID : UserEmail,
                
              }
                var mailUser = usrmail.split('@');
                var x;
                for(i=0;i<=mailUser.length;i++){
                    
                    x=mailUser[0];
                }
                var messbody = "Hi&nbsp;"  +x+ ",<br/> Ping Credentials,<br>This is a system generated e-mail and please do not reply."  +
                                  "<br><br>Regards, <br>Ping Team"+"User Name :"+UserData.PingUserName+" Password :";
              
                    
            
              

                 



                  var transporter = nodemailer.createTransport({
                      service: 'gmail',
                      auth: {
                          user: 'ping.admin@roxai.com',
                          pass: 'Roxai@123'

                          // user: 'roxai@teachertrain.org',
                          // pass: 'Qliksense!'
                      }
                      });
                  var mailOptions = {
                      from: 'ping.admin@roxai.com',
                      to:  'manoj.shinde@roxai.com',
                      subject: 'DONOTREPLY',
                      html: messbody
                  };

                  transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                      pinglogger.pingloggerSystem.error(error);
                  } else {
                      console.log("ValidateID Mail send...");
                      pinglogger.pingloggerSystem.info('Email sent: ' + info.response);
                  }
                  });  
 
            });
            }
            else
            {
              return callback("false")
            }  
  } catch (error) {
      console.log(error);
  }
     
          
}//matrix
module.exports=CreatedSendMail;

module.exports = router ;