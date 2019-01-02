var qrsInteract = require('./qrsInstance');
var Promise = require("promise");
var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/myPingSystem');
var Test = require('./sample1');
var hypercube = require('./hyperCube');
var testhypercube = require('./hyperCube');
var testfilterHyperCube=require('./filterHyperCube');
var testdimensionHyperCube=require('./diaHypercube');
var channelToTransfer=require('./SheduledAlertMail');
var checkCondition = require('./checkCondition');
var moment = require('moment');
var inboxInsert = require("../inboxCreate");
//get url for email send....
const pingConfig=require('../../pingConfig.json')
const config = require('./testConfig');



setInterval(function () {
    getonReload();
},300000);


function getonReload(){
    Test.findtblalert(function(err, sample){
        if(err){
            throw err;
        }
        else{
            if(sample.length>0)
            {       
            
            
            
       var dbappid =[];
       var qlikUser = [];
    
        var hypercube1 =[];
        var hypercube2 =[];
        var filterhypercube1 =[];
        var filterhypercube2 =[];
        var dimensionhypercube1 =[];
        var dimensionhypercube2 =[];
// console.log(sample);
        //set onreload appid and user..
        for(let i=0;i<sample.length;i++){  
             
                 var x=  sample[i].frmCntApplication.Appid ;
                 var userId =  sample[i].InsertBy;              
                 dbappid.push(x);                                
                 qlikUser.push(userId);                         
        }

        //filter qlik-sense user 
        qlikUser = qlikUser.filter( function( item, index, inputArray ) {
            return inputArray.indexOf(item) == index;
        });

        console.log(qlikUser);
      
        var startdate = moment.utc().subtract(5, "minutes").format("YYYY-MM-DDTHH:mm:ss");
        
        console.log(startdate);
        // console.log(dbappid);
        var path = "/notification/changes?since="+startdate+"&types=executionResult";
        qrsInteract.Get(path)
           .then(result => {

               console.log("Total Count....");
               console.log(result.body.length);
               
               
               return Promise.all(result.body.map(doc=>{  
                           if(doc['object'] != null){
                               if( doc['object'].status == 7){            
                                   
                                   return getExecution(doc.id,dbappid,sample);
                               }
                           }             
               }))
               .then(function(x){
                  var filterID =[];
                   mesIs= false; 
                   filterIs =false;
                   dimensionIs =false;
                   var filterAppID = x.filter(function(item,index,array){
                       return array.indexOf(item) === index ;
                   })
                   console.log(filterAppID);
                   console.log(dbappid);
                   for(let i=0;i<=filterAppID.length;i++){
                       var xy=  dbappid.map((val,index)=>[index,val==filterAppID[i]]).filter(x=>x[1]).map(q=>q[0]);
                      if(xy.length != 0){
                           filterID.push(xy);
                      }
                   }
                                  
                   for(let j=0;j<filterID.length;j++){  
                        var hyper ={};  
                       var filterhyper={};
                       var dimensionhyper={}; 
                       mesIs= false; 
                       filterIs =false; 
                       dimensionIs=false;
                       // hypercube1=[];       
                       for(let k=0;k<filterID[j].length;k++){
                        
                           console.log(filterID[j][k]); 
                           if( Object.keys(sample[filterID[j][k]].frmCntMeasures).length != 0 && Object.keys(sample[filterID[j][k]].frmCntLoopDiamention).length == 0 && Object.keys(sample[filterID[j][k]].frmCntFieldValue.Field).length == 0 ){
                               mesIs= true;
                               hyper={ 
                                   userID : sample[filterID[j][k]].InsertBy,                                  
                                   index:filterID[j][k],                              
                                   appid:sample[filterID[j][k]].frmCntMeasures.Appid,
                                   qdef:sample[filterID[j][k]].frmCntMeasures.pingMeasuresqDef
                                   }  
                                   hypercube1.push(hyper);  
                           }

                       //   For Loop Diamention
                           else if( Object.keys(sample[filterID[j][k]].frmCntMeasures).length != 0 && Object.keys(sample[filterID[j][k]].frmCntLoopDiamention).length != 0 && Object.keys(sample[filterID[j][k]].frmCntFieldValue.Field).length == 0 ){
                               dimensionIs = true;
                               dimensionhyper={
                                   userID : sample[filterID[j][k]].InsertBy,
                                   index:filterID[j][k],                              
                                   appid:sample[filterID[j][k]].frmCntMeasures.Appid,
                                   qdefM:sample[filterID[j][k]].frmCntMeasures.pingMeasuresqDef,
                                   qdefD:sample[filterID[j][k]].frmCntLoopDiamention.diamention.pingDiamentionData
                               }; 
                               dimensionhypercube1.push(dimensionhyper);
                               
                           }

                           //For Filter Value
                           else if( Object.keys(sample[filterID[j][k]].frmCntMeasures).length != 0 && Object.keys(sample[filterID[j][k]].frmCntLoopDiamention).length == 0 && Object.keys(sample[filterID[j][k]].frmCntFieldValue.Field).length != 0 ){
                               filterIs =true;
                               filterhyper={   
                                       userID : sample[filterID[j][k]].InsertBy,                                   
                                       index:filterID[j][k],
                                       appid:sample[filterID[j][k]].frmCntMeasures.Appid,
                                       qdefM:sample[filterID[j][k]].frmCntMeasures.pingMeasuresqDef,
                                       filterSelected:sample[filterID[j][k]].frmCntFieldValue.selectedFieldValue                             
                                   }
                                   filterhypercube1.push(filterhyper);
                           }                              
                           
                       }       
                   } 

                   // console.log(hypercube1); 
                   console.log("mesIs---"+mesIs); 
                   console.log("filterIs---"+filterIs); 
                   console.log("dimensionIs---"+dimensionIs);
                   // Get Value and trigger alert
                   let qliksense_url = "https://" + config.engine.hostname ; 
                   if(mesIs === true){
                        console.log("In Measures...");                      
                       var listOfMeasuresUserWise =  [] ;
                        for(let i=0;i< qlikUser.length;i++){
                            console.log(qlikUser[i]);
                            var abc =  hypercube1.map((val,index)=>[index,val.userID == qlikUser[i]]).filter(x=>x[1] ).map(q=>q[0]);
                           if(abc.length != 0){
                               let uData = [] ;
                                abc.map( hypIndex =>{
                                    uData.push(hypercube1[hypIndex]);
                                }) 
                                listOfMeasuresUserWise.push(uData);                              
                           }
                        }

                       for(let q = 0 ;q< listOfMeasuresUserWise.length ; q++ ){                                  
                                testhypercube(listOfMeasuresUserWise[q],function(res){
                                    try {
                                        console.log(res);
                                        var setSheduleDate = moment.utc().local().format('YYYY-MM-DD HH:mm:ss');
                                        var cond = sample[res.index].frmCntCondition=="equalto"?"Equal To":sample[res.index].frmCntCondition=="lessthan"?"Less Than":sample[res.index].frmCntCondition=="greaterthan"?"Greater Than":sample[res.index].frmCntCondition=="lessthanorequalto"?"Less Than or Equal To":sample[res.index].frmCntCondition=="greaterthanorequalto"?"Greater Than or Equal To":"NaN";
                                        let mob = sample[res.index].frmCntMobileUser === "" ? "s":sample[res.index].frmCntMobileUser;
                                        console.log(mob);
                                        var currentValue = sample[res.index].frmCntCurrentValue ;
                                        var condition = sample[res.index].frmCntCondition=="equalto"?"==":sample[res.index].frmCntCondition=="lessthan"?"<":sample[res.index].frmCntCondition=="greaterthan"?">":sample[res.index].frmCntCondition=="lessthanorequalto"?"<=":sample[res.index].frmCntCondition=="greaterthanorequalto"?">=":"NaN";
                                        var triggerSetVal = sample[res.index].frmCntFunction;
                                        console.log(currentValue);
                                        console.log(condition);
                                        console.log(triggerSetVal);
                                        var mess ={
                                            alertID:sample[res.index].frmCntAlertID,
                                            userMail:sample[res.index].frmCntRecipient,
                                            alertname : sample[res.index].frmCntAlertName,
                                            AppicationName : sample[res.index].frmCntApplication.AppName,
                                            Measures :sample[res.index].frmCntMeasures.pingMeasuresqLabel,
                                            triggeredHistory:[{"triggeredDate":setSheduleDate,"Value": sample[res.index].frmCntCurrentValue},{"triggeredDate":setSheduleDate,"Value":res.measuresValue}],
                                            PreviousValue :sample[res.index].frmCntCurrentValue,
                                            CurrentValue: res,
                                            threshold:cond + " " + triggerSetVal,
                                            triggerTime :setSheduleDate,
                                            mobileStatus : 0,
                                            diamentionStatus:0,
                                            qliksenseurl :{
                                                pinghostname:"http://"+pingConfig.serverip,
                                                hostname : qliksense_url,
                                                appid: sample[res.index].frmCntApplication.Appid,
                                                appname: sample[res.index].frmCntApplication.AppName
                                            },
                                            LogginUserID:sample[res.index].UserID,
                                            token :mob  
                                        }
                                        // checkCondition.condition(condition,currentValue,triggerSetVal,res.measuresValue);
                                        var toggle = checkCondition.condition(condition,currentValue,triggerSetVal,res.measuresValue);
                                        if(toggle===true){
        
                                                
                                                    inboxInsert.CreateHistory(mess, function(err, sample){
                                                        if(err){
                                                            console.log(err);
                                                        }
                                                        channelToTransfer.mail("measures",mess); 
                                                        if(mob!="s"){
                                                            channelToTransfer.mobNotify(mess); 
                                                        }                                        
                                                                                                    
                                                    });
                                                    
                                        }
                                        else{
        
                                        }
                                    } catch (error) {
                                        console.log(error);
                                    }
                            
                                })
                         }
                       
                    
                     
                   }
                   if(filterIs === true){
                        console.log("In filter...");
                        console.log(filterhypercube1);
                        var listOffilterUserWise =  [] ;
                        for(let i=0;i< qlikUser.length;i++){
                            console.log(qlikUser[i]);
                            var abc =  filterhypercube1.map((val,index)=>[index,val.userID == qlikUser[i]]).filter(x=>x[1] ).map(q=>q[0]);
                           if(abc.length != 0){
                               let uData = [] ;
                                abc.map( hypIndex =>{
                                    uData.push(filterhypercube1[hypIndex]);
                                }) 
                                listOffilterUserWise.push(uData);                              
                           }
                        }

                        for(let q = 0 ;q< listOffilterUserWise.length ; q++ ){                             
                                testfilterHyperCube(listOffilterUserWise[q],function(res){
                                    try {
                                        var setSheduleDate = moment.utc().local().format('YYYY-MM-DD HH:mm:ss');
                                        console.log("Filter result...")
                                        console.log("Alert ID:--"+sample[res.index].frmCntAlertID)
                                        console.log(res);
                                    var cond =sample[res.index].frmCntCondition=="equalto"?"Equal To":sample[res.index].frmCntCondition=="lessthan"?"Less Than":sample[res.index].frmCntCondition=="greaterthan"?"Greater Than":sample[res.index].frmCntCondition=="lessthanorequalto"?"Less Than or Equal To":sample[res.index].frmCntCondition=="greaterthanorequalto"?"Greater Than or Equal To":"NaN";
                                    let mob = sample[res.index].frmCntMobileUser === "" ? "s":sample[res.index].frmCntMobileUser;
                                    console.log(mob);
                                        var currentValue = sample[res.index].filterValue ;
                                        var condition = sample[res.index].frmCntCondition=="equalto"?"==":sample[res.index].frmCntCondition=="lessthan"?"<":sample[res.index].frmCntCondition=="greaterthan"?">":sample[res.index].frmCntCondition=="lessthanorequalto"?"<=":sample[res.index].frmCntCondition=="greaterthanorequalto"?">=":"NaN";
                                        var triggerSetVal = sample[res.index].frmCntFunction;
                                        console.log(currentValue);
                                        console.log(condition);
                                        var  z="";
                                        if(Array.isArray(sample[res.index].frmCntFieldValue.selectedFieldValue)){
                                        
                                            var selectedFilter = sample[res.index].frmCntFieldValue.selectedFieldValue
                                        
                                            let y = selectedFilter.forEach(a=>{
                                                try {       
                                                    z = z + a.Field + "/" ;
                                                    a.Value.forEach((v,i,a)=>{
                                                        z =z + v + "/" 
                                                    })
                                                } catch (error) {
                                                    console.log(error);
                                                }
                                            
                                            })
                                        }
                                        
                                    
                                        var mess ={
                                            alertID:sample[res.index].frmCntAlertID,
                                            userMail:sample[res.index].frmCntRecipient,
                                            alertname : sample[res.index].frmCntAlertName,
                                            AppicationName : sample[res.index].frmCntApplication.AppName,
                                            Measures :sample[res.index].frmCntMeasures.pingMeasuresqLabel,
                                            triggeredHistory:[{"triggeredDate":setSheduleDate,"Value": sample[res.index].frmCntCurrentValue},{"triggeredDate":setSheduleDate,"Value":res.measuresValue}],
                                            PreviousValue :sample[res.index].filterValue,
                                            filtersetField : sample[res.index].frmCntFieldValue.selectedFieldValue,
                                            CurrentValue: res,
                                            threshold:cond + " " + triggerSetVal,
                                            triggerTime :setSheduleDate,
                                            mobileStatus : 0,
                                            diamentionStatus:0,
                                            qliksenseurl :{
                                                pinghostname:"http://"+pingConfig.serverip,
                                                hostname : qliksense_url,
                                                appid: sample[res.index].frmCntApplication.Appid,
                                                appname: sample[res.index].frmCntApplication.AppName,
                                                filtersetField :sample[res.index].frmCntFieldValue.selectedFieldValue,
                                                selectionUrlString : z
                                            },
                                            LogginUserID:sample[res.index].UserID,
                                            token :mob                         
                                        }
                                        // checkCondition.condition(condition,currentValue,triggerSetVal,res.measuresValue);
                                        var toggle = checkCondition.condition(condition,currentValue,triggerSetVal,res.measuresValue);
                                        if(toggle===true){
                                            
                                                inboxInsert.CreateHistory(mess, function(err, sample){
                                                    if(err){
                                                        console.log(err);
                                                    }
                                                    channelToTransfer.mail("filter",mess); 
                                                
                                                    if(mob!="s"){
                                                        channelToTransfer.mobNotify(mess); 
                                                    } 
                                                
                                                });                                                               
                                        }
                                        else{
                                            console.log("Condition Fails....");
                                        }
                                    
                                    } catch (error) {
                                        console.log(error);
                                    }
                                
                                });
                         }
                   }
                   if(dimensionIs === true){
                       console.log("In dimesion...");
                       console.log(dimensionhypercube1);
                       var listOfdimentionUserWise =  [] ;
                       for(let i=0;i< qlikUser.length;i++){
                           console.log(qlikUser[i]);
                           var abc =  dimensionhypercube1.map((val,index)=>[index,val.userID == qlikUser[i]]).filter(x=>x[1] ).map(q=>q[0]);
                          if(abc.length != 0){
                              let uData = [] ;
                               abc.map( hypIndex =>{
                                   uData.push(dimensionhypercube1[hypIndex]);
                               }) 
                               listOfdimentionUserWise.push(uData);                              
                          }
                       }

                       for(let q = 0 ;q< listOfdimentionUserWise.length ; q++ ){
                                testdimensionHyperCube(listOfdimentionUserWise[q],function(res){
                                    try {
                                        console.log("dimension value result");
                                        var setSheduleDate = moment.utc().local().format('YYYY-MM-DD HH:mm:ss');
                                        console.log(res);
                                        var indexNo = 0;
                                        if(Array.isArray(res)){
                                            indexNo = res[0].index;
                                            var cond = sample[indexNo].frmCntCondition=="equalto"?"Equal To":sample[indexNo].frmCntCondition=="lessthan"?"Less Than":sample[indexNo].frmCntCondition=="greaterthan"?"Greater Than":sample[indexNo].frmCntCondition=="lessthanorequalto"?"Less Than or Equal To":sample[indexNo].frmCntCondition=="greaterthanorequalto"?"Greater Than or Equal To":"NaN";
                                            let mob = sample[indexNo].frmCntMobileUser === "" ? "s":sample[indexNo].frmCntMobileUser;
                                            console.log(mob);
                                            var currentValue = sample[indexNo].frmCntCurrentValue ;
                                            var condition = sample[indexNo].frmCntCondition=="equalto"?"==":sample[indexNo].frmCntCondition=="lessthan"?"<":sample[indexNo].frmCntCondition=="greaterthan"?">":sample[indexNo].frmCntCondition=="lessthanorequalto"?"<=":sample[indexNo].frmCntCondition=="greaterthanorequalto"?">=":"NaN";
                                            var triggerSetVal = sample[indexNo].frmCntFunction;
                                            //  console.log(currentValue);
                                            console.log(condition);
                                            console.log(triggerSetVal);
                                            var matchElement = res.filter(function(item,index,array){
                                            
                                                switch(condition){
                                                    case ">"  :
                                                    return item.qNum  > triggerSetVal ;
                                                    break;
                                                    case "<":
                                                        return item.qNum < triggerSetVal ;
                                                        break;
                                                    case ">=":
                                                        return item.qNum >= triggerSetVal ;
                                                    break;
                                                    case "<=":
                                                        return item.qNum  <= triggerSetVal ;
                                                    break;
                                                    case "==":
                                                        return item.qNum == triggerSetVal ;
                                                    break;
                                                }
                                            
                                            });
                                            console.log(sample[indexNo].diamentionValue);
                                            console.log("In dimension HyperCube....");
                                            var mess ={
                                                alertID:sample[indexNo].frmCntAlertID,
                                                userMail:sample[indexNo].frmCntRecipient,
                                                alertname : sample[indexNo].frmCntAlertName,
                                                AppicationName : sample[indexNo].frmCntApplication.AppName,
                                                Measures :sample[indexNo].frmCntMeasures.pingMeasuresqLabel,
                                                triggeredHistory:[{"triggeredDate":startdate,"Value": sample[indexNo].frmCntCurrentValue},{"triggeredDate":setSheduleDate,"Value":res.measuresValue}],
                                                PreviousValue :sample[indexNo].diamentionValue,
                                                threshold:cond +' '+ sample[indexNo].frmCntFunction,
                                                triggerTime : setSheduleDate,
                                                // setTime : datetime
                                                CurrentValue: matchElement,
                                                mobileStatus : 0,
                                                diamentionStatus:1,
                                                qliksenseurl :{
                                                            pinghostname:"http://"+pingConfig.serverip,
                                                            hostname : qliksense_url,
                                                            appid: sample[indexNo].frmCntApplication.Appid,
                                                                appname: sample[indexNo].frmCntApplication.AppName,
                                                            diamention:sample[indexNo].frmCntLoopDiamention.diamention.pingDiamentionData
                                                },
                                                LogginUserID:sample[indexNo].UserID,
                                            
                                                token :mob
                                                                    
                                            }
                                            inboxInsert.CreateHistory(mess, function(err, sample){
                                                if(err){
                                                    console.log("error history Alert....");
                                                    pinglogger.pingloggerSystem.error(err);
                                                }
                                                channelToTransfer.mail("dimension",mess);
                                                if(mob!="s"){
                                                    channelToTransfer.mobNotify(mess);
                                                }                                          
                                                console.log("saved history Alert....");
                                            
                                            });
                                            console.log(mess);
                                        }
                                    } catch (error) {
                                        console.log(error);
                                        
                                    }
                        
                                
                                })
                    
                       }
                      
                   }
               });
           })
        }

    } 
   
})

  
}



function getExecution(sessionid,dbappid,sample){

    // var dbOnReload = new Promise


    var path = "/executionresult/full?filter=ID eq "+sessionid+"";
  return  qrsInteract.Get(path)
        .then(result => {

            return result.body[0].appID;
        })
       
    
}

function getdbOnReload(){
    Test.findtblalert(function(err, sample){
        if(err){
            throw err;
        }   
        else{
            // console.log(sample);
            return sample
          
        }

       
    });
}
