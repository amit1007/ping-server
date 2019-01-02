//For Created Alert 
var nodemailer = require('nodemailer'); 
var express = require('express');
var router = express.Router();
var FCM = require('fcm-node');
var EmailTemplate = require('email-templates').EmailTemplate;
var Mob_Notify =require('./mobileNotification');
var qUser = require('../models/DeliveryCahnnel');
var pinglogger= require('../pingLogging.js');
var hogan = require('hogan.js');
var fs = require('fs');
var nodemailer = require('nodemailer');
//get url for email send....
const pingConfig=require('../pingConfig.json');
const config = require('../routes/OnReloadAlert/testConfig');

pinglogger.pingloggerSystem.info("------------------=====================----------------------")
pinglogger.pingloggerSystem.info("We are now in send mail route ")

 
router.post('/', function(req, res, next) {  
    console.log(" In Send MAil....");
    var full_address = req.protocol + "://" + req.headers.host ;
    console.log(full_address);
   // console.log(JSON.stringify(req.headers));
    //console.log("****"+JSON.stringify(req.body));
    let qliksense_url = "https://" + config.engine.hostname ; 
    var subject ="";
    var usrmail = req.body.frmCntRecipient;
    var mailUser = usrmail.split('@');
        var x;
        for(i=0;i<=mailUser.length;i++){            
            x=mailUser[0];
        }
    var datetime = new Date();
    pinglogger.pingloggerSystem.info(datetime);
    var UserEmail,UserPassword;
    //console.log("loop body 0",JSON.stringify(req.body));
    qUser.find({"IsActive": true},function (err, products) {
        pinglogger.pingloggerSystem.info("------------------=====================----------------------")
        pinglogger.pingloggerSystem.info("We are now in find active user route ")
        if (err) return next(pinglogger.pingloggerSystem.error(err));
        //console.log(products);
        //res.json(products);
        //console.log("***************"+products)
        UserEmail=products[0].EmailUserName;
        UserPassword=products[0].Password;
        if(products!=null)
        {
        UserEmail=products[0].EmailUserName;
        UserPassword=products[0].Password;
        //console.log("User Email ID"+UserEmail+" User Password = "+UserPassword)
        }
        else
        {
        pinglogger.pingloggerSystem.error("Do not have User Email Server Credentials")
        // UserEmail=products[0].EmailUserName;
        // UserPassword=products[0].Password;
        }
        console.log("User Email ID"+UserEmail+" User Password = "+UserPassword + "to" + usrmail)
        var condition = req.body.frmCntCondition=="equalto"?"Equal To":req.body.frmCntCondition=="lessthan"?"Less Than":req.body.frmCntCondition=="greaterthan"?"Greater Than":req.body.frmCntCondition=="lessthanorequalto"?"Less Than or Equal To":req.body.frmCntCondition=="greaterthanorequalto"?"Greater Than or Equal To":"NaN";
        console.log(req.headers['ping-mail-by']);
        var mailUser = usrmail.split('@');
        var x;
        for(i=0;i<=mailUser.length;i++){
              x=mailUser[0];
        }
        console.log(x);
        
        if(req.headers['ping-mail-by']=="forFilter"){
            console.log("created Mail..");
            var  z="";
            if(Array.isArray(req.body.frmCntFieldValue.selectedFieldValue)){
              
                var selectedFilter = req.body.frmCntFieldValue.selectedFieldValue
               
                let y = selectedFilter.forEach(a=>{
                    try {       
                        z = z + a.Field + "/" ;
                        a.Value.forEach((v,i,a)=>{
                            z =z + v + "/" 
                        })
                    } catch (error) {
                        console.log(error);
                    }
                   
                })
            }
         
            var messBody ={
                alertid: req.body.frmCntAlertID,
                alertname : req.body.frmCntAlertName,
                AppicationName : req.body.frmCntApplication.AppName,
                Measures : req.body.frmCntMeasures.pingMeasuresqLabel,
                CurrentValue :req.body.filterValue,
                token:req.body.frmCntMobileUser,
                threshold:condition +' '+ req.body.frmCntFunction,
                setTime : datetime,
                condition:condition,
                mobileStatus : 1,
                diamentionStatus:0,
                qliksenseurl :{
                    pinghostname:"http://" + pingConfig.serverip + ":4500",
                    hostname : qliksense_url,
                    appid:  req.body.frmCntApplication.Appid,
                    appname:  req.body.frmCntApplication.AppName,
                    selectionUrlString : z
                },
                filtersetField : req.body.frmCntFieldValue.selectedFieldValue,
                UserName:x,
                userMail : req.body.frmCntRecipient
                }
                console.log(messBody);
            var template = fs.readFileSync('./routes/HtmlEmailTemplates/Filter.hjs','utf-8');           
            subject = " PING : Your alert '"+messBody.alertname+"' is created successfully !";
        }
        else if(req.headers['ping-mail-by']==  "forDimension"){

                console.log("MailSendForDimension");
                var triggerSetVal = req.body.frmCntFunction;
                var __conditioncheck = req.body.frmCntCondition=="equalto"?"==":req.body.frmCntCondition=="lessthan"?"<":req.body.frmCntCondition=="greaterthan"?">":req.body.frmCntCondition=="lessthanorequalto"?"<=":req.body.frmCntCondition=="greaterthanorequalto"?">=":"NaN";
               
                var matchElement = req.body.diamentionValue.filter(function(item,index,array){
                    switch(__conditioncheck){
                        case ">"  :
                           return item.qNum  > triggerSetVal ;
                          break;
                        case "<":
                            return item.qNum < triggerSetVal ;
                            break;
                        case ">=":
                            return item.qNum >= triggerSetVal ;
                         break;
                        case "<=":
                            return item.qNum  <= triggerSetVal ;
                          break;
                        case "==":
                            return item.qNum == triggerSetVal ;
                          break;
                    }
                   
                });
           
            var messBody ={
                alertid: req.body.frmCntAlertID,
                alertname : req.body.frmCntAlertName,
                AppicationName : req.body.frmCntApplication.AppName,
                Measures : req.body.frmCntMeasures.pingMeasuresqLabel,
                CurrentValue :req.body.frmCntCurrentValue,
                DimenstionValue:matchElement,
                token:req.body.frmCntMobileUser,
                threshold:condition +' '+ req.body.frmCntFunction,
                setTime : datetime,
                mobileStatus : 1,
                diamentionStatus:1,
                qliksenseurl :{ 
                    pinghostname:"http://" + pingConfig.serverip + ":4500",
                    hostname : qliksense_url,
                    appid: req.body.frmCntApplication.Appid,
                    appname: req.body.frmCntApplication.AppName,
                    diamention:req.body.frmCntLoopDiamention.diamention.pingDiamentionData
                 },
                 UserName:x,
                 userMail : req.body.frmCntRecipient
                }
      
               // console.log("********Message Body"+JSON.stringify(messDimensionBody,null,4))
            var template = fs.readFileSync('./routes/HtmlEmailTemplates/DimenstionValue.hjs','utf-8');
            //var compiledTemplate = hogan.compile(template);
            //var messbody2 =compiledTemplate.render(messDimensionBody);
            subject = " PING : Your alert '"+messBody.alertname+"' is created successfully !";
    
        }
        else if(req.headers['ping-mail-by']==  "forMeasures"){
            console.log("created Mail for Measures...");
            var messBody ={
                alertid: req.body.frmCntAlertID,
                alertname : req.body.frmCntAlertName,
                AppicationName : req.body.frmCntApplication.AppName,
                Measures : req.body.frmCntMeasures.pingMeasuresqLabel,
                CurrentValue : req.body.frmCntCurrentValue,
                token:req.body.frmCntMobileUser,
                threshold:condition +' '+ req.body.frmCntFunction,
                setTime : datetime,
                mobileStatus : 1,
                diamentionStatus:0,
                qliksenseurl :{
                    pinghostname:"http://"+ pingConfig.serverip + ":4500",
                    hostname : qliksense_url,
                    appid:  req.body.frmCntApplication.Appid,
                    appname:  req.body.frmCntApplication.AppName
                },
                UserName:x,
                userMail : req.body.frmCntRecipient
             }
            var template = fs.readFileSync('./routes/HtmlEmailTemplates/MeasureValue.hjs','utf-8');
            subject = " PING : Your alert '"+messBody.alertname+"' is created successfully !";
        }

         
        var template1 = hogan.compile(template); 
             

        var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: UserEmail,
        pass: UserPassword
        }
        });
        var mailOptions = {
            from: UserEmail,
            to: usrmail,
            subject: subject,
            html: template1.render(messBody)
            };
            
            transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            pinglogger.pingloggerSystem.error(error);
            } else {
                console.log("Created mail send successfully...");
                           pinglogger.pingloggerSystem.info('Email sent: ' + info.response);
            }
            }); 
            //Mobile Notification
            Mob_Notify(messBody,function(res){
            pinglogger.pingloggerSystem.info("Mobile Create Alert Notification...");
            pinglogger.pingloggerSystem.info(res);
            })
        res.send({Notification : {email : "Created mail successfully send" , mobile : ""}});
    });   
 
});


router.post('/editAlertMail', function(req, res, next) {  
    console.log(" In Send MAil....");
    var full_address = req.protocol + "://" + req.headers.host ;
    console.log(full_address);
   // console.log(JSON.stringify(req.headers));
    //console.log("****"+JSON.stringify(req.body));
    let qliksense_url = "https://" + config.engine.hostname ; 
    var subject ="";
    var usrmail = req.body.frmCntRecipient;
    var mailUser = usrmail.split('@');
        var x;
        for(i=0;i<=mailUser.length;i++){            
            x=mailUser[0];
        }
    var datetime = new Date();
    pinglogger.pingloggerSystem.info(datetime);
    var UserEmail,UserPassword;
    //console.log("loop body 0",JSON.stringify(req.body));
    qUser.find({"IsActive": true},function (err, products) {
        pinglogger.pingloggerSystem.info("------------------=====================----------------------")
        pinglogger.pingloggerSystem.info("We are now in find active user route ")
        if (err) return next(pinglogger.pingloggerSystem.error(err));
        //console.log(products);
        //res.json(products);
        //console.log("***************"+products)
        UserEmail=products[0].EmailUserName;
        UserPassword=products[0].Password;
        if(products!=null)
        {
        UserEmail=products[0].EmailUserName;
        UserPassword=products[0].Password;
        //console.log("User Email ID"+UserEmail+" User Password = "+UserPassword)
        }
        else
        {
        pinglogger.pingloggerSystem.error("Do not have User Email Server Credentials")
        // UserEmail=products[0].EmailUserName;
        // UserPassword=products[0].Password;
        }
        console.log("User Email ID"+UserEmail+" User Password = "+UserPassword + "to" + usrmail)
        var condition = req.body.frmCntCondition=="equalto"?"Equal To":req.body.frmCntCondition=="lessthan"?"Less Than":req.body.frmCntCondition=="greaterthan"?"Greater Than":req.body.frmCntCondition=="lessthanorequalto"?"Less Than or Equal To":req.body.frmCntCondition=="greaterthanorequalto"?"Greater Than or Equal To":"NaN";
        console.log(req.headers['ping-mail-by']);
        var mailUser = usrmail.split('@');
        var x;
        for(i=0;i<=mailUser.length;i++){
              x=mailUser[0];
        }
        console.log(x);
        
        if(req.headers['ping-mail-by']=="forFilter"){
            console.log("created Mail..");
            var  z="";
            if(Array.isArray(req.body.frmCntFieldValue.selectedFieldValue)){
              
                var selectedFilter = req.body.frmCntFieldValue.selectedFieldValue
               
                let y = selectedFilter.forEach(a=>{
                    try {       
                        z = z + a.Field + "/" ;
                        a.Value.forEach((v,i,a)=>{
                            z =z + v + "/" 
                        })
                    } catch (error) {
                        console.log(error);
                    }
                   
                })
            }
         
            var messBody ={
                alertid: req.body.frmCntAlertID,
                alertname : req.body.frmCntAlertName,
                AppicationName : req.body.frmCntApplication.AppName,
                Measures : req.body.frmCntMeasures.pingMeasuresqLabel,
                CurrentValue :req.body.filterValue,
                token:req.body.frmCntMobileUser,
                threshold:condition +' '+ req.body.frmCntFunction,
                setTime : datetime,
                condition:condition,
                mobileStatus : 1,
                diamentionStatus:0,
                qliksenseurl :{
                    pinghostname:"http://" + pingConfig.serverip + ":4500",
                    hostname : qliksense_url,
                    appid:  req.body.frmCntApplication.Appid,
                    appname:  req.body.frmCntApplication.AppName,
                    selectionUrlString : z
                },
                filtersetField : req.body.frmCntFieldValue.selectedFieldValue,
                UserName:x,
                userMail : req.body.frmCntRecipient
                }
                console.log(messBody);
            var template = fs.readFileSync('./routes/HtmlEmailTemplates/editAlert/Filter.hjs','utf-8');           
            subject = " PING : Your alert '"+messBody.alertname+"' is edited successfully !";
        }
        else if(req.headers['ping-mail-by']==  "forDimension"){

                console.log("MailSendForDimension");
                var triggerSetVal = req.body.frmCntFunction;
                var __conditioncheck = req.body.frmCntCondition=="equalto"?"==":req.body.frmCntCondition=="lessthan"?"<":req.body.frmCntCondition=="greaterthan"?">":req.body.frmCntCondition=="lessthanorequalto"?"<=":req.body.frmCntCondition=="greaterthanorequalto"?">=":"NaN";
               
                var matchElement = req.body.diamentionValue.filter(function(item,index,array){
                    switch(__conditioncheck){
                        case ">"  :
                           return item.qNum  > triggerSetVal ;
                          break;
                        case "<":
                            return item.qNum < triggerSetVal ;
                            break;
                        case ">=":
                            return item.qNum >= triggerSetVal ;
                         break;
                        case "<=":
                            return item.qNum  <= triggerSetVal ;
                          break;
                        case "==":
                            return item.qNum == triggerSetVal ;
                          break;
                    }
                   
                });
           
            var messBody ={
                alertid: req.body.frmCntAlertID,
                alertname : req.body.frmCntAlertName,
                AppicationName : req.body.frmCntApplication.AppName,
                Measures : req.body.frmCntMeasures.pingMeasuresqLabel,
                CurrentValue :req.body.frmCntCurrentValue,
                DimenstionValue:matchElement,
                token:req.body.frmCntMobileUser,
                threshold:condition +' '+ req.body.frmCntFunction,
                setTime : datetime,
                mobileStatus : 1,
                diamentionStatus:1,
                qliksenseurl :{ 
                    pinghostname:"http://" + pingConfig.serverip + ":4500",
                    hostname : qliksense_url,
                    appid: req.body.frmCntApplication.Appid,
                    appname: req.body.frmCntApplication.AppName,
                    diamention:req.body.frmCntLoopDiamention.diamention.pingDiamentionData
                 },
                 UserName:x,
                 userMail : req.body.frmCntRecipient
                }
      
               // console.log("********Message Body"+JSON.stringify(messDimensionBody,null,4))
            var template = fs.readFileSync('./routes/HtmlEmailTemplates/editAlert/DimenstionValue.hjs','utf-8');
            //var compiledTemplate = hogan.compile(template);
            //var messbody2 =compiledTemplate.render(messDimensionBody);
            subject = " PING : Your alert '"+messBody.alertname+"' is edited successfully !";
    
        }
        else if(req.headers['ping-mail-by']==  "forMeasures"){
            console.log("created Mail for Measures...");
            var messBody ={
                alertid: req.body.frmCntAlertID,
                alertname : req.body.frmCntAlertName,
                AppicationName : req.body.frmCntApplication.AppName,
                Measures : req.body.frmCntMeasures.pingMeasuresqLabel,
                CurrentValue : req.body.frmCntCurrentValue,
                token:req.body.frmCntMobileUser,
                threshold:condition +' '+ req.body.frmCntFunction,
                setTime : datetime,
                mobileStatus : 1,
                diamentionStatus:0,
                qliksenseurl :{
                    pinghostname:"http://"+ pingConfig.serverip + ":4500",
                    hostname : qliksense_url,
                    appid:  req.body.frmCntApplication.Appid,
                    appname:  req.body.frmCntApplication.AppName
                },
                UserName:x,
                userMail : req.body.frmCntRecipient
             }
            var template = fs.readFileSync('./routes/HtmlEmailTemplates/editAlert/MeasureValue.hjs','utf-8');
            subject = " PING : Your alert '"+messBody.alertname+"' is edited successfully !";
        }

         
        var template1 = hogan.compile(template); 
             

        var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: UserEmail,
        pass: UserPassword
        }
        });
        var mailOptions = {
            from: UserEmail,
            to: usrmail,
            subject: subject,
            html: template1.render(messBody)
            };
            
            transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            pinglogger.pingloggerSystem.error(error);
            } else {
                console.log("Created mail send successfully...");
                           pinglogger.pingloggerSystem.info('Email sent: ' + info.response);
            }
            }); 
            //Mobile Notification
            Mob_Notify(messBody,function(res){
            pinglogger.pingloggerSystem.info("Mobile Create Alert Notification...");
            pinglogger.pingloggerSystem.info(res);
            })
        res.send({Notification : {email : "Created mail successfully send" , mobile : ""}});
    });   
 
});


router.post('/ValidateID', function(req, res, next) {  
    pinglogger.pingloggerSystem.info("------------------=====================----------------------")
    pinglogger.pingloggerSystem.info("We are now in ValidateID  user id  route ")
    pinglogger.pingloggerSystem.info("In Validate Mail ID Function"+JSON.stringify(req.body,null,4));
    var data =JSON.stringify(req.body,null,4);
    var usrmail = req.body.EmailUserName;
    var datetime = new Date();
    pinglogger.pingloggerSystem.info(datetime);
    var UserEmail;
    //var condition = req.body.frmCntCondition=="equalto"?"Equal To":req.body.frmCntCondition=="lessthan"?"Less Than":req.body.frmCntCondition=="greaterthan"?"Greater Than":req.body.frmCntCondition=="lessthanorequalto"?"Less Than or Equal To":req.body.frmCntCondition=="greaterthanorequalto"?"Greater Than or Equal To":"NaN";
     qUser.find({"IsActive": true},function (err, products) {
        pinglogger.pingloggerSystem.info("------------------=====================----------------------")
        pinglogger.pingloggerSystem.info("We are now in get active user route ")
        if (err) return next(pinglogger.pingloggerSystem.error(err));
        // console.log(products);
        res.json(products);
        UserEmail=products[0].EmailUserName;
        pinglogger.pingloggerSystem.info(UserEmail)
        pinglogger.pingloggerSystem.info("User Email Credentials"+UserEmail)
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
        var messbody = "Hi&nbsp;"  +x+ ",<br/> Email ID Confirmation,<br>This is a system generated e-mail and please do not reply."  +
                            "<br><br>Regards, <br>Ping Team";
        
              
      
        

    var nodemailer = require('nodemailer'); 


    // var transporter = nodemailer.createTransport("SMTP",{
    // service: 'mail.teachertrain.org',
    // auth: {
    //     // user: 'ping.admin@roxai.com',
    //     // pass: 'Roxai@123'

    //     user: 'roxai@teachertrain.org',
    //     pass: 'Qliksense!'
    // }
    // });

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: usrmail,
            pass: mess.Password

            // user: 'roxai@teachertrain.org',
            // pass: 'Qliksense!'
        }
        });
    var mailOptions = {
        from: mess.usrmail,
        to:  usrmail,
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
    
    // //Mobile Notification
    // Mob_Notify(mess,function(res){

    //         console.log("Mobile Create Alert Notification...");
    //         console.log(res);
 
    // })
      });
      
});


module.exports = router;