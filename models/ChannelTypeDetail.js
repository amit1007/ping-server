var mongoose = require('mongoose');
var mydate = require('current-date');
var CreateChannelType = new mongoose.Schema({
    ChannelTypeID: String,
    ChannelTypeName: String,   
    InsertBy :{ type: String, default: "Qlik Admin" }, 
    InsertDate :{ type: Date, default: mydate }, 
    UpdateBy : { type: String, default: "Qlik Admin" }, 
    UpdateDate :{ type: Date, default: mydate } ,
    LoginUserID:String,
    IsActive:{ type: Boolean, default: true },
}, { collection: 'ChannelTypeDetails' });
CreateChannelType.set('collection', 'ChannelTypeDetails');

module.exports = mongoose.model('ChannelTypeDetails', CreateChannelType);