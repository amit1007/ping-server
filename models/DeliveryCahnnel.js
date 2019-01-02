var mongoose = require('mongoose');
var mydate = require('current-date');

var DeliveryChannel = new mongoose.Schema({
    DeliveryChannelID: String,
    DeliveryChannelName: String,   
    DeliveryChannelType:String,
    Address:String,
    PortNo:String,
    SecurityLayerID:String,
    EmailUserName:String,
    Password:String,
    DefaultSenderEmail:String,    
    LoginUserID:String,
    InsertBy :{ type: String, default: "Qlik Admin" }, 
    InsertDate :{ type: Date, default: mydate }, 
    UpdateBy : { type: String, default: "Qlik Admin" }, 
    DeviceName:String,
    APIKey:String,
    SenderKey:String,
    Server:String,
    

    UpdateDate :{ type: Date, default: mydate } ,
    IsActive:{type:Boolean,default:true}

    //IsActive:String
}, { collection: 'ChannelTypeDetails' });
DeliveryChannel.set('collection', 'DeliveryChannel');

module.exports = mongoose.model('DeliveryCahnnel', DeliveryChannel);