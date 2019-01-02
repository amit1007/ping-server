// var inbox = require('../models/historyAlert.js');

// var Matrix = function (mess,callback){
 
//     inbox.create(x, function (err, post) {
//     if (err) return ;
//      callback(post);
//   });

// }
// module.exports =Matrix;

var mongoose = require('mongoose');
var pinglogger= require('../pingLogging.js');

pinglogger.pingloggerSystem.info("------------------=====================----------------------")
pinglogger.pingloggerSystem.info("We are now inbox Create schema ")
var Schema = mongoose.Schema;

// create a schema

var historyAlertSchema = new mongoose.Schema({
  alertID : String,
  alertname : String,         
  AppicationName : String,          
  Measures : String,
  triggeredHistory:[],
  PreviousValue :Object,
  CurrentValue:{},
  triggeredTime:{ type: Date, default: new Date() },
  LogginUserID:String,
  diamentionStatus:String
},{collection : 'tblhistoryAlert'});
historyAlertSchema.set('collection','tblhistoryAlert')

// the schema is useless so far
// we need to create a model using it
var Test = module.exports = mongoose.model('myPingSystem', historyAlertSchema);

module.exports.CreateHistory = function(mess, callback){
  console.log(mess);
  Test.findOne({alertID: mess.alertID},function(err,history){
      if(history === null){
        console.log("Create History....");
          Test.insertMany(mess,callback);
      }
      else{
        console.log("update History....");
        Test.findOneAndUpdate({alertID: mess.alertID},{$push:{triggeredHistory:{"triggeredDate":mess.triggerTime,"Value":mess.CurrentValue.measuresValue } }},callback);
      }
  });

}
