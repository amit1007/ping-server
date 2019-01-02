var express = require('express');
var router = express.Router();
var  Author = require('../models/PingUsers')
var csvjson = require('csvjson');
var bcrypt = require('bcryptjs');
var pinglogger= require('../pingLogging.js');
const { isLoggedIn } = require('../config/auth');
var channelDetails = require('../models/DeliveryCahnnel');
var nodemailer = require('nodemailer'); 
const User = require('../models/QlikUser');

// router.post('/', function(req, res, next) {
//   pinglogger.pingloggerSystem.info("------------------=====================----------------------")
//   pinglogger.pingloggerSystem.info("We are now in Bulk User Upload")
//     data = req.body.data
//   //  console.log(data)
//   //  console.log(csvjson.toObject(data));
//     authors = csvjson.toObject(data)
//     for(i=0;i<authors.length;i++){
//     authors[i].password = bcrypt.hashSync(authors[i].password, 8);
//     }
//    // console.log(authors);

//      Author.create(authors, function(err, documents) {
//        try{
//         if (err) next (pinglogger.pingloggerSystem.error(err))
//         res.json("ok")
//        }
//        catch (err){
//         pinglogger.pingloggerSystem.error(err);
//        }
        
//      });
   
//   });

  router.post('/',function(req, res, next){
    try {
      channelDetails.find({"IsActive": true},function (err, products) {
        pinglogger.pingloggerSystem.info("------------------=====================----------------------")
        pinglogger.pingloggerSystem.info("We are now in get active user route ")
        if (err) return next(pinglogger.pingloggerSystem.error(err));
        data = req.body.data
        //  console.log(data)
        //  console.log(csvjson.toObject(data));
          authors = csvjson.toObject(data)
          //console.log("**************************************")
         // console.log("CSV Data"+JSON.stringify(authors,null,4))
      // QlikUserSync("abc",function(qlikuserSync){
        // console.log(qlikuserSync);
        var qlikUsers=authors;
      var i;
      for (i = 0; i < qlikUsers.length; i++) { 
        // console.log("User"+i+" "+qlikUsers[i].qlikUserData)
          var password=qlikUsers[i].PingUserName+"123";
          var decryptedPassword=password;
         // console.log(password)
          var qUID = qlikUsers[i].PingUserID
          var qName=qlikUsers[i].PingUserName
          var qDirectory=qlikUsers[i].PingUserDirectory
          var qRoles=qlikUsers[i].PingRole
          var qEmail=qlikUsers[i].EmailID
          var insertBy=qlikUsers[i].InsertBy
          var loginUserID=qlikUsers[i].LoginUserID
          if(qEmail=="",qEmail==null)
          {
            qEmail="";
          }
          var qGroup=qlikUsers[i].PingGroupID
          console.log("------------**************--------------------")
          User.find(function(err,totaluser){
            if(err) return next(err);
            let count = totaluser.length + 1
            const newUser = new User({            
              PingUserID: 'User'+count,
              PingUserName: qName.toLowerCase(),
              PingUserDirectory: qDirectory,
              PingUserAccess: 'Manage In Ping',
              EmailID: qEmail.toLowerCase(),
              password: password,
              PingMemberID: '1',
              PingGroupID: '1',
              PingRole: qRoles,
              InsertBy:insertBy,
              LoginUserID: loginUserID 
            });  
            if(newUser.EmailID!='')
            {
              var usrmail =newUser.EmailID;
              console.log("EmailID"+usrmail);
             
                // console.log(products);
                UserEmail=products[0].EmailUserName;
                UserPassword=products[0].Password;
                pinglogger.pingloggerSystem.info(UserEmail)
                pinglogger.pingloggerSystem.info("User Email Credentials"+UserEmail)
             //console.log("User EMial "+UserEmail+" PAssword "+UserPassword)
                  var mailUser = usrmail.split('@');
                  // var x;
                  // for(i=0;i<=mailUser.length;i++){
                      
                  //     x=mailUser[0];
                  // }
                  var messbody = "Hello &nbsp;"  +newUser.PingUserName+ ",<br/> You have been added to PING. The login credentials for your account are:<br><br>Username:&nbsp;"+newUser.PingUserName+"<br>Password :&nbsp;"+decryptedPassword+".<br><br><br> This is a system generated e-mail and please do not reply.<br><br><br>Regards,<br>"  +
                                    "Ping Team";  
  
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: UserEmail,
                            pass: UserPassword
  
                            // user: 'roxai@teachertrain.org',
                            // pass: 'Qliksense!'
                        }
                        });
                    var mailOptions = {
                        from: UserEmail,
                        to:  usrmail,
                        subject: 'PING : Login Credentials',
                        html: messbody
                    };
  
                    transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        pinglogger.pingloggerSystem.error(error);
                    } else {
                        console.log("ValidateID Mail send to ..."+usrmail);
                        pinglogger.pingloggerSystem.info('Email sent: ' + info.response);
                    }
                    });  
   
              
            }    
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {              
                newUser.password = hash;                   
                newUser.save()
               
                .then(user => {
                 
                   console.log("Bulk User Data saved(Using Excel Sheet) "+newUser.PingUserName)                   
                                           
                })
                .catch(err => {
                  console.log(err);
                  return
                });
            
              });
          
            });            
            // res.send("ok") 
          })
          
      }
      
      // })
      // console.log("Direct Export"+QlikUserSync.qlikUsers)
      // console.log("REsult "+Object.keys(QlikUserSync.QlikUser).length)
      // console.log("Length = "+JSON.stringify(QlikUserSync.QlikUser))
      // console.log("In User synchronus fetch"+res.length)
      res.json("ok")
    });
  } catch (error) {
      console.log(error);
  }
  });


  module.exports = router;