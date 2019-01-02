var regedit = require('regedit')

var moment = require('moment');
var registrationDate=moment().valueOf(moment());
var licenseCounter=0
var licenseStatus='active'
var dayCounter=5
var dDate;
var E1Value;
var expiryDate;
var RemainingDays="0";
var counterValue;
var statusValue;
var currdate;
module.exports={
    CreateRegisterKey :function(abc,callback){
        regedit.list(['HKCU\\SOFTWARE'])
        .on('data', function(entry) {
            console.log("In")
            // console.log(entry.data.keys)
            var output = entry.data.keys.filter(function(value){ return value=="Ping";})
            if(output.length>0)
            {
               
                console.log("Key already Exist")
                var valuesToPut = {
                    'HKCU\\Software\\Ping': {
                        'E1': {
                            value: registrationDate,
                            type: 'REG_SZ'
                        },
                        'E2': {
                            value: licenseCounter,
                            type: 'REG_SZ'
                        },
                        'Status': {
                            value: licenseStatus,
                            type: 'REG_SZ'
                        }
                    }
                    
                }

                // dDate=parseInt(entry.data.values.E1.value)
                E1Value=moment(dDate).format('DD/MM/YYYY')
                // counterValue=parseInt(entry.data.values.E2.value)
                // statusValue=entry.data.values.Status.value
                // currdate=moment().format('DD/MM/YYYY')
                // expiryDate= moment.utc().add(counterValue, "day").format("YYYY/MM/DD"); 

                regedit.putValue(valuesToPut, function(err) {
                    console.log('added in regedit')
                    // callback({mesage:states.KeyCreated})
                })
                callback({LicenceStatus:statusValue,InstallationDate:E1Value,CounterValue:counterValue,CurrentDate:currdate,DayCounter:dayCounter,ExpiryDate:expiryDate,DaysRemaining:counterValue})
            }
            else
            {
        
                console.log("Create Key")
                regedit.createKey([ 'HKCU\\SOFTWARE\\Ping'], function(err) {
            if (!err) {
                //-------------------------------<Put values into Reg Key>----------------------------------------------
                //----------------------------------------<Start>-------------------------------------------------------
                var valuesToPut = {
                    'HKCU\\Software\\Ping': {
                        'E1': {
                            value: registrationDate,
                            type: 'REG_SZ'
                        },
                        'E2': {
                            value: licenseCounter,
                            type: 'REG_SZ'
                        },
                        'Status': {
                            value: licenseStatus,
                            type: 'REG_SZ'
                        }
                    }
                    
                }
                
                regedit.putValue(valuesToPut, function(err) {
                    console.log('added in regedit')
                    // callback({mesage:states.KeyCreated})
                })
        
                
        //-----------------------------------------<END>--------------------------------------------------------
        //-------------------------------<Put values into Reg Key>----------------------------------------------
                console.log("key added in registry")
            } else {
                console.log(err)
            }
        })
            }
            console.log(output,"output")
        })
        .on('finish', function () {
            console.log('list operation finished')
        })
        return callback;
    }
}
