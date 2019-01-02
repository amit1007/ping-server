var express = require('express');
var nodemailer = require('nodemailer'); 
var router = express.Router();
var FCM = require('fcm-node');
var EmailTemplate = require('email-templates').EmailTemplate;
var Mob_Notify =require('../mobileNotification');
var pinglogger= require('../../pingLogging.js');
var hogan = require('hogan.js');
var fs = require('fs');
var path = require('path');
pinglogger.pingloggerSystem.info("------------------=====================----------------------")
pinglogger.pingloggerSystem.info("We are now in Triggered Alerts --->Scheduled Alerts mail")

module.exports ={  

    mail : function(alertby,mess){
        try {
            console.log("sending Mail......");
         var template ;
         var subject ="";
        var usrmail = mess.userMail;
        var mailUser = usrmail.split('@');
        var x;
        for(i=0;i<=mailUser.length;i++){            
            x=mailUser[0];
        }
        if(alertby == "measures" || alertby == "filter" ){
             //send trigged mail for measures and filter..
            var messFilterBody ={
                alertid:mess.alertID,
                alertname : mess.alertname,
                AppicationName : mess.AppicationName,
                Measures : mess.Measures,
                PreviousValue:mess.PreviousValue,
                CurrentValue :mess.CurrentValue.measuresValue,
                threshold:mess.threshold,
                triggerTime : mess.triggerTime,
                filtersetField:mess.filtersetField || '',
                mobileStatus :mess.mobileStatus ,
                diamentionStatus: mess.diamentionStatus,
                qliksenseurl:mess.qliksenseurl,
                UserName:x,
                token:mess.token
            }
            if(alertby == "measures"){               
                subject = " PING : "+messFilterBody.Measures+" is  "+messFilterBody.threshold+ " !";
                    template = fs.readFileSync(__dirname+'/HtmlEmailsheduled/MeasureValue.hjs','utf-8');                              
            }
            else{
                subject = " PING : "+messFilterBody.Measures+" is  "+messFilterBody.threshold+ " !";
                 template = fs.readFileSync(__dirname+'/HtmlEmailsheduled/Filter.hjs','utf-8');
            }
           
        }
        else{
                //send trigged mail for Dimension
                var messFilterBody ={
                    alertid:mess.alertID,
                    alertname : mess.alertname,
                    AppicationName : mess.AppicationName,
                    Measures : mess.Measures,
                    PreviousValue:mess.PreviousValue,
                    CurrentValue :mess.CurrentValue,
                    threshold:mess.threshold,
                    triggerTime : mess.triggerTime,
                    filtersetField:mess.filtersetField || '',
                    mobileStatus :mess.mobileStatus ,
                    diamentionStatus: mess.diamentionStatus,
                    qliksenseurl:mess.qliksenseurl,
                    UserName:x,
                    token:mess.token
                }
                subject = " PING : "+messFilterBody.CurrentValue.length+" \t "+messFilterBody.qliksenseurl.diamention+" labels with "+messFilterBody.Measures+" \t "+messFilterBody.threshold+" !";
                template = fs.readFileSync(__dirname+'/HtmlEmailsheduled/DimenstionValue.hjs','utf-8');
            
        }
        var template1 = hogan.compile(template); 

        var nodemailer = require('nodemailer'); 
    
    
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'ping.admin@roxai.com',
                pass: 'Roxai@123'
            }
        });
    
            var mailOptions = {
                from: 'ping.admin@roxai.com',
                to:  usrmail,
                subject: subject,
                html: template1.render(messFilterBody)
            };
    
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                    pinglogger.pingloggerSystem.error(error);
                } else {
                    console.log(info.response);
                    pinglogger.pingloggerSystem.info('Email sent: ' + info.response);
                }
            }); 
            
        } catch (error) {
            console.log(error);
        }
        

    
    },
    LoopNotify: function(MsgForTrigger,mess){
        var usrmail = mess.userMail;

        var datetime = new Date();
        // console.log(datetime);

       
       
        var mailUser = usrmail.split('@');
              var x;
              for(i=0;i<=mailUser.length;i++){
                  
                  x=mailUser[0];
              }
         //while user authentication is complete then put login user Name 
       
         if(MsgForTrigger ==="trigger"){
                var messbody = "Hi  "  +x+ ",<br/> &nbsp;  &nbsp; Your alert \t" +mess.alertname+" has been triggered, please see below for the details.<hr/> AppicationName : <b>"+mess.AppicationName+ "</b> <br/>"  +
                "<br/> Measures : <b>" +mess.Measures+ "</b> <br/><br/> Previous of LoopDiamention Value : <b> " +mess.PreviousValue +" </b> <br/>" +
                "</b> <br/> Current Value : <b> " +mess.CurrentValue+" </b>  <br/>" +
                "<br/> TriggeredTime : <b>" +datetime+ "</b> <hr/>" 
                
           }
           else{
                var messbody = "Hi  "  +x+ ",<br/> &nbsp;  &nbsp; Your alert \t" +mess.alertname+" has been triggered, please see below for the details. <hr/> AppicationName : <b>"+mess.AppicationName+ "</b> <br/>"  +
                "<br/> Measures : <b>" +mess.Measures+ "</b> <br/><br/> Previous of LoopDiamention Value : <b> " +mess.PreviousValue+ "</b> <br/>" +
                 "</b> <br/> Current of LoopDiamention Value : <b> " +mess.CurrentValue.measuresValue+ "</b> <br/>" +
                "<br/> TriggeredTime : <b>" +datetime+ "</b> <hr/>" 
                
           }
    
                  
          
            
 
        var nodemailer = require('nodemailer'); 


        var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ping.admin@roxai.com',
            pass: 'Roxai@123'
        }
        });

        var mailOptions = {
            from: 'ping.admin@roxai.com',
            to:  usrmail,
            subject: 'Alert Triggered Status..',
            html: messbody
        };

        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            pinglogger.pingloggerSystem.error(error);
        } else {
            pinglogger.pingloggerSystem.info('Email sent: ' + info.response);
        }
        }); 

    },
    mobNotify : function(mess){
                pinglogger.pingloggerSystem.info("MobileNotify");
         
                Mob_Notify(mess,function(res){
            
                    pinglogger.pingloggerSystem.info("Mobile Create Alert Notification...");
                    pinglogger.pingloggerSystem.info(res);
        
            })
           
    }
    
}