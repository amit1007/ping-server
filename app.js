var createError = require('http-errors');
var expressValidator = require('express-validator');
const pingConfig=require('../server/pingConfig.json')
const fs = require('fs');
// const dbConnection=pingConfig.DbConnection;
// var expressStatusmonitor = require('express-status-monitor');
// var compression = require('compression');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var pinglogger= require('./pingLogging.js');
var mongoose = require('mongoose');
var express         = require('express'),
    app             = express(),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local').Strategy,
    bodyParser      = require('body-parser'),
    session         = require('express-session');



//  var configData={}
//  configData=pingConfig;
//  console.log("configData ",configData)  ;
//  
//  if (configData.importStatus=="false") {
//   console.log("configData status",configData.importStatus)  ;
//   configData.importStatus="true"
//   console.log("configData status",configData)  ;  


//  // let data=JSON.parse(configData));
// //   fs.writeFile(__dirname+"/pingConfig.json",data, (err) => {  
// //     if (err) throw err;
// //     console.log('Data written to file');
// // });
// }
// body-parser for retrieving form data
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
 
const x=pingConfig.Dburl;

pinglogger.pingloggerSystem.info("------------------=====================----------------------")
pinglogger.pingloggerSystem.info("We are now in appjs")
//#region  DB Connection with ServerDB/pingSystem DB.mongodb://localhost/myPingSystem
console.log("Database Details",x)
// mongoose.connect(x, { promiseLibrary: require('bluebird') , useNewUrlParser: true  })
//     // mongoose.connect('mongodb://srs:srs108@ds049219.mlab.com:49219/srsping', { promiseLibrary: require('bluebird') , useNewUrlParser: true  })
//     // mongoose.connect('mongodb://server1123:server1123@ds113799.mlab.com:13799/demoserver1', { promiseLibrary: require('bluebird') , useNewUrlParser: true  })
//     // mongoose.connect('mongodb://localhost/myPingSystem', { promiseLibrary: require('bluebird')})
//     .then(() =>  console.log('DB connection successful'))
//     .catch((err) => pinglogger.pingloggerSystem.error(err));
//#endregion



//-----------------------Code to restore Backup files--------------------------------------
dbImport();
function dbImport(){
    var promise1 = Promise.resolve({ 
        then: function(onFulfill, onReject) { 
            var obj = {
                table: []
              };
              var jsonFile=__dirname+"/pingConfig.json";
              fs.exists(jsonFile, function(exists){
                 if(exists){
                     console.log("yes file exists");
                     fs.readFile(jsonFile, function readFileCallback(err, data){
                     if (err){
                         console.log(err);
                     } else {
                     obj = JSON.parse(data); 
                     
                    // console.log(obj.importStatus);
                    if(obj.importStatus==false)
                    {
                      var restore = require('mongodb-restore');
                          restore({
                                      uri: x,//'mongodb://onkar123:onkar123@ds135993.mlab.com:35993/testdb2', // mongodb://<dbuser>:<dbpassword>@<dbdomain>.mongolab.com:<dbport>/<dbdatabase>
                                      root: __dirname+"/dbBackup/pingDB",
                                      drop:true,
                                     callback: function(err){
                                        if(err){
                                                console.log(err);
                                        }
                                        else{
                                            console.log("finish");
                                            require('dns').lookup(require('os').hostname(), function (err, add, fam) {
                                                 obj.serverip = add;
                                                 obj.importStatus = true;
                                                 var json = JSON.stringify(obj); 
                                                 fs.writeFile(jsonFile, json,function writeFileCallback(err,d1){ 
                                                             onFulfill("DB");
                                                });
                                             })
                                                
                                        }
                                      
                                    }
                                    
                                })
                     }
                    
                }
                onFulfill("DB");
             });

             } else {
                     console.log("file not exists")
                    
                     var json = JSON.stringify(obj);
                     fs.writeFile(jsonFile, json);
                     }
                 });
           
        
        }
      }).then(f =>{
          console.log(f);

             mongoose.connect(x, { promiseLibrary: require('bluebird') , useNewUrlParser: true  })
                .then(() =>  console.log('DB connection successful'))
                .catch((err) => pinglogger.pingloggerSystem.error(err));
      });

}
//-----------------------End Of Code to restore Backup files--------------------------------------

//-----------------------Code to Create Backup files--------------------------------------

// var backup = require('mongodb-backup');
 
// backup({
//   uri: 'mongodb://onkar123:onkar123@ds135993.mlab.com:35993/testdb2', // mongodb://<dbuser>:<dbpassword>@<dbdomain>.mongolab.com:<dbport>/<dbdatabase>
//   root: __dirname+"/dbBackup"
// });

//-----------------------End Of Code to Create Backup files--------------------------------------
// const dbImportStatus=pingConfig.importStatus;
// console.log("status",pingConfig.importStatus)  ;
// if (pingConfig.importStatus=="false") {
//   console.log("status",pingConfig.importStatus)  ;
//   pingConfig.importStatus="true"
//   console.log("status",pingConfig.importStatus)  ;
  
// }
// if(dbImportStatus==false)
// {


// }

var pingAlert = require('./routes/routeCreateAlert');
var userRouter = require('./routes/user');

var ChannelType =require('./routes/channelTypeDetails');
var channelName =require('./routes/channelName');
var  getVerify = require('./routes/pingComman');
var deliveryChannel =require('./routes/deliveryCahnnel');
var sendMailRouter = require('./routes/sendMail');
var history =require('./routes/routeHistory');
var DataSourceEdit = require('./routes/datadourceedit')
var SetSheduledRouter = require('./routes/setShedule')
var TestMailServer =require('./routes/TestMailID');
var QlikSenseRouter = require('./RoxAIQlikSenseAPI/qliksenseConnect');
var QlikSenseMeasuresRouter = require('./RoxAIQlikSenseAPI/qlikSenseMeasures');
var NumFormate =require('./routes/NumFormate');
var LocationDetails =require('./routes/locationDetails');
var QlikUserS =require('./routes/qlikUser');
var UploadBulkUser =require('./routes/BulkUserUpload');
var DateLocker =require('./routes/DateChecker/dateCheckerRoute');
var renewLicense =require('./routes/DateChecker/renewLicenseRoutes');
//onReload
var onReload = require('./routes/OnReloadAlert/onreloadAlerts');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('view engine', 'ejs');
app.use(logger('dev'));

var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

app.use(methodOverride());
app.use(cookieParser());

console.log(path.join(__dirname,'../client', 'dist/RoxAIPING'));
app.use(express.static(path.join(__dirname,'../client','dist/RoxAIPING')));
app.use('/', express.static(path.join(__dirname,'../client','dist/RoxAIPING')));
//comman

//superadmin
app.use('/SuperAdmin/createSuperUser', express.static(path.join(__dirname,'../client','dist/RoxAIPING')));

//admin
app.use('/admin', express.static(path.join(__dirname,'../client','dist/RoxAIPING')));
app.use('/admin/createUser', express.static(path.join(__dirname,'../client','dist/RoxAIPING')));
app.use('/admin/userDetails', express.static(path.join(__dirname,'../client','dist/RoxAIPING')));
app.use('/admin/editUserDetails', express.static(path.join(__dirname,'../client','dist/RoxAIPING')));

// Master Forms/Creation Of Channel Type 
app.use('/admin/createChannelType', express.static(path.join(__dirname,'../client','dist/RoxAIPING')));
app.use('/admin/channelTypeDetails', express.static(path.join(__dirname,'../client','dist/RoxAIPING')));

//master form creation for channel name
app.use('/admin/channelNameDetails', express.static(path.join(__dirname,'../client','dist/RoxAIPING')));
app.use('/admin/createChannelName', express.static(path.join(__dirname,'../client','dist/RoxAIPING')));

//Delivery Channel Details
app.use('/admin/createDeliveryChannel', express.static(path.join(__dirname,'../client','dist/RoxAIPING')));
app.use('/admin/deliveryChannelDetails', express.static(path.join(__dirname,'../client','dist/RoxAIPING')));
app.use('/admin/editDeliveryChannel', express.static(path.join(__dirname,'../client','dist/RoxAIPING')));

//Ping ALert Creation 
app.use('/pingAlert/alertInbox', express.static(path.join(__dirname,'../client','dist/RoxAIPING')));
app.use('/pingAlert/alertHistory', express.static(path.join(__dirname,'../client','dist/RoxAIPING')));
app.use('/pingAlert/createAlert', express.static(path.join(__dirname,'../client','dist/RoxAIPING')));


//Datasource creation
app.use('/admin/createDataSource', express.static(path.join(__dirname,'../client','dist/RoxAIPING')));
app.use('/admin/editDataSource', express.static(path.join(__dirname,'../client','dist/RoxAIPING')));
app.use('/admin/dataSourceDetails', express.static(path.join(__dirname,'../client','dist/RoxAIPING')));



//Login Form
app.use('/login', express.static(path.join(__dirname,'../client','dist/RoxAIPING')));

//Super Admin
app.use('/admin/inActiveUsers', express.static(path.join(__dirname,'../client','dist/RoxAIPING')));
app.use('/admin/sAdminHome', express.static(path.join(__dirname,'../client','dist/RoxAIPING')));
app.use('/admin/allUserList', express.static(path.join(__dirname,'../client','dist/RoxAIPING')));
app.use('/admin/sAlertList', express.static(path.join(__dirname,'../client','dist/RoxAIPING')));


//Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'handlebars');
//express helper packages
// app.use(expressStatusmonitor());
// //express-validator
app.use(expressValidator());
// app.use(compression());

//Express-session
app.use(session({
  secret: 'nodepassportsecret',
  resave: true,
  cookie: { maxage : 6000000000 } , //1 Hour
  saveUninitialized: true,
}));
app.use(require('flash')());
//passport
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session({
  cookie: { maxage : 60000 }
}));
app.use(function(req, res, next){
  res.locals.user = req.user || null
  next();
})



//comman route for current user Information
app.use('/pingUser',getVerify);
//For User Creation from superadmin
app.use('/user', userRouter);
//For Channel Type form
app.use('/ChannelType', ChannelType);
//for channel details (name ) forms
app.use('/ChannelName',channelName);
//Delivery channel Details
app.use('/DeliveryChannel',deliveryChannel);

//Alert CReation Part
app.use('/pingAlert',pingAlert);
app.use('/history', history);
app.use('/QlikSenseMeasures', QlikSenseMeasuresRouter);
app.use('/QlikSense', QlikSenseRouter);
app.use('/NumFormate',NumFormate);

//Datasource 
app.use('/DataSourceEdit',DataSourceEdit);
//Send Mail
app.use('/sendMail',sendMailRouter);
//Shedule Alert
app.use('/SetSheduled', SetSheduledRouter);
app.use('/TestMailServer',TestMailServer);

//user PReference screen
app.use('/AddLocation',LocationDetails);

//user PReference screen
app.use('/QlikUserSync',QlikUserS);

//Upload Bulk User
app.use('/UploadBulkUser',UploadBulkUser);

//Date Checker
app.use('/DateLocker',DateLocker);

//Renew License
app.use('/RenewLicense',renewLicense);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

  // error handler

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log('TestUrl',req.url)
  // res.writeHead(302, {
  //   'Location': 'localhost:4009/'+req.url
  //   //add other headers here...
  // });
  // render the error page
  res.status(err.status || 500);
  res.send(err.status);
});

module.exports = app;
