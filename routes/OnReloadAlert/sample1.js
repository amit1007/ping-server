var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema

var tblsetalertSchema = new Schema({
    createalertID : String,
    frmCntAlertID : String,
    frmCntAlertName : String,
    frmCntDelivertTo : String,
    frmCntRecipient : String,
    frmCntMobileUser:{},
    frmCntDataSource:String,
    frmCntApplication : {},
    frmCntMeasures : {},
    frmCntCurrentValue :String,
    frmCntCondition :String,
    condition : String,
    frmCntFunction :String,
    conditionSetValue : String ,
    currenttriggerSetValue  :String,
    frmCntLoopDiamention : {},
    diamentionValue:[],
    filterValue:String,
    frmCntFieldValue:{},
    frmCntTrigger :String,
    frmGrpShedules:{},
    UserID:String,
    InsertBy : String,     
    UpdatedBy :String,
    trigger : { type: Boolean, default: true } ,
    alertsetTime : { type: Date, default: new Date() }
    
},  { collection: 'tblsetalerts' }
);
tblsetalertSchema.set('collection', 'tblSetAlerts');

// the schema is useless so far
// we need to create a model using it
var Test = module.exports = mongoose.model('test', tblsetalertSchema);

module.exports.findtblalert = function(callback){
    //console.log(phoneNum);
    Test.find({frmCntTrigger : "onReload",trigger:true,IsActive:true},callback)
}
