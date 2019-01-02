var mongoose = require('mongoose');

var CreateLocation = new mongoose.Schema({
   
    timeZoneLocation: String,
    prefferdChanel : String,
    timeZoneId : String,
    InsertBy : String, 
    InsertDate :{ type: Date, default: Date.now }, 
    IsActive:Boolean
}, { collection: 'UserLocation' });
CreateLocation.set('collection', 'UserLocation');

module.exports = mongoose.model('LocationDetails', CreateLocation);