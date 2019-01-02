//For Created Alert 
var nodemailer = require('nodemailer'); 
var express = require('express');
var router = express.Router();
var FCM = require('fcm-node');
var EmailTemplate = require('email-templates').EmailTemplate;
var Mob_Notify =require('./mobileNotification');
var pinglogger= require('../pingLogging.js');

pinglogger.pingloggerSystem.info("------------------=====================----------------------")
pinglogger.pingloggerSystem.info("We are now in test mail id route ")
 
router.post('/', function(req, res, next) {  
        var data =JSON.stringify(req.body,null,4);
        var usrmail = 'roxai@teachertrain.org';
        var datetime = new Date();
        // console.log(datetime);
        // var condition = req.body.frmCntCondition=="equalto"?"Equal To":req.body.frmCntCondition=="lessthan"?"Less Than":req.body.frmCntCondition=="greaterthan"?"Greater Than":req.body.frmCntCondition=="lessthanorequalto"?"Less Than or Equal To":req.body.frmCntCondition=="greaterthanorequalto"?"Greater Than or Equal To":"NaN";

        // var mess ={
        //     alertid: req.body.frmCntAlertID,
        //     alertname : req.body.frmCntAlertName,
        //     AppicationName : req.body.frmCntApplication.AppName,
        //     Measures : req.body.frmCntMeasures.pingMeasuresqLabel,
        //     CurrentValue :(req.body.filterValue!=null||'')?req.body.filterValue:req.body.frmCntCurrentValue,
        //     token:req.body.frmCntMobileUser.token,
        //     threshold:condition +' '+ req.body.frmCntFunction,
        //     setTime : datetime,
        //     mobileStatus : 1
        // }
              var mailUser = usrmail.split('@');
              var x;
              for(i=0;i<=mailUser.length;i++){
                  
                  x=mailUser[0];
              }
         //while user authentication is complete then put login user Name 
            // var messbody = "Hi  "  +x+ "<br/> &nbsp;  &nbsp; You have Successfully created an alert <b>" +mess.alertname+ "</b> And following is your current data look like <br/> <br/><hr/> AppicationName : <b>"+mess.AppicationName+ "</b> <br/>"  +
            //                 "Measures : <b>" +mess.Measures+ "</b> <br/> Current Value : <b> " +mess.CurrentValue+ "</b> <br/>" +
            //                 "AlertSetTime : <b>" +mess.setTime+ "</b> <hr/>" +
            //                 "We will be back with the alert change in a while once we get the alert information.";

            // Changed formate
            var messbody = "Hi  "  +x+ ",<br/>Mail Server Testing  ";
            
                  
          
            
 
        var nodemailer = require('nodemailer'); 


        var transporter = nodemailer.createTransport({
         host: 'au.syrahost.com',
         port: 587,
         secure: false,
       service: 'gmail',
        auth: {
            user: 'roxai@teachertrain.org',
            pass: 'Qliksense!'
        }
        });

        var mailOptions = {
            from: 'roxai@teachertrain.org',
            to:  'manoj.shinde@roxai.com',
            subject: 'Mail Server Testing By Roxai',
            html: messbody
        };

        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            pinglogger.pingloggerSystem.error(error);
        } else {
            pinglogger.pingloggerSystem.info('Email sent: ' + info.response);
        }
        }); 
        
        //Mobile Notification
        Mob_Notify(mess,function(res){
    
            pinglogger.pingloggerSystem.info("Mobile Create Alert Notification...");
            pinglogger.pingloggerSystem.info(res);
     
        })
});


router.post('/ValidateID', function(req, res, next) {  
    console.log("In Validate Mail ID Function"+JSON.stringify(req.body,null,4));
    var data =JSON.stringify(req.body,null,4);
    var usrmail = req.body.EmailUserName;
    var datetime = new Date();
    // console.log(datetime);
    var condition = req.body.frmCntCondition=="equalto"?"Equal To":req.body.frmCntCondition=="lessthan"?"Less Than":req.body.frmCntCondition=="greaterthan"?"Greater Than":req.body.frmCntCondition=="lessthanorequalto"?"Less Than or Equal To":req.body.frmCntCondition=="greaterthanorequalto"?"Greater Than or Equal To":"NaN";

    var mess ={
        Password : req.body.Password,
        emailID : req.body.EmailUserName,
       
    }
          var mailUser = usrmail.split('@');
          var x;
          for(i=0;i<=mailUser.length;i++){
              
              x=mailUser[0];
          }
     //while user authentication is complete then put login user Name 
        // var messbody = "Hi  "  +x+ "<br/> &nbsp;  &nbsp; You have Successfully created an alert <b>" +mess.alertname+ "</b> And following is your current data look like <br/> <br/><hr/> AppicationName : <b>"+mess.AppicationName+ "</b> <br/>"  +
        //                 "Measures : <b>" +mess.Measures+ "</b> <br/> Current Value : <b> " +mess.CurrentValue+ "</b> <br/>" +
        //                 "AlertSetTime : <b>" +mess.setTime+ "</b> <hr/>" +
        //                 "We will be back with the alert change in a while once we get the alert information.";

        // Changed formate
        var messbody = "Hi  "  +x+ ",<br/> Great Job! You have successfully created an alert called <b>" +mess.alertname+ "</b>, here is the summary of your alert: <br/> <br/> <b> AppicationName : </b>"+mess.AppicationName+ "   <br/>"  +
                            "";
        
              
      
        

    var nodemailer = require('nodemailer'); 


    var transporter = nodemailer.createTransport({
    host: 'mail.teachertrain.org',
    port: 143,
    secure: false, // true for 465, false for other ports
    service: 'gmail',
    auth: {
        user: 'ping.admin@roxai.com',
        pass: 'Roxai@123'
    }
    });

    var mailOptions = {
        from: 'ping.admin@roxai.com',
        to:  'roxai@teachertrain.org',
        subject: 'Alert Created Successfully..',
        html: messbody
    };

    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        pinglogger.pingloggerSystem.error(error);
    } else {
        pinglogger.pingloggerSystem.info('Email sent: ' + info.response);
    }
    }); 
    
    //Mobile Notification
    Mob_Notify(mess,function(res){

        pinglogger.pingloggerSystem.info("Mobile Create Alert Notification...");
        pinglogger.pingloggerSystem.info(res);
 
    })
});


module.exports = router;