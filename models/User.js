var mongoose = require('mongoose');
var mydate = require('current-date');

var CreateUser = new mongoose.Schema({
    PingUserID: String,
    PingUserName: String,
    PingUserDirectory : String,
    PingUserAccess : String, 
    PingMemberID : String, 
    PingGroupID : String, 
    PingRole : String,
    EmailID:String,
    password:String, 
    LoginUserID:String,
    InsertBy : String, 
    InsertDate :{ type: Date, default: mydate }, 
    UpdateBy : String, 
    UpdateDate :{ type: Date, default: mydate },
    IsActive:{type:Boolean,default:true}
}, { collection: 'PingUsersRole' });
CreateUser.set('collection', 'PingUsersRole');

module.exports = mongoose.model('User', CreateUser);