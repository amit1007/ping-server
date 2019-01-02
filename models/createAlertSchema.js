var mongoose = require('mongoose');
var mydate = require('current-date');

// console.log('Time is  ',cnow)
var CreateAlertSchema = new mongoose.Schema({
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
            frmCntNumberformat:String,
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
            InsertBy:String,
            qliksenseUserID:String,
            UpdatedBy :String,
            trigger : { type: Boolean, default: true } ,
            alertsetTime : { type: Date, default: mydate },
            IsActive:{type:Boolean,default:true}

},{collection : 'tblSetAlerts'});
CreateAlertSchema.set('collection','tblSetAlerts')
module.exports = mongoose.model('api', CreateAlertSchema);

