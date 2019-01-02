var mongoose = require('mongoose');
 
var pingUserSchema = mongoose.Schema({
    PingUserID :  {
        type: String,
        required: true
    },
    PingUserName :  {
        type: String,
        required: true
    },
    PingUserDirectory :  {
        type: String,
        required: true
    },
    PingUserAccess :  {
        type: String,
        required: true
    },
    password :  {
        type: String,
        required: true
    },
    PingMemberID : String,
    PingGroupID : String,
    PingRole : String,
    EmailID : {
        type: String,
        required: true
    },
    LoginUserID: {
        type: String,
        required: true
    },
    InsertDate :{ 
        type: Date,
        default: Date.now
    },
    UpdateDate :{ 
        type: Date,
        default: Date.now
    },
    
}, { collection: 'PingUsersRole' });

pingUserSchema.set('collection', 'PingUsersRole');
 
var PingUser = mongoose.model('PingUsersRole', pingUserSchema);
 
module.exports = PingUser;