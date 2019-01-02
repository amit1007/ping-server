
// var schedule = require('node-schedule');
// var nodemailer = require('nodemailer');
var mydate = require('current-date');
var moment = require('moment');
var schedule = require('node-schedule');
var express = require('express');
var router = express.Router();
var app = express();
//#region For Trigger
var triggerAlert = require('./TriggerAlert/SheduledAlertMail');
var triggerSetValue =require('./CommanCal/calSetValue');
var hyperCube =require('./TriggerAlert/hyperCube');
var diaHyperCube =require('./TriggerAlert/diaHypercube');
var filterHyperCube =require('./TriggerAlert/filterHyperCube');
var mailSend =require("./TriggerAlert/SheduledAlertMail");
var inboxInsert = require("./inboxCreate");
var Mob_Notify =require('./mobileNotification');
var pinglogger= require('../pingLogging.js');
var alerts = require('../models/createAlertSchema.js');
//get url for email send....
const pingConfig=require('../pingConfig.json');
const config = require('../routes/OnReloadAlert/testConfig');

pinglogger.pingloggerSystem.info("------------------=====================----------------------")
pinglogger.pingloggerSystem.info("We are now in set schedule route ")


 
//#endregion
// var date = new Date(2018, 06, 2, 15, 23, 0);
// var rule = new schedule.RecurrenceRule();

// rule.minute=5;
// rule.second=4;
router.post('/', function(req, resR, next) {  
        //for Alert History Collection
         var setSheduleDate = moment.utc().format('YYYY-MM-DD HH:mm:ss');
       
        // console.log(qMatrix); 
        // var date = new Date(2018, 06, 2, 15, 23, 0);
        // var rule = new schedule.RecurrenceRule();
        console.log("in Measures...");
      


        var curredate =new Date(Date.now());
        console.log(curredate.getFullYear() +":"+curredate.getMonth()+":"+curredate.getDate());
        
        var hourSum = req.body.frmGrpShedules.intervalTimeScheduleHours * 60;
        console.log(hourSum);
        
        var intervalTimeSchedule = req.body.frmGrpShedules.intervalTimeScheduleMins;
        console.log("intervalTimeSchedule:-",intervalTimeSchedule);

        var totalInterval = hourSum + intervalTimeSchedule;
        console.log("Time HARMEET chose for interval :" + totalInterval);
        
        var starttimer = req.body.frmGrpShedules.startTimeSchedule;
        console.log("start:-",starttimer);
        
        var setstartTimeForTrigger = starttimer.split(':');
        
        var Shour,Sminute;
        for(i=0;i<=setstartTimeForTrigger.length;i++){          
            Shour = setstartTimeForTrigger[0];
            Sminute=setstartTimeForTrigger[1];      
        }          
        
        var startTime = new Date( curredate.getFullYear(), curredate.getMonth(), curredate.getDate(), Shour, Sminute, 0, 0 );
        // console.log("startTime",startTime);
        
        var endTimer = req.body.frmGrpShedules.endTimeSchedule;
        // console.log("endTimer:-",endTimer);
        
        var setendTimeForTrigger = endTimer.split(':');

        var Ehour,Eminute;
        for(i=0;i<=setendTimeForTrigger.length;i++){          
            Ehour = setendTimeForTrigger[0];
            Eminute=setendTimeForTrigger[1];           
        }
        
        var endTime   = new Date( curredate.getFullYear(), curredate.getMonth(), curredate.getDate(),Ehour, Eminute, 0, 0 );
        // console.log("endTime",endTime);
        // var repeatCounts = req.body.frmGrpShedules.repeatCounts;
        // console.log("repeatCounts:-",repeatCounts);
        // var dateSchedule = req.body.frmGrpShedules.dateSchedule;
        // console.log("dateSchedule:-",dateSchedule);


        var j = req.body.frmGrpShedules;
            // console.log(selectedDays);
            var s=[];
            for(var x in j){
                if(j[x]=== true){
                    var h = x=="SUN"?0:x=="MON"?1:x=="TUE"?2:x=="WED"?3:x=="THU"?4:x=="FRI"?5:x=="SAT"?6:null;
                    s.push(h)  ;         
                }
            }
        // console.log(s);

        var daysRange = new schedule.RecurrenceRule();
        var scheduleDays = daysRange.dayOfWeek = s;

        var sheduleID = "sId"+req.body.frmCntAlertID;
         

    sheduleID = schedule.scheduleJob({ start: startTime, end: endTime, rule: '*/'+ intervalTimeSchedule +' * * * '+ scheduleDays +'' }, function(){
        
        alerts.findOne({frmCntAlertID: req.body.frmCntAlertID,trigger:true,IsActive:true},function(err,_record){
            if(_record === null){
                console.log("cancel");
                sheduleID.cancel();
            }
            else{
                let qliksense_url = "https://" + config.engine.hostname ;
                console.log(qliksense_url);
                console.log(_record.frmCntCurrentValue);
                console.log(_record.frmCntCondition);
                console.log(_record.frmCntFunction);
                console.log(_record.frmCntMeasures);
                console.log("Measures sheduled...");
                //for Alert History Collection
                var setTriggeredDate = moment.utc().format('YYYY-MM-DD HH:mm:ss');
                //for persentate Value
                // var currentValue = req.body.frmCntCurrentValue +  triggerSetValue.SetValue(req.body.frmCntCurrentValue,req.body.frmCntFunction);
                //For  Absulate Value 
                var currentValue = _record.frmCntCurrentValue ;
                var condition = _record.frmCntCondition=="equalto"?"==":_record.frmCntCondition=="lessthan"?"<":_record.frmCntCondition=="greaterthan"?">":_record.frmCntCondition=="lessthanorequalto"?"<=":_record.frmCntCondition=="greaterthanorequalto"?">=":"NaN";
                var cond = _record.frmCntCondition=="equalto"?"Equal To":_record.frmCntCondition=="lessthan"?"Less Than":_record.frmCntCondition=="greaterthan"?"Greater Than":_record.frmCntCondition=="lessthanorequalto"?"Less Than or Equal To":_record.frmCntCondition=="greaterthanorequalto"?"Greater Than or Equal To":"NaN";
               //for persentate Value
                // var triggerSetVal = req.body.frmCntCurrentValue + currentValue;
               //For  Absulate Value
               var triggerSetVal = _record.frmCntFunction;
               
                hyperCube(_record.frmCntMeasures.Appid,_record.frmCntMeasures.pingMeasuresqDef,_record.InsertBy,function(res){
                    console.log("In HyperCube....");
                    var triggertime = moment.utc().local().format('YYYY-MM-DD HH:mm:ss');
                    pinglogger.pingloggerSystem.info("calling hyperCube data in set schedule");
                    pinglogger.pingloggerSystem.info(currentValue);
                    pinglogger.pingloggerSystem.info(condition);
                        var mess ={
                            alertID:_record.frmCntAlertID,
                            LogginUserID:_record.UserID,
                            userMail:_record.frmCntRecipient,
                            alertname : _record.frmCntAlertName,
                            AppicationName : _record.frmCntApplication.AppName,
                            Measures : _record.frmCntMeasures.pingMeasuresqLabel,
                            triggeredHistory:[{"triggeredDate":setSheduleDate,"Value": _record.frmCntCurrentValue},{"triggeredDate":setTriggeredDate,"Value":res.measuresValue}],
                            PreviousValue :_record.frmCntCurrentValue,
                            threshold:cond +' '+ _record.frmCntFunction,
                            triggerTime : triggertime,
                            CurrentValue: res,
                            qliksenseurl :{
                                pinghostname:"http://"+pingConfig.serverip,
                                hostname : qliksense_url,
                                appid: _record.frmCntApplication.Appid,
                                appname: _record.frmCntApplication.AppName
                            },                            
                            mobileStatus : 0,
                            diamentionStatus:0,
                            token :_record.frmCntMobileUser                          
                        }
                        pinglogger.pingloggerSystem.info('Filter value ',_record.filterValue);
                        pinglogger.pingloggerSystem.info('Current Value',_record.frmCntCurrentValue);
                        pinglogger.pingloggerSystem.info(mess);
        
                        switch(condition){
                            case ">"  :
                                    if(res > triggerSetVal){
                                        pinglogger.pingloggerSystem.info(">triggered");
                                            mailSend.mail("measures",mess);
                                            mailSend.mobNotify(mess);
                                            inboxInsert.CreateHistory(mess, function(err, sample){
                                                if(err){
                                                    console.log("error history Alert....");
                                                    pinglogger.pingloggerSystem.error(err);
                                                }
                                                console.log("saved history Alert....");
                                                pinglogger.pingloggerSystem.info(sample);
                                            });
                                    }
                                    else{
                                        pinglogger.pingloggerSystem.info(">NONtriggered");
                                        mailSend.mail("measures",mess);
                                        mailSend.mobNotify(mess);
                                        inboxInsert.CreateHistory(mess, function(err, sample){
                                            if(err){
                                                pinglogger.pingloggerSystem.error(err);
                                            }
                                            pinglogger.pingloggerSystem.info(sample);
                                        });
                                    }
                                break;
                            case "<":
                                    if(res < triggerSetVal){
                                        pinglogger.pingloggerSystem.info("<triggered");
                                        mailSend.mail("measures",mess);
                                        mailSend.mobNotify(mess);
                                    
                                        inboxInsert.CreateHistory(mess, function(err, sample){
                                            if(err){
                                                pinglogger.pingloggerSystem.error(err);
                                            }
                                            pinglogger.pingloggerSystem.info(sample);
                                        });
                                    }
                                    else{
                                        pinglogger.pingloggerSystem.info("<NONtriggered");
                                        mailSend.mail("measures",mess);
                                        mailSend.mobNotify(mess);
                                        inboxInsert.CreateHistory(mess, function(err, sample){
                                            if(err){
                                                pinglogger.pingloggerSystem.error(err);
                                            }
                                            pinglogger.pingloggerSystem.info(sample);
                                        });
                                    }
                            break;
                            case ">=":
                                    if(res >= triggerSetVal){
                                        pinglogger.pingloggerSystem.info(">=triggered");
                                        mailSend.mail("measures",mess);
                                        mailSend.mobNotify(mess);
                                        inboxInsert.CreateHistory(mess, function(err, sample){
                                            if(err){
                                                pinglogger.pingloggerSystem.error(err);
                                            }
                                            pinglogger.pingloggerSystem.info(sample);
                                        });
        
                                    }
                                    else{
                                        pinglogger.pingloggerSystem.info(">=NONtriggered");
                                        mailSend.mail("measures",mess);
                                        mailSend.mobNotify(mess);
                                        inboxInsert.CreateHistory(mess, function(err, sample){
                                            if(err){
                                                pinglogger.pingloggerSystem.error(err);
                                            }
                                            pinglogger.pingloggerSystem.info(sample);
                                        });
        
                                    }
                            break;
                            case "<=":
                                    if(res <= triggerSetVal){
                                        pinglogger.pingloggerSystem.info("<=triggered");
                                        mailSend.mail("measures",mess);
                                        mailSend.mobNotify(mess);
                                        inboxInsert.CreateHistory(mess, function(err, sample){
                                            if(err){
                                                pinglogger.pingloggerSystem.error(err);
                                            }
                                            pinglogger.pingloggerSystem.info(sample);
                                        });
                                      
                                    }
                                    else{
                                        pinglogger.pingloggerSystem.info("<=NONtriggered");
                                        mailSend.mail("measures",mess);
                                        mailSend.mobNotify(mess);
                                        inboxInsert.CreateHistory(mess, function(err, sample){
                                            if(err){
                                                pinglogger.pingloggerSystem.error(err);
                                            }
                                            pinglogger.pingloggerSystem.info(sample);
                                        });
                                      
                                    }
                            break;
                            case "==":
                                    if(res == triggerSetVal){
                                        pinglogger.pingloggerSystem.info("==triggered");
                                        mailSend.mail("measures",mess);
                                        mailSend.mobNotify(mess);
                                        inboxInsert.CreateHistory(mess, function(err, sample){
                                            if(err){
                                                pinglogger.pingloggerSystem.error(err);
                                            }
                                            pinglogger.pingloggerSystem.info(sample);
                                        });
                                      
                                    }
                                    else{
                                        pinglogger.pingloggerSystem.info("==NONtriggered");
                                        mailSend.mail("measures",mess);
                                        mailSend.mobNotify(mess);
                                        inboxInsert.CreateHistory(mess, function(err, sample){
                                            if(err){
                                                pinglogger.pingloggerSystem.error(err);
                                            }
                                            pinglogger.pingloggerSystem.info(sample);
                                        });
                                      
                                    }
                            break;
                        }
               
                                                                       
         
                });    

            }
        });
        
 
    });

   // resR.send("successfully Alert Sheduled");
})

// Route For Diamention

router.post('/Diamention', function(req, res, next) {  
    pinglogger.pingloggerSystem.info("dimension Route successully");
    var setSheduleDate = moment.utc().format('YYYY-MM-DD HH:mm:ss');
       
    // console.log(qMatrix); 
    // var date = new Date(2018, 06, 2, 15, 23, 0);
    // var rule = new schedule.RecurrenceRule();
   


    var curredate =new Date(Date.now());
    console.log(curredate.getFullYear() +":"+curredate.getMonth()+":"+curredate.getDate());
    
    var hourSum = req.body.frmGrpShedules.intervalTimeScheduleHours * 60;
    console.log(hourSum);
    
    var intervalTimeSchedule = req.body.frmGrpShedules.intervalTimeScheduleMins;
    console.log("intervalTimeSchedule:-",intervalTimeSchedule);

    var totalInterval = hourSum + intervalTimeSchedule;
    console.log("Time HARMEET chose for interval :" + totalInterval);
    
    var starttimer = req.body.frmGrpShedules.startTimeSchedule;
    console.log("start:-",starttimer);
    
    var setstartTimeForTrigger = starttimer.split(':');
    
    var Shour,Sminute;
    for(i=0;i<=setstartTimeForTrigger.length;i++){          
        Shour = setstartTimeForTrigger[0];
        Sminute=setstartTimeForTrigger[1];      
    }          
    
    var startTime = new Date( curredate.getFullYear(), curredate.getMonth(), curredate.getDate(), Shour, Sminute, 0, 0 );
    // console.log("startTime",startTime);
    
    var endTimer = req.body.frmGrpShedules.endTimeSchedule;
    // console.log("endTimer:-",endTimer);
    
    var setendTimeForTrigger = endTimer.split(':');

    var Ehour,Eminute;
    for(i=0;i<=setendTimeForTrigger.length;i++){          
        Ehour = setendTimeForTrigger[0];
        Eminute=setendTimeForTrigger[1];           
    }
    
    var endTime   = new Date( curredate.getFullYear(), curredate.getMonth(), curredate.getDate(),Ehour, Eminute, 0, 0 );
    // console.log("endTime",endTime);
    // var repeatCounts = req.body.frmGrpShedules.repeatCounts;
    // console.log("repeatCounts:-",repeatCounts);
    // var dateSchedule = req.body.frmGrpShedules.dateSchedule;
    // console.log("dateSchedule:-",dateSchedule);


    var j = req.body.frmGrpShedules;
        // console.log(selectedDays);
        var s=[];
        for(var x in j){
            if(j[x]=== true){
                var h = x=="SUN"?0:x=="MON"?1:x=="TUE"?2:x=="WED"?3:x=="THU"?4:x=="FRI"?5:x=="SAT"?6:null;
                s.push(h)  ;         
            }
        }
    // console.log(s);

    var daysRange = new schedule.RecurrenceRule();
    var scheduleDays = daysRange.dayOfWeek = s;

    var sheduleID = "sId"+req.body.frmCntAlertID;
         
         sheduleID = schedule.scheduleJob({ start: startTime, end: endTime, rule: '*/'+ intervalTimeSchedule +' * * * '+ scheduleDays +'' }, function(){
             console.log("loop shedule");
             let qliksense_url = "https://" + config.engine.hostname ;
             alerts.findOne({frmCntAlertID: req.body.frmCntAlertID,trigger:true,IsActive:true},function(err,_record){
                if(_record === null){
                    console.log("cancel");
                    sheduleID.cancel();
                }
                else{
                    console.log(_record.frmCntCurrentValue);
                    console.log(_record.frmCntCondition);
                    console.log(_record.frmCntFunction);
                    console.log(_record.frmCntLoopDiamention.diamention.pingDiamentionData);
                          //For Persentage
                   // var currentValue = req.body.filterValue +  triggerSetValue.SetValue(req.body.filterValue,req.body.frmCntFunction);
                var setTriggeredDate = moment.utc().format('YYYY-MM-DD HH:mm:ss');
                //For Absulate Value
                var currentValue = _record.filterValue ;
                 var condition = _record.frmCntCondition=="equalto"?"==":_record.frmCntCondition=="lessthan"?"<":_record.frmCntCondition=="greaterthan"?">":_record.frmCntCondition=="lessthanorequalto"?"<=":_record.frmCntCondition=="greaterthanorequalto"?">=":"NaN";
                 var cond = _record.frmCntCondition=="equalto"?"Equal To":_record.frmCntCondition=="lessthan"?"Less Than":_record.frmCntCondition=="greaterthan"?"Greater Than":_record.frmCntCondition=="lessthanorequalto"?"Less Than or Equal To":_record.frmCntCondition=="greaterthanorequalto"?"Greater Than or Equal To":"NaN";
                //For Persentage
                 // var triggerSetVal = req.body.filterValue + currentValue;
                  //For Absulate Value
                 var triggerSetVal = _record.frmCntFunction;
                 diaHyperCube(_record.frmCntMeasures.Appid,_record.frmCntMeasures.pingMeasuresqDef,_record.frmCntLoopDiamention.diamention.pingDiamentionData,_record.InsertBy,function(res){
                    console.log(res);  
                    var triggertime = moment.utc().local().format('YYYY-MM-DD HH:mm:ss');          
                    // console.log(currentValue);
                    // console.log(condition);
                    if(Array.isArray(res)){
                        var matchElement = res.filter(function(item,index,array){
                            switch(condition){
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

                        console.log("In dimension HyperCube....");
                        var mess ={
                            alertID:req.body.frmCntAlertID,
                            userMail:req.body.frmCntRecipient,
                            alertname : req.body.frmCntAlertName,
                            AppicationName : req.body.frmCntApplication.AppName,
                            Measures : req.body.frmCntMeasures.pingMeasuresqLabel,
                            triggeredHistory:[{"triggeredDate":setSheduleDate,"Value": _record.frmCntCurrentValue},{"triggeredDate":setTriggeredDate,"Value":res.measuresValue}],
                            PreviousValue : req.body.diamentionValue,
                            threshold:cond +' '+ req.body.frmCntFunction,
                            triggerTime : triggertime,
                            // setTime : datetime
                            qliksenseurl :{
                                pinghostname:"http://"+pingConfig.serverip,
                                 hostname : qliksense_url,
                                appid: _record.frmCntApplication.Appid,
                                appname: _record.frmCntApplication.AppName,
                                diamention:_record.frmCntLoopDiamention.diamention.pingDiamentionData
                             },
                             LogginUserID:_record.UserID,
                            CurrentValue: matchElement,
                            mobileStatus : 0,
                            diamentionStatus:1,
                            token :req.body.frmCntMobileUser                    
                        }
                        inboxInsert.CreateHistory(mess, function(err, sample){
                            if(err){
                                console.log("error history Alert....");
                                pinglogger.pingloggerSystem.error(err);
                            }
                            mailSend.mail("dimension",mess);
                            console.log("saved history Alert....");
                            pinglogger.pingloggerSystem.info(sample);
                        });
                        console.log(mess);
                    }
                   
                 
                    // console.log('Filter value ',req.body.filterValue);
                    // console.log('Current Value',req.body.frmCntCurrentValue);
                    
                    // mailSend.LoopNotify("trigger",mess);
                    // mailSend.mobNotify(mess);
                  }) 
                }
         })
                               
      
         });   
       
   
})

//Route For Filter 

router.post('/Filter', function(req, res, next) {  
    console.log("Filter Route successully")
    var setSheduleDate = moment.utc().format('YYYY-MM-DD HH:mm:ss');
   
    var curredate =new Date(Date.now());
    console.log(curredate.getFullYear() +":"+curredate.getMonth()+":"+curredate.getDate());
    
    var hourSum = req.body.frmGrpShedules.intervalTimeScheduleHours * 60;
    console.log(hourSum);
    
    var intervalTimeSchedule = req.body.frmGrpShedules.intervalTimeScheduleMins;
    console.log("intervalTimeSchedule:-",intervalTimeSchedule);

    var totalInterval = hourSum + intervalTimeSchedule;
    console.log("Time HARMEET chose for interval :" + totalInterval);
    
    var starttimer = req.body.frmGrpShedules.startTimeSchedule;
    console.log("start:-",starttimer);
    
    var setstartTimeForTrigger = starttimer.split(':');
    
    var Shour,Sminute;
    for(i=0;i<=setstartTimeForTrigger.length;i++){          
        Shour = setstartTimeForTrigger[0];
        Sminute=setstartTimeForTrigger[1];      
    }          
    
    var startTime = new Date( curredate.getFullYear(), curredate.getMonth(), curredate.getDate(), Shour, Sminute, 0, 0 );
    // console.log("startTime",startTime);
    
    var endTimer = req.body.frmGrpShedules.endTimeSchedule;
    // console.log("endTimer:-",endTimer);
    
    var setendTimeForTrigger = endTimer.split(':');

    var Ehour,Eminute;
    for(i=0;i<=setendTimeForTrigger.length;i++){          
        Ehour = setendTimeForTrigger[0];
        Eminute=setendTimeForTrigger[1];           
    }
    
    var endTime   = new Date( curredate.getFullYear(), curredate.getMonth(), curredate.getDate(),Ehour, Eminute, 0, 0 );
    // console.log("endTime",endTime);
   

    var j = req.body.frmGrpShedules;
        // console.log(selectedDays);
        var s=[];
        for(var x in j){
            if(j[x]=== true){
                var h = x=="SUN"?0:x=="MON"?1:x=="TUE"?2:x=="WED"?3:x=="THU"?4:x=="FRI"?5:x=="SAT"?6:null;
                s.push(h)  ;         
            }
        }
    // console.log(s);

    var daysRange = new schedule.RecurrenceRule();
    var scheduleDays = daysRange.dayOfWeek = s;

    var sheduleID = "sId"+req.body.frmCntAlertID;
          


sheduleID = schedule.scheduleJob({ start: startTime, end: endTime, rule: '*/'+ intervalTimeSchedule +' * * * '+ scheduleDays +'' }, function(){
   console.log("filter shedule...");
    pinglogger.pingloggerSystem.info("Shedule Filter");

    alerts.findOne({frmCntAlertID: req.body.frmCntAlertID,trigger:true,IsActive:true},function(err,_record){
        if(_record === null){
            console.log("cancel");
            sheduleID.cancel();
        }
        else{
            let qliksense_url = "https://" + config.engine.hostname ;
            console.log(_record.frmCntCurrentValue);
            console.log(_record.frmCntCondition);
            console.log(_record.frmCntFunction);
            console.log(_record.frmCntMeasures);
                  //For Persentage
           // var currentValue = req.body.filterValue +  triggerSetValue.SetValue(req.body.filterValue,req.body.frmCntFunction);
        var setTriggeredDate = moment.utc().format('YYYY-MM-DD HH:mm:ss');
        //For Absulate Value
        var currentValue = _record.filterValue ;
         var condition = _record.frmCntCondition=="equalto"?"==":_record.frmCntCondition=="lessthan"?"<":_record.frmCntCondition=="greaterthan"?">":_record.frmCntCondition=="lessthanorequalto"?"<=":_record.frmCntCondition=="greaterthanorequalto"?">=":"NaN";
         var cond = _record.frmCntCondition=="equalto"?"Equal To":_record.frmCntCondition=="lessthan"?"Less Than":_record.frmCntCondition=="greaterthan"?"Greater Than":_record.frmCntCondition=="lessthanorequalto"?"Less Than or Equal To":_record.frmCntCondition=="greaterthanorequalto"?"Greater Than or Equal To":"NaN";
        //For Persentage
         // var triggerSetVal = req.body.filterValue + currentValue;
          //For Absulate Value
         var triggerSetVal = _record.frmCntFunction;
     // console.log(currentValue);
     // console.log(condition);
     // console.log(triggerSetVal);
     filterHyperCube(_record.frmCntMeasures.Appid,_record.frmCntMeasures.pingMeasuresqDef,_record.frmCntFieldValue.selectedFieldValue,_record.InsertBy,function(res){
         // console.log(res.measuresValue);
         // console.log(currentValue);
         // console.log(condition); 
         var triggertime = moment.utc().local().format('YYYY-MM-DD HH:mm:ss');   
             try {
                 console.log("In filter HyperCube....");
                 console.log(res);
                 var  z="";
                 if(Array.isArray(_record.frmCntFieldValue.selectedFieldValue)){
                   
                     var selectedFilter = _record.frmCntFieldValue.selectedFieldValue
                    
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
                 
                 var mess ={
                     alertID:_record.frmCntAlertID,
                     userMail:_record.frmCntRecipient,
                     alertname : _record.frmCntAlertName,
                     AppicationName : _record.frmCntApplication.AppName,
                     Measures : _record.frmCntMeasures.pingMeasuresqLabel,
                     triggeredHistory:[{"triggeredDate":setSheduleDate,"Value": _record.filterValue},{"triggeredDate":setTriggeredDate,"Value":res.measuresValue}],
                     PreviousValue :_record.filterValue,
                     filtersetField : _record.frmCntFieldValue.selectedFieldValue,
                     triggerTime : triggertime,
                 // setTime : datetime                
                     qliksenseurl :{
                        pinghostname:"http://"+pingConfig.serverip,
                        hostname : qliksense_url,
                       appid: _record.frmCntApplication.Appid,
                       appname: _record.frmCntApplication.AppName,
                       selectionUrlString : z
                    },
                    LogginUserID:_record.UserID,
                     CurrentValue: res,
                     mobileStatus : 0,
                     diamentionStatus:0,
                     token :_record.frmCntMobileUser,
                     threshold:cond +' '+ _record.frmCntFunction
                 }
               
                 console.log("mess");  console.log(mess);
                 pinglogger.pingloggerSystem.info("MObile Notification");
        
     
                 switch(condition){
                     case ">"  :
                             if(res > triggerSetVal){
                                 pinglogger.pingloggerSystem.info(">triggered");
                                     mailSend.mail("filter",mess);
                                     mailSend.mobNotify(mess);
                                     inboxInsert.CreateHistory(mess, function(err, sample){
                                         if(err){
                                             pinglogger.pingloggerSystem.error(err);
                                         }
                                         pinglogger.pingloggerSystem.info(sample);
                                     });
                                    
                             }
                             else{
                                 pinglogger.pingloggerSystem.info(">NONtriggered");
                                 mailSend.mail("filter",mess);
                                 mailSend.mobNotify(mess);
                                 inboxInsert.CreateHistory(mess, function(err, sample){
                                     if(err){
                                         pinglogger.pingloggerSystem.error(err);
                                     }
                                     pinglogger.pingloggerSystem.info(sample);
                                 });
                            
                             }
                         break;
                     case "<":
                             if(res < triggerSetVal){
                                 pinglogger.pingloggerSystem.info("<triggered");
                                 mailSend.mail("filter",mess);
                                 mailSend.mobNotify(mess);
                                 inboxInsert.CreateHistory(mess, function(err, sample){
                                     if(err){
                                         pinglogger.pingloggerSystem.error(err);
                                     }
                                     pinglogger.pingloggerSystem.info(sample);
                                 });
                                
                             }
                             else{
                                 pinglogger.pingloggerSystem.info("<NONtriggered");
                                 mailSend.mail("filter",mess);
                                 mailSend.mobNotify(mess);
                                 inboxInsert.CreateHistory(mess, function(err, sample){
                                     if(err){
                                         pinglogger.pingloggerSystem.error(err);
                                     }
                                     pinglogger.pingloggerSystem.info(sample);
                                 });
                               
                               
                             }
                     break;
                     case ">=":
                             if(res >= triggerSetVal){
                                 pinglogger.pingloggerSystem.info(">=triggered");
                                 mailSend.mail("filter",mess);
                                 mailSend.mobNotify(mess);
                                 inboxInsert.CreateHistory(mess, function(err, sample){
                                     if(err){
                                         pinglogger.pingloggerSystem.error(err);
                                     }
                                     pinglogger.pingloggerSystem.info(sample);
                                    
                                 });
     
                             }
                             else{
                                 pinglogger.pingloggerSystem.info(">=NONtriggered");
                                 mailSend.mail("filter",mess);
                                 mailSend.mobNotify(mess);
                                 inboxInsert.CreateHistory(mess, function(err, sample){
                                     if(err){
                                         pinglogger.pingloggerSystem.error(err);
                                     }
                                     pinglogger.pingloggerSystem.info(sample);
                                 });
                                
     
                             }
                     break;
                     case "<=":
                             if(res <= triggerSetVal){
                                 pinglogger.pingloggerSystem.info("<=triggered");
                                 mailSend.mail("filter",mess);
                                 mailSend.mobNotify(mess);
                                 inboxInsert.CreateHistory(mess, function(err, sample){
                                     if(err){
                                         pinglogger.pingloggerSystem.error(err);
                                     }
                                     pinglogger.pingloggerSystem.info(sample);
                                 });
                                 
                             
                             }
                             else{
                                 pinglogger.pingloggerSystem.info("<=NONtriggered");
                                 mailSend.mail("filter",mess);
                                 mailSend.mobNotify(mess);
                                 inboxInsert.CreateHistory(mess, function(err, sample){
                                     if(err){
                                         pinglogger.pingloggerSystem.error(err);
                                     }
                                     pinglogger.pingloggerSystem.info(sample);
                                 });
                                
                             
                             }
                     break;
                     case "==":
                             if(res == triggerSetVal){
                                 pinglogger.pingloggerSystem.info("==triggered");
                                 mailSend.mail("filter",mess);
                                 mailSend.mobNotify(mess);
                                 inboxInsert.CreateHistory(mess, function(err, sample){
                                     if(err){
                                         pinglogger.pingloggerSystem.error(err);
                                     }
                                     pinglogger.pingloggerSystem.info(sample);
                                 });
                             //     mobileNotify(x,function(res){
                             //         console.log(res);
                             //    })
                             
                             }
                             else{
                                 pinglogger.pingloggerSystem.info("==NONtriggered");
                                 mailSend.mail("filter",mess);
                                 mailSend.mobNotify(mess);
                                 inboxInsert.CreateHistory(mess, function(err, sample){
                                     if(err){
                                         pinglogger.pingloggerSystem.error(err);
                                     }
                                     pinglogger.pingloggerSystem.info(sample);
                                 });
                                 // mobileNotify(x,function(res){
                                 //     console.log(res);
                                 //    })
                             
                             }
                     break;
                 }
             } catch (error) {
                 console.log(error);
             }
       

                                                     

         });  
      
        }
    })
      
        
   });
 })

router.post('/onreload', function(req, res, next) {  
    pinglogger.pingloggerSystem.info("on reload Route Successfully...");
    var sheduleID = "sId"+req.body.frmCntAlertID;
})
module.exports = router;