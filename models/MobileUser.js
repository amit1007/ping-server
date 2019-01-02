
var mongoose = require('mongoose');


var MobileUserSchema = new mongoose.Schema({
    Email : String,
    token : String       
   
  },{collection : 'login'});
  MobileUserSchema.set('collection','login')
  

  module.exports = mongoose.model('mobile', MobileUserSchema);
 