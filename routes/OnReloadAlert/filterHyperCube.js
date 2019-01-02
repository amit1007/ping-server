var qsocks = require('qsocks');
var fs = require('fs');
var request = require('request');
var Promise = require("promise");
var DataSourceEdit = require('../../models/DataSourceEdit');

//globle
var using_defaults = true;
var server_address = '';
var user_directory = '';
var user_name = '';
var origin = '';
var single_app = false;
var single_app_id = ''

var Matrix = function (arrObj,callback){
          console.log("filter Qdef");
          
          DataSourceEdit.findOne({dataSourceId:"01"},function(err,qlikConnectionInfo){
            var dinamicCertificates= require('../../dynamicCertificate');
            let client_pfx=dinamicCertificates.client_pfx
            var server_certificate =client_pfx;
           if(qlikConnectionInfo === null){
                     server_address = 'ec2-54-159-166-242.compute-1.amazonaws.com';                
                     user_directory = 'QLIK-SENSE';
                     user_name = 'om1';
                     origin = 'qlik-sense';
                     single_app = false;
                     single_app_id = ''
           }
           else{
                    server_address = qlikConnectionInfo.hostname != "" ? qlikConnectionInfo.hostname : 'ec2-34-201-37-215.compute-1.amazonaws.com';                
                    user_directory = qlikConnectionInfo.userdirectory;
                    //user_name = qlikConnectionInfo.hostname;
                    origin = qlikConnectionInfo.userdirectory;
                    single_app = false;
                    single_app_id = ''
           }

           var connection_data = {
            server_address : server_address,
            server_certificate : server_certificate,   
            user_directory : user_directory,
            user_name : arrObj[0].userID,
            origin : origin,
            single_app_id: single_app_id
        }
        
        //Request defaults
        var r = request.defaults({
            rejectUnauthorized: false,
            host: connection_data.server_address,
            pfx: fs.readFileSync(connection_data.server_certificate),
            passphrase: '123'
        })
        
        //Authenticating the user
        var b = JSON.stringify({
            "UserDirectory": connection_data.user_directory,
            "UserId": connection_data.user_name,
            "Attributes": []
        });
        
        var u = 'https://'+connection_data.server_address+':4243/qps/ticket?xrfkey=abcdefghijklmnop';
        var x = {};
 
        r.post({
            uri: u,
            body: b,
            headers: {
            'x-qlik-xrfkey': 'abcdefghijklmnop',
            'content-type': 'application/json'
            }
        },
        function(err, res, body) {
    
            var hub = 'https://'+connection_data.server_address+'/hub/?qlikTicket=';
            var ticket = JSON.parse(body)['Ticket'];
            console.log('Ticket value is ;',ticket);
            console.log("Hub Url Is : ",hub+ticket);
    
            r.get(hub + ticket, function(error, response, body) {
    
                var cookies = response.headers['set-cookie'];
                var o = 'http://'+connection_data.origin;
    
                var config = {
                    host: connection_data.server_address,
                    isSecure: true,
                    origin: o,
                    rejectUnauthorized: false,
                    headers: {
                    "Content-Type": "application/json",
                    "Cookie": cookies[0]
                    }
                }
    
            
                xy(arrObj);
                function xy(arrObj)
                {
                    // Promise.all(arrObj.map(x=>{                        
                    //     applyFilters(x.appid,x.qdefM,x.qdefD,x.qSelVal).then(value => {
                            
                    //         return callback(value);
                    //     }) 
                    // }))
                    var x=[];  
                    for(let i=0;i<arrObj.length;i++){
                        // console.log(object2[i].appid)                      
                        
                        x.push(  new Promise((resolve) => setTimeout(() => {resolve(applyFilters(arrObj[i].appid,arrObj[i].qdefM,arrObj[i].filterSelected,arrObj[i].index).then(result=>{
                            return callback(result); 
                        })); },i*2000)));
                       
                    } 
                }

                
                
                var x={};
                var y={};
               
                function applyFilters(appid,qdefM,ss,index) {

                    const qFieldDefsFilter =[];         
                    const selectValFilter =[];             
                    var swap=[];
                    for(let i=0;i<ss.length;i++){
                        qFieldDefsFilter.push(ss[i].Field);
                        swap=[];
                        for(let j=0;j<ss[i].Value.length;j++){
                        swap.push({"qText":ss[i].Value[j]});
                        }
                        selectValFilter.push(swap);
                    }
                 
              
                    var c = {} = config;
                    // c.appname = appid;
                    
                    //Qlik2Go - Marketing Leads and Campaign Performance ,b3e36b8c-de0c-48b2-b0f4-af92a296c6db
                    return qsocks.Connect({
                        host: connection_data.server_address,
                        isSecure: true,
                        origin: o,
                        appname:appid,
                        rejectUnauthorized: false,
                        headers: {
                        "Content-Type": "application/json",
                        "Cookie": cookies[0]
                        }
                    })
                
                    .then( function(global){
                        x.global=global
                      return global.openDoc(appid, '', '', '', false) })
                    .then(function(app) {
                        
                        x.app=app;       

                      return app.createObject({	
                         
                              "qListObjectDef": {
                                "qStateName": "$",
                                "qLibraryId": "",
                                "qDef": {
                                  "qFieldDefs": qFieldDefsFilter,
                                  "qFieldLabels": [
                                    "SelectDiamention"
                                  ],
                                  "qSortCriterias": [
                                    {
                                      "qSortByLoadOrder": 1
                                    }
                                  ]
                                },
                                "qInitialDataFetch": [
                                  {
                                    "qTop": 0,
                                    "qLeft": 0,
                                    "qHeight": 6,
                                    "qWidth": 1
                                  }
                                ]}  ,                   
                        qInfo: { qId: 'FieldList', qType: 'FieldList' }				
                                                    
                        })
                                                
                      })
                      .then(function(){

                                return Promise.all(qFieldDefsFilter.map((k,i)=>{
                                    // console.log("k is :--",k);
                                
                                    return x.app.getField(k,'')            
                                    .then(function(selectVal){
                                        x.selectVal = selectVal;                           
                                        
                                        return (selectVal.selectValues(
                                            selectValFilter[i],
                                            false,
                                            false
                                        ));
                                    })
                                }))             
                       
                   })       
                    .then(function(SelectedLayout){
                        //console.log('Selected LIst Objects ----------22222222');
                        // pinglogger.pingloggerSystem.info(JSON.stringify(SelectedLayout,null,4));
                        
                       return x.app.createSessionObject({  
                            "qInfo": {                    
                            "qType": "Table"
                        },
                        qHyperCubeDef: {
                            qDimensions : [ 		
                                ],
                            qMeasures : [ 
                                { 
                                    qDef : {
                                        qDef : qdefM,
                                        qLabel :""
                                    }
                                } 
                                ]					
                        }  
                          
                        })
                        .then(                    
                            object => object.getHyperCubeData('/qHyperCubeDef',[ { qLeft: 0, qTop: 0, qWidth: 19, qHeight: 50 } ])
                        )
                        .then(function(data){
                            console.log('measureValues After ');
                            // console.log(JSON.stringify(data,null,4));
                            var CurrentValue={};
                        //    console.log(JSON.stringify(data,null,4));
                            for(var a=0 ; a < data.length;a++){
                                    var mat = data[a].qMatrix;   
                                    // console.log(mat);                               
                                for(var b=0 ;b < mat[a].length;b++){
                                      var value =mat[a][b].qNum;   
                                    //   console.log(value); 
                                      CurrentValue={
                                        "index":index,
                                        "measuresValue":value                                     
                                      }               
                                      
                                }

                            }
                            x.app.connection.close();
                            x.global.connection.close();
                            //app.connection.close();
                            //  console.log(CurrentValue);
                               return CurrentValue;
                            
                        } )	
                    })				 
                    .catch(function(err) {console.log(err)});                               
                       
       
                 } 

                function filterAppObjectList(object) {
                    return EXCLUSION_LIST.indexOf(object.qType) === -1
                };
    
            });// r.get
        });// r
            
    })
      

  }//matrix
module.exports=Matrix;