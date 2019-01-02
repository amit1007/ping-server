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

//Result Integer value

//0 -Not Applicatble
//1 -Active
//2 -Expired
//3 -Abort
//4 -Expired
//5 -Key Created
//6- Key not exits

var states = {
   NotApplicable:0,   
    Active:1,
    LicenseExpired:2,
    Abort:3,
    Expired:3,
    KeyCreated:5,
    Keynotexits:6,
    KeyExits:7,
    KeyAdded:8,
    CounterExeed:9
};


module.exports={
                    // var registrationDate=moment().format('YYYY-MM-DD HH:mm:ss')

                    //-----------------------------------<Create Reg Key>--------------------------------------------------
                    //----------------------------------------<Start>-------------------------------------------------------

                     CreateRegisterKey :function(abc,callback){
                        regedit.list(['HKCU\\SOFTWARE'])
                        .on('data', function(entry) {
                            console.log("In")
                            // console.log(entry.data.keys)
                            var output = entry.data.keys.filter(function(value){ return value=="Ping";})
                            if(output.length>0)
                            {
                                console.log("Key already Exist")
                                callback({mesage:states.KeyExits})
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
                                    callback({mesage:states.KeyCreated})
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
                    },

                    //-----------------------------------------<END>--------------------------------------------------------
                    //-----------------------------------<Create Reg Key>--------------------------------------------------



                    // //-------------------------------<Put values into Reg Key>----------------------------------------------
                    // //----------------------------------------<Start>-------------------------------------------------------




                    // console.log(registrationDate)
                    // regedit.list(['HKCU\\SOFTWARE'])
                    // .on('data', function(entry) {
                    //     console.log("In")
                    //     console.log(entry.data.keys)
                    //     var output = entry.data.keys.filter(function(value){ return value=="Ping";})
                    //     if(output.length>0)
                    //     {
                    //         var valuesToPut = {
                    //             'HKCU\\Software\\Ping': {
                    //                 'E1': {
                    //                     value: registrationDate,
                    //                     type: 'REG_SZ'
                    //                 },
                    //                 'E2': {
                    //                     value: licenseCounter,
                    //                     type: 'REG_SZ'
                    //                 },
                    //                 'Status': {
                    //                     value: licenseStatus,
                    //                     type: 'REG_SZ'
                    //                 }
                    //             }
                                
                    //         }
                            
                    //         regedit.putValue(valuesToPut, function(err) {
                    //             console.log('added in regedit')
                    //         })
                            
                    //     }
                    //     else
                    //     {

                    //         console.log("Key does not Exist")
                    //     }
                    //     console.log(output,"output")
                    // })
                    // .on('finish', function () {
                    //     console.log('list operation finished')
                    // })

                    // //-----------------------------------------<END>--------------------------------------------------------
                    // //-------------------------------<Put values into Reg Key>----------------------------------------------




                    //------------------------<Date checker and counter increamenter>---------------------------------------
                    //----------------------------------------<Start>-------------------------------------------------------

                     DateChecker:function(abc,callback){
                        regedit.list(['HKCU\\SOFTWARE'])
                        .on('data', function(entry) {
                            console.log("In")
                            console.log(entry.data.keys)
                            var output = entry.data.keys.filter(function(value){ return value=="Ping";})
                            if(output.length>0)
                            {                        
                            regedit.list(['HKCU\\SOFTWARE\\Ping'])
                                .on('data', function(entry) {
                            // console.log(JSON.stringify(entry.key,null,4))
                            console.log(JSON.stringify(entry.data,null,4))
                            
                        
                        
                            // console.log(dDate)
                             dDate=parseInt(entry.data.values.E1.value)
                             E1Value=moment(dDate).format('DD/MM/YYYY')
                             counterValue=parseInt(entry.data.values.E2.value)
                             statusValue=entry.data.values.Status.value
                             currdate=moment().format('DD/MM/YYYY')
                             console.log("Counter Value"+counterValue)
                             expiryDate= moment.utc().add(dayCounter, "day").format("DD/MM/YYYY");
                             console.log("expiry Date is  "+expiryDate)
                             
                            if(E1Value===currdate)//(moment(1540358146778).format('DD/MM/YYYY')))
                                {
                            console.log(E1Value,"matched",currdate)
                             callback({LicenceStatus:statusValue,InstallationDate:E1Value,CounterValue:counterValue,CurrentDate:currdate,DayCounter:dayCounter,ExpiryDate:expiryDate,DaysRemaining:dayCounter})
                                }
                        else
                        {
                            console.log(E1Value,"Increament Counter",currdate)
                        
                            counterValue++
                            RemainingDays=dayCounter-counterValue;
                            console.log("REmaining Days"+RemainingDays)
                            if(RemainingDays<0)
                            {
                                RemainingDays=0;
                            }
                            console.log(counterValue,"counter value")
                            if (counterValue===dayCounter)
                                statusValue=states.LicenseExpired
                            
                            licenseCounter=counterValue
                            licenseStatus=statusValue
                            console.log(statusValue,"Status Value")
                            callback({LicenceStatus:statusValue,InstallationDate:E1Value,CounterValue:counterValue,CurrentDate:currdate,DayCounter:dayCounter,ExpiryDate:expiryDate,DaysRemaining:RemainingDays})
                            // callback({LicenceStatus:statusValue})
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
                                console.log('Changed Counter Value')
                            })
                        }
                        })
                        .on('finish', function () {
                            // console.log('list operation finished')
                        })
                            }
                        
                            else
                            {
                                console.log("Key does not Exist")
                                // callback({LicenceStatus:"Licence Is not Applied"})
                                callback({LicenceStatus:statusValue,InstallationDate:E1Value,CounterValue:counterValue,CurrentDate:currdate,DayCounter:dayCounter,ExpiryDate:expiryDate,DaysRemaining:RemainingDays})
                            }
                        })
                        return callback;
                    }


                    //-----------------------------------------<END>--------------------------------------------------------
                    //------------------------<Date checker and counter increamenter>---------------------------------------
                }