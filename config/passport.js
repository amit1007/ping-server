const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
//module import
const User = require('../models/User');
var app = require('../app');

// passport needs ability to serialize and unserialize users out of session
passport.serializeUser(function (user, done) {
    return done(null, user);
  });
  
  passport.deserializeUser(function (id, done) {
  //  console.log("id");  console.log(id);
    User
      .findById(id, function (err, user) {
       // console.log(user);
        done(err, user);
      });
  });
  

  // passport local strategy for local-login, local refers to this app
  passport.use(new LocalStrategy({
    usernameField: 'PingUserName'
  }, function (user, password, done) {
   
    User
      .findOne({
        PingUserName: user
    })
      .then(user => {         
        if (!user) {
          return done(null, false, {message: `No user found  ${user}`});
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) 
            throw err;
          if (isMatch) {
            console.log("isMatch");
            return done(null, user)
          } else {
            console.log("Not Match");
            return done(null, false, {message: 'Incorrect password'});
          }
        });
      });
  }));