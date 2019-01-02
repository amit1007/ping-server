// For Mobile Notificatioin...
var FCM = require('fcm-node');
var pinglogger= require('../pingLogging.js');
var qUser = require('../models/DeliveryCahnnel');
var Client = require('node-rest-client').Client;
var client = new Client();

pinglogger.pingloggerSystem.info("------------------=====================----------------------")
pinglogger.pingloggerSystem.info("We are now in Mobile Notification")

var mobNotify = function(mess,callback){
  
    qUser.find({"IsActive": true},function (err, products) {
        pinglogger.pingloggerSystem.info("------------------=====================----------------------")
        pinglogger.pingloggerSystem.info("We are now in find active user route ")
            if (err) return next(pinglogger.pingloggerSystem.error(err));
            // console.log(products);
            //res.json(products);
          //  console.log("***************"+products)
            FCMServerKey=products[0].Server;
    //console.log("*********FCM="+FCMServerKey)
    pinglogger.pingloggerSystem.info("------------------=====================----------------------")
    pinglogger.pingloggerSystem.info("We are now in Mobile Notification")
    pinglogger.pingloggerSystem.info("Mobile Notification Successfully sent to ....",mess.token);    
    var serverKey = 'AIzaSyD-bT7VrG1iT1IWIfkZAEPPvxcEsGEhSsI'; //put your server key here
    var fcm = new FCM(FCMServerKey);
    let _msg = {};
    if(mess.diamentionStatus === 0){
        console.log("Without loop notification...");
        _msg =    {
            "alert_filters":"Q4-2016",
            "alert_history":"hi",
            "alert_message":"Alert Name:"+mess.alertname+"",
            "alert_source":mess.AppicationName,
            "alert_ping_id":mess.alertID || mess.alertid ,
            "alert_measures":mess.Measures,
            "alert_conditions":mess.threshold,
            "alert_desc":"For Q4-2016",
            "alert_status": mess.mobileStatus,
            "alert_diamention":mess.diamentionStatus,
            "current_value":mess.CurrentValue.measuresValue || mess.CurrentValue,
            "previous_value":mess.PreviousValue || "",
            "user_email" : mess.userMail
        }
         
        
    }
    else{
        console.log("with loop notification...");
         _msg = {
            "alert_filters":"Q4-2016",
            "alert_history":"hi",
            "alert_message":"Alert Name:"+mess.alertname+"",
            "alert_source":mess.AppicationName,
            "alert_ping_id":mess.alertID || mess.alertid ,
            "alert_measures":mess.Measures,
            "alert_conditions":mess.threshold,
            "alert_desc":"For Q4-2016",
            "alert_status": mess.mobileStatus,
            "alert_diamention":mess.diamentionStatus ,
            "current_value":"0",
            "previous_value": "0",   
            "user_email" : mess.userMail   
        }
    }
 
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        // to: 'emnQyvXYuzQ:APA91bEz7KyYubM1YEDJq6Naf5WQZ9-lonMMexOqNYf_XWd3u-0J5B12MldYa-2ZXZQJIp4alYDPrZrYbREfPpOVGdHsRi09Dgc4RpMk4dKU8j3dd1oOq3VEl_QwdJnS9a-mKkhqmd_Hj4FUVDGqgCtCe56ZuAU-uA',//mess.token, 
        to: mess.token, 
        collapse_key: 'your_collapse_key',        
        data: {
            ping_data:_msg
        }
        
    };
    
    var vali=fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!");
            pinglogger.pingloggerSystem.info("Something has gone wrong!");
            return "1";
        } else {
            console.log("Successfully sent with response: ", response);
            pinglogger.pingloggerSystem.info("Successfully sent with response: ", response);
            return "2";
        }
    });
    pinglogger.pingloggerSystem.info("test console",vali);
    console.log("Mobile notify data", _msg)
    //For Ping Bot
    _msg = {
            data : _msg,
            headers: { "Content-Type": "application/json" } 
            }
    mobFcm = client.post("http://ec2-34-195-43-80.compute-1.amazonaws.com:4004/ping/alert_notification", _msg, function (data, response) {

         //console.log(data);
         console.log("Status code ping alert notification",response.statusCode);
     });
    mobFcm.on('error', function (err) {
         console.log('request error', err.code);
     });  

    return callback(vali);  
})        
}

module.exports=mobNotify;