var mongoose = require('mongoose');
var mydate = require('current-date');

var CreateChannelName = new mongoose.Schema({
    ChannelID: String,
    ChannelName: String,   
    InsertBy :{ type: String, default: "Qlik Admin" }, 
    InsertDate :{ type: Date, default: mydate }, 
    UpdateBy : { type: String, default: "Qlik Admin" }, 
    UpdateDate :{ type: Date, default: mydate }, 
    LoginUserID:{type:String}
    //IsActive:String
}, { collection: 'ChannelDetails' });
CreateChannelName.set('collection', 'ChannelDetails');

module.exports = mongoose.model('ChannelName', CreateChannelName);

