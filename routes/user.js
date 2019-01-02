// var express = require('express');
// var router = express.Router();
// const passport = require('passport');
// const bcrypt = require('bcryptjs');
// var LocalStrategy   = require('passport-local').Strategy;
// var app = require('../app');
// const { isLoggedIn } = require('../config/auth');

// //module import
// const User = require('../models/User');


// router.get('/register',isLoggedIn,function(req,res){
//   try {
//     console.log(req.session["passport"]["user"]) ;
//     res.send()
//   } catch (error) {
//     res.send(403,error);
//   }
// });

// router.post('/register', (req, res) => {
//     try {
//         console.log("user register");
//         console.log(req.body);
//         req.assert('PingUserName', 'Username is required').notEmpty();
//         req.assert('EmailID', 'Enter a valid email address').isEmail();
//         req.assert('password', 'Password must be atleast 6 charecters').isLength({ min: 6 });
//         const errors = req.validationErrors();
       
//         if(errors){             
//            return res.send(403,errors);
//             console.log(errors);
//          }         
//          else{
//             User.findOne({
//               PingUserName: req.body.PingUserName
//               })
//               .then(user => {
//                 if(user) {
//                   return res.send(403, {msg: `Already a user with User Name ${req.body.PingUserName}`});
            
//                 }

//                 User.find(function(err,totaluser){
//                   if(err) return next(err);
//                   let count = totaluser.length + 1
//                   const newUser = new User({            
//                     PingUserID: "User"+ count,
//                     PingUserName: req.body.PingUserName.toLowerCase(),
//                     PingUserDirectory: req.body.PingUserDirectory,
//                     PingUserAccess: req.body.PingUserAccess,
//                     EmailID: req.body.EmailID.toLowerCase(),
//                     password: req.body.password,
//                     PingMemberID: req.body.PingMemberID,
//                     PingGroupID: req.body.PingGroupID,
//                     PingRole: req.body.PingRole,
//                     InsertBy:req.body.InsertBy,
//                     LoginUserID: req.body.LoginUserID
//                   });
              
//                   bcrypt.genSalt(10, (err, salt) => {
//                     bcrypt.hash(newUser.password, salt, (err, hash) => {
                      
//                       newUser.password = hash;                   
              
//                       newUser.save()
//                         .then(user => {
//                            return res.send({msg: 'Your account has been registered.'});                          
//                         })
//                         .catch(err => {
//                           console.log(err);
//                           return
//                         });
//                     });
//                   });
//                 })
            
              
            
//               });
//          }
//     } catch (error) {
//         console.log(error);
//     }
  
  
//   });

// router.post('/login', (req, res, next) => { 
//   try {
//         passport.authenticate('local', function(err, user, info){
//           if(err){return next(err);}
//           if(!user){return res.send({redirect: '/login'});}
//           req.logIn(user, function(err) {
//             if (err) { return next(err); }
//             return res.send({redirect: '/admin/createUser'});
//           });
//         })(req, res, next); 

//   } catch (error) {
//     console.log(error);
// }
   
   
// });


//  router.get("/content", isLoggedIn, function (req, res) {
//    try {
//     console.log(req.session) ;
//     res.redirect('/admin');
//    } catch (error) {
//      console.log(error)
//    }

// });

//   module.exports = router;


var express = require('express');
var router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
var LocalStrategy   = require('passport-local').Strategy;
var app = require('../app');
const { isLoggedIn } = require('../config/auth');
var channelDetails = require('../models/DeliveryCahnnel');
var nodemailer = require('nodemailer'); 
var pinglogger= require('../pingLogging');

//module import
const User = require('../models/User');




router.get('/register',isLoggedIn,function(req,res){
  try {
    console.log(req.session["passport"]["user"]) ;
    res.send()
  } catch (error) {
    res.send(403,error);
  }
});

router.post('/register', (req, res) => {
    try {
      channelDetails.findOne({"IsActive": true },function (err, products) {
        pinglogger.pingloggerSystem.info("------------------=====================----------------------")
        pinglogger.pingloggerSystem.info("We are now in get active user route ")
        if (err) return next(pinglogger.pingloggerSystem.error(err));
        console.log("user register");
        console.log(req.body);
        req.assert('PingUserName', 'Username is required').notEmpty();
        req.assert('EmailID', 'Enter a valid email address').isEmail();
        req.assert('password', 'Password must be atleast 6 charecters').isLength({ min: 6 });
        const errors = req.validationErrors();
       
        if(errors){             
           return res.send(403,errors);
            console.log(errors);
         }         
         else{
            User.findOne({
              PingUserName: req.body.PingUserName
              })
              .then(user => {
                if(user) {
                  return res.send(403, {msg: `Already a user with User Name ${req.body.PingUserName}`});
            
                }

                User.find(function(err,totaluser){
                  if(err) return next(err);
                  let count = totaluser.length + 1
                  const newUser = new User({            
                    PingUserID: "User"+ count,
                    PingUserName: req.body.PingUserName.toLowerCase(),
                    PingUserDirectory: req.body.PingUserDirectory,
                    PingUserAccess: req.body.PingUserAccess,
                    EmailID: req.body.EmailID.toLowerCase(),
                    password: req.body.password,
                    PingMemberID: req.body.PingMemberID,
                    PingGroupID: req.body.PingGroupID,
                    PingRole: req.body.PingRole,
                    InsertBy:req.body.InsertBy,
                    LoginUserID: req.body.LoginUserID
                  });
                  if(newUser.EmailID!='' && products!=null)
                  {
                    var usrmail =newUser.EmailID;
                    console.log("EmailID"+usrmail);
                   
                      console.log(products);
                      UserEmail=products.EmailUserName;
                      UserPassword=products.Password;
                      pinglogger.pingloggerSystem.info(UserEmail)
                      pinglogger.pingloggerSystem.info("User Email Credentials"+UserEmail)
                   //console.log("User EMial "+UserEmail+" PAssword "+UserPassword)
                        var mailUser = usrmail.split('@');
                        // var x;
                        // for(i=0;i<=mailUser.length;i++){
                            
                        //     x=mailUser[0];
                        // }
                        var messbody = "Hello &nbsp;"  +newUser.PingUserName+ ",<br/> You have been added to PING. The login credentials for your account are:<br><br>Username:&nbsp;"+newUser.PingUserName+"<br>Password :&nbsp;"+req.body.password+".<br><br><br> This is a system generated e-mail and please do not reply.<br><br><br>Regards,<br>"  +
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
                           return res.send({msg: 'Your account has been registered.'});                          
                        })
                        .catch(err => {
                          console.log(err);
                          return
                        });
                    });
                  });
                })
            
              
            
              });
         }
      })
        
    } catch (error) {
        console.log(error);
    }
  
  
  });

router.post('/login', (req, res, next) => { 
  try {
    console.log("Request Protocol"+req.protocol+" Reequest Headers"+JSON.stringify(req.headers,null,4));
        passport.authenticate('local', function(err, user, info){
          if(err){return next(err);}
          if(!user){return res.send({redirect: '/login',UserRole:"NotLogged"});}
          req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.send({redirect: '/pingAlert/alertInbox',UserRole:user.PingRole});
          });
        })(req, res, next); 

  } catch (error) {
    console.log(error);
}
   
   
});

router.get("/loginCount", isLoggedIn, function (req, res) {
  try {
   console.log(req.session) ;
   res.redirect('/admin');
  } catch (error) {
    console.log(error)
  }

});


 router.get("/content", isLoggedIn, function (req, res) {
   try {
    console.log(req.session) ;
    res.redirect('/admin');
   } catch (error) {
     console.log(error)
   }

});

// RETURNS ALL THE USERS IN THE DATABASE Login ID Wise
router.get('/LoginIdWise/:id', function (req, res) {
  // console.log("Login USer ID"+req.LoginUserID);
  console.log(req.params.id)
  console.log(req.LoginUserID);
   // User.findById({"LoginUserID":req.params.id}, function (err, users) {
   //     if (err) return res.status(500).send("User Not Find.");
   //     res.status(200).send(users);
   // });
   User.find({"LoginUserID":req.params.id},function(err,user){
    if(err) return res.status(500).send("user Not Found");
      res.status(200).send({"code":200,"body":user});
 
   })
 });

 // RETURNS ALL THE USERS IN THE DATABASE Login ID Wise
router.get('/UserListStatusWise/:id', function (req, res) {
  // console.log("Login USer ID"+req.LoginUserID);
  console.log(req.params.id)
  console.log(req.LoginUserID);
   // User.findById({"LoginUserID":req.params.id}, function (err, users) {
   //     if (err) return res.status(500).send("User Not Find.");
   //     res.status(200).send(users);
   // });
   User.find({"IsActive":req.params.id},function(err,user){
    if(err) return res.status(500).send("user Not Found");
      res.status(200).send({"code":200,"body":user});
 
   })
 });

 // GETS A SINGLE USER FROM THE DATABASE
router.get('/:id', function (req, res,next) {
  console.log('Here is findById Authcontroll..............')
  User.findById(req.params.id, function (err, user) {
    if (err) return next(pinglogger.pingloggerSystem.error(err));
      // if (err) return res.status(500).send("There was a problem finding the user.");
      // if (!user) return res.status(404).send("No user found.");
      res.status(200).send(user);
  });
});

// UPDATES A SINGLE USER IN THE DATABASE
// Added VerifyToken middleware to make sure only an authenticated user can put to this route
router.put('/:id', /* VerifyToken, */ function (req, res) {
  console.log('Here is update Authcontroll')
User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
if (err) return res.status(500).send("There was a problem updating the user.");
res.status(200).send(user);
});




});

// DELETES A USER FROM THE DATABASE
router.delete('/:id', function (req, res) {
  console.log('Here is Remove Authcontroll')
  User.findByIdAndRemove(req.params.id, function (err, user) {
      if (err) return res.status(500).send("There was a problem deleting the user.");
      res.status(200).send("User: "+ user.name +" was deleted.");
  });
});

router.delete('/:id', function(req, res, next) {
  console.log("DELETE User");
  // qUser.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    User.findByIdAndUpdate({_id: req.params.id}, {$set: {"IsActive":false}} , function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.get('/logout', (req, res) => { 
  try {
    console.log("In User Logout Function")
    // let sessionid = req.session['passport']['user']._id;
          //  req.logout();
        // req.logOut();
      req.session.destroy(function(err) {
        console.log(err);
          res.clearCookie('connect.sid');
          res.redirect('/');
      });
        // //req.session[""][""]
        // //console.log("after Logout Function",req)
        // req.session.destroy(function (err) {
        //   // res.redirect('/'); //Inside a callback… bulletproof!
        // });
  } catch (error) {
    console.log(error);
}
   
   
});

// RETURNS ALL THE USERS IN THE DATABASE Login ID Wise
router.get('/UserCountnew', function (req, res) {
  
  // console.log("Login USer ID"+req.LoginUserID);
   // User.findById({"LoginUserID":req.params.id}, function (err, users) {
   //     if (err) return res.status(500).send("User Not Find.");
   //     res.status(200).send(users);
   // });
   console.log("In User Count Function")
   User.find({"PingRole":'SuperAdmin'},function(err,user){
    if(err) return res.status(500).send("user Not Found");
      res.status(200).send({"code":200,"body":user});
    console.log("Super Admin"+user)
   })
 });

 router.get('/pingCount',function(req,res){
   try {
      console.log("In User Count Function")
      User.countDocuments(function(err,conutU){
      if(err) return res.status(500).send("user Not Found");
        res.status(200).send({"code":200,"body":conutU});
        console.log("Super Admin"+conutU);
      })
   } catch (error) {
     console.log(error);
   }
 
 })

 router.get('/dactiveUserCount',function(req,res){
  try {
     console.log("In User Count Function")
     User.countDocuments({"IsActive":false},function(err,conutU){
     if(err) return res.status(500).send("user Not Found");
       res.status(200).send({"code":200,"body":conutU});
       console.log("Super Admin"+conutU);
     })
  } catch (error) {
    console.log(error);
  }

})


 // RETURNS ALL THE USERS IN THE DATABASE Login ID Wise
router.get('/LoginIdWise/:id', function (req, res) {
  // console.log("Login USer ID"+req.LoginUserID);
  console.log(req.params.id)
  console.log(req.LoginUserID);
   // User.findById({"LoginUserID":req.params.id}, function (err, users) {
   //     if (err) return res.status(500).send("User Not Find.");
   //     res.status(200).send(users);
   // });
   User.find({"LoginUserID":req.params.id},function(err,user){
    if(err) return res.status(500).send("user Not Found");
      res.status(200).send({"code":200,"body":user});
 
   })
 });


 module.exports = router;