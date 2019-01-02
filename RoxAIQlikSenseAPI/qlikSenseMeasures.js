var qsocks = require('qsocks');
var fs = require('fs');
var request = require('request');
var Promise = require("promise");
var express = require('express');
var router = express.Router();


var dinamicCertificates= require('../dynamicCertificate');
let client_pfx=dinamicCertificates.client_pfx
var server_certificate =client_pfx;

var cmd_args = process.argv;
// console.log('cmd_args:' + cmd_args)
var using_defaults = true;
var server_address = '';
// var server_certificate = __dirname + '\/client.pfx';
var user_directory = '';
var user_name = '';
var origin = '';
var single_app = false;
var single_app_id = ''
var DataSourceEdit = require('.././models/DataSourceEdit');

var connection_data = {
    server_address : server_address, 
    user_directory : user_directory,
    origin : origin,
    single_app_id: single_app_id
  }
  var o = ' ';
 
router.get('/',function(req,res1,next){        
    DataSourceEdit.findOne({dataSourceId:"01"},function(err,qlikConnectionInfo){
   
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
 
     connection_data = {
         server_address : server_address,      
         user_directory : user_directory,       
         origin : origin,
         single_app_id: single_app_id
       }
 
      o = 'http://'+connection_data.origin;
 
  });
            
   
router.post('/getMeasureValue',function(req,res1,next){
                 
                        try {
                            console.log(req.body);
                            var appid =  req.body.appid ;
                            var qdef =  req.body.qdef;
                            var cookies = req.body.qlik_cookies.cookies;
                            console.log('getMeasure',cookies);
                            //console.log(qdef);    
                            fetchMeasuresValue(appid,qdef,cookies).then(value => {
    
                                // this.value = JSON.stringify(value,null,4);
                                // console.log("Meas Value");
                                //console.log(value);
                                    res1.send(value);
                            })
                        } catch (error) {
                            console.log(error);
                        } 
                          
            })  
            
 router.post('/getDiamentionValue',function(req,res1,next){
            
             console.log("Route Diamention")
                console.log(req.body);    
                fetchDiamentionValue(req.body.appid,req.body.qdefM,req.body.qdefD,req.body.qlik_cookies.cookies).then(value => {
                    // this.value = JSON.stringify(value,null,4);
                    // console.log("Meas Value");
                    console.log(JSON.stringify(value,null,4));
                        res1.send(value);
                })  
                  
    })

router.post('/getFielddValue',function(req,res1,next){
            
        console.log("FieldValue Diamention")
           console.log(req.body);    
           fetchFieldValue(req.body.appid,req.body.qdefD,req.body.qlik_cookies.cookies).then(value => {
               // this.value = JSON.stringify(value,null,4);
               // console.log("Meas Value");
               console.log(JSON.stringify(value,null,4));
                   res1.send(value);
           })            
})

router.post('/getFilterValue',function(req,res1,next){
            
           console.log("Route Filter")
           console.log(req.body.filter.length);            
         
           applyFilters(req.body).then(value => {
               // this.value = JSON.stringify(value,null,4);
               // console.log("Meas Value");
               console.log("FilterValue");
               console.log(value);
                   res1.send(value);
           })  
             
})

router.post('/getDiamentionValueWithFilter',function(req,res1,next){
            
    console.log("Route Drill With Filter")
    console.log(req.body.filter.length);            
  
    applyFiltersWithDrill(req.body).then(value => {
        // this.value = JSON.stringify(value,null,4);
        // console.log("Meas Value");
        console.log("FilterValue");
        console.log(value);
            res1.send(value);
    })  
      
})

// Global Variable
var x={};
var y={};

function fetchMeasuresValue(appid,qdef,qlik_cookies) {
    console.log(connection_data);
    try {
        return qsocks.Connect({
            host: connection_data.server_address,
            isSecure: true,
            origin: o,
            appname:appid,
            rejectUnauthorized: false,
            headers: {
            "Content-Type": "application/json",
            "Cookie": qlik_cookies[0]
            }
        })
           .then(function(global){
                return x.global=global
            })
            .then( global => global.openDoc(appid, '', '', '', false) )
            // .then( global => global.openDoc('01dd2da3-853d-4456-bfe3-34596742c461', '', '', '', false) )
            .then(function(app) {
        
                var CurrentValue;
                //console.log("Connect to App",app);
                // Create a Generic Session Object
        
               return app.createSessionObject({   "qInfo": {
                    "qId": "MetricTable",
                    "qType": "Table"
                },
                qHyperCubeDef: {
                    qDimensions : [ 
                     // { qDef : {qFieldDefs : ["Status"]}}, 
                     // { qDef : {qFieldDefs : ["Priority"]}}, 
                     { qDef : {qFieldDefs : [""]}} 
                     ],
                    qMeasures : [ 
                        { 
                            qDef : {
                                // qDef : "Sum([Sales Price])",
                                qDef : qdef, 
                                qLabel :""
                            }
                        } 
                        ],
                            
                 
                    qInitialDataFetch: [
                        {
                            qTop: 0,
                            qHeight: 30,
                            qLeft: 0,
                            qWidth: 25
                        }
                    ]
                }
        
                }).then(
                    // object => object.getLayout()
                    object => object.getHyperCubeData('/qHyperCubeDef',[ { qLeft: 0, qTop: 0, qWidth: 19, qHeight: 50 } ])
                )
                 .then(function(data){
                   var CurrentValue={};
                   console.log(JSON.stringify(data,null,4));
                    for(var a=0 ; a < data.length;a++){
                            var mat = data[a].qMatrix;   
                            console.log(mat);                               
                        for(var b=0 ;b < mat[a].length;b++){
                              var value =mat[a][b].qNum;   
                              console.log(value); 
                              CurrentValue={
                                "measuresValue":value
                              }               
                              
                        }
        
                    }
                             x.global.connection.close();
                           
                    return CurrentValue ;
                 })                
                 .catch(function(err) { console.log("go"+err) });                         
               
             })
             .catch(function(err) {console.log(err) });
    } catch (error) {
        console.log(error);
    }
    // console.log(appid);
    // console.log(expression);

   // var c = {} = config;
    // c.appname = appid;
    
    //Qlik2Go - Marketing Leads and Campaign Performance ,b3e36b8c-de0c-48b2-b0f4-af92a296c6db


   
         
  
}

                

                function fetchDiamentionValue(appid,qdefM,qdefD,qlik_cookies) {
                    // console.log(appid);
                    // console.log(expression);
        
                    //var c = {} = config;
                    // c.appname = appid;
                    
                    //Qlik2Go - Marketing Leads and Campaign Performance ,b3e36b8c-de0c-48b2-b0f4-af92a296c6db
                    return qsocks.Connect({
                        host: connection_data.server_address,
                        isSecure: true,
                        origin: o,
                        rejectUnauthorized: false,
                        appname:appid,
                        headers: {
                        "Content-Type": "application/json",
                        "Cookie": qlik_cookies[0]
                        }
                    })
                    .then(function(global){
                        return x.global=global
                    })
                    .then( global => global.openDoc(appid, '', '', '', false) )
                    // .then( global => global.openDoc('01dd2da3-853d-4456-bfe3-34596742c461', '', '', '', false) )
                    .then(function(app) {
                        x.app=app;
                        var CurrentValue;
                        // console.log("Connect to App",app);
                        // Create a Generic Session Object

                       return app.createSessionObject({   "qInfo": {
                            "qId": "MetricTable",
                            "qType": "Table"
                        },
                        qHyperCubeDef: {
                            qDimensions : [                     
                                   { qDef : {
                                       qFieldDefs : [""+qdefD+""]
                                 }
                                } 
                             ],
                            qMeasures : [ 
                                { 
                                    qDef : {
                                        // qDef : "Sum([Sales Price])",
                                        qDef : qdefM, 
                                        qLabel :""
                                    }
                                } 
                                ],                                   
                         
                            qInitialDataFetch: [
                                {
                                    qTop: 0,
                                    qHeight: 30,
                                    qLeft: 0,
                                    qWidth: 25
                                }
                            ]
                        }
            
                        }).then(function(obj){
                            x.obj =obj;
                            return obj.getLayout();
                        })
                        .then(function(layout){
                            var qSize =layout.qHyperCube.qSize;
                            x.qSize =qSize;
                            // object => object.getLayout()
                          return x.obj.getHyperCubeData('/qHyperCubeDef',[ { qLeft: 0, qTop: 0, qWidth: x.qSize.qcx, qHeight:x.qSize.qcy} ])
                        } )                       
                         .then(function(data){
                            qDia=[];                          
                            for(var a=0 ; a < data.length;a++){
                               var mat = data[a].qMatrix;    
                                                                                                                        
                                 for(var b=0 ;b < mat.length;b++){
                                         var value =mat[b][0];  
                                         var n = mat[b].length < 2 ? 0 :1;
                                         console.log(n);
                                 
                                         qDia.push({
                                         "qText":mat[b][0].qText,
                                         "qNum" : mat[b][n].qNum
                                         })
                                     
                                    
                                 }                               
                             }
                               x.app.connection.close();
                               return qDia;
                         })                
                         .catch(function(err) { console.log("go"+err) });  
                        
                       
                });
            
                   
                         
                  
                }  
                
                //.................Field Value.....................

                function fetchFieldValue(appid,qdefD,qlik_cookies) {
                    // console.log(appid);
                    // console.log(expression);
        
                   //  var c = {} = config;
                    // c.appname = appid;
                    
                    //Qlik2Go - Marketing Leads and Campaign Performance ,b3e36b8c-de0c-48b2-b0f4-af92a296c6db
                    try {
                                return qsocks.Connect({
                                    host: connection_data.server_address,
                                    isSecure: true,
                                    origin: o,
                                    rejectUnauthorized: false,
                                    appname:appid,
                                    headers: {
                                    "Content-Type": "application/json",
                                    "Cookie": qlik_cookies[0]
                                    }
                                })
                                .then(function(global){
                                    return x.global=global
                                })
                                .then( global => global.openDoc(appid, '', '', '', false) )
                                // .then( global => global.openDoc('01dd2da3-853d-4456-bfe3-34596742c461', '', '', '', false) )
                                .then(function(app) {
                                    x.app=app;
                                    var CurrentValue;
                                    // console.log("Connect to App",app);
                                    // Create a Generic Session Object
            
                                return app.createSessionObject({   "qInfo": {
                                        "qId": "MetricTable",
                                        "qType": "Table"
                                    },
                                    qHyperCubeDef: {
                                        qDimensions : [                     
                                            { qDef : {
                                                qFieldDefs : [""+qdefD+""]
                                            }
                                            } 
                                        ],                                
                                    
                                        qInitialDataFetch: [
                                            {
                                                qTop: 0,
                                                qHeight: 30,
                                                qLeft: 0,
                                                qWidth: 25
                                            }
                                        ]
                                    }
                        
                                    }).then(function(obj){
                                        x.obj =obj;
                                        return obj.getLayout();
                                    })
                                    .then(function(layout){
                                        var qSize =layout.qHyperCube.qSize;
                                        x.qSize =qSize;
                                        // object => object.getLayout()
                                    return x.obj.getHyperCubeData('/qHyperCubeDef',[ { qLeft: 0, qTop: 0, qWidth: x.qSize.qcx, qHeight:x.qSize.qcy} ])
                                    } )                       
                                    .then(function(data){
                                        qDia=[];
                                        for(var a=0 ; a < data.length;a++){
                                        var mat = data[a].qMatrix;                                                                                              
                                            for(var b=0 ;b < mat.length;b++){
                                                    var value =mat[b][0];  
                                                    
                                                    qDia.push({
                                                    "qText":mat[b][0].qText,
                                                    "qNum" : mat[b][0].qNum
                                                    })
                                                
                                                
                                            }                               
                                        }
                                        x.app.connection.close();
                                        return qDia;
                                    })                
                                    .catch(function(err) { console.log("go"+err) });  
                                    
                                
                                })
                                .catch(function(err) { console.log("go"+err) });
                    } catch (error) {
                        console.log(error);
                    }
                
            
                   
                         
                  
                }  
                 
              function applyFilters(ss) {
                  try {
                    var cookies = ss.qlik_cookies.cookies[0];

                    const qFieldDefsFilter =[];         
                    const selectValFilter =[];             
                    var swap=[];
                    for(let i=0;i<ss.filter.length;i++){
                        qFieldDefsFilter.push(ss.filter[i].Field);
                        swap=[];
                        for(let j=0;j<ss.filter[i].Value.length;j++){
                        swap.push({"qText":ss.filter[i].Value[j]});
                        }
                        selectValFilter.push(swap);
                    }
                 
                  
                  
                        //var c = {} = config;
                        // c.appname = appid;
                        
                        //Qlik2Go - Marketing Leads and Campaign Performance ,b3e36b8c-de0c-48b2-b0f4-af92a296c6db
                        return qsocks.Connect({
                            host: connection_data.server_address,
                            isSecure: true,
                            origin: o,                       
                            rejectUnauthorized: false,
                            appname:ss.appid,
                            headers: {
                            "Content-Type": "application/json",
                            "Cookie": cookies
                            }
                        })                    
                        .then( function(global)
                        { 
                            console.log(global);
                            x.global=global
                            return global.openDoc(ss.appid, '', '', '', false)} 
                            )
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
                                        console.log("k is :--",k);
                                    
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
                            console.log('Selected LIst Objects ----------22222222');
                            console.log(JSON.stringify(SelectedLayout,null,4));
                            
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
                                            qDef : ss.qdefM,
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
                        .catch(function(err) { console.log("go"); console.log(err)});
  
                  } catch (error) {
                      console.log(error);
                      
                  }
   
                 } 

            function applyFiltersWithDrill(ss) {
                    try {
                      var cookies = ss.qlik_cookies.cookies[0];
  
                      const qFieldDefsFilter =[];         
                      const selectValFilter =[];             
                      var swap=[];
                      for(let i=0;i<ss.filter.length;i++){
                          qFieldDefsFilter.push(ss.filter[i].Field);
                          swap=[];
                          for(let j=0;j<ss.filter[i].Value.length;j++){
                          swap.push({"qText":ss.filter[i].Value[j]});
                          }
                          selectValFilter.push(swap);
                      }
                   
                    
                    
                          //var c = {} = config;
                          // c.appname = appid;
                          
                          //Qlik2Go - Marketing Leads and Campaign Performance ,b3e36b8c-de0c-48b2-b0f4-af92a296c6db
                          return qsocks.Connect({
                              host: connection_data.server_address,
                              isSecure: true,
                              origin: o,                       
                              rejectUnauthorized: false,
                              appname:ss.appid,
                              headers: {
                              "Content-Type": "application/json",
                              "Cookie": cookies
                              }
                          })                    
                          .then( function(global)
                          { 
                              console.log(global);
                              x.global=global
                              return global.openDoc(ss.appid, '', '', '', false)} 
                              )
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
                                            "qSortByAscii": 1
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
                              console.log('Selected LIst Objects ----------22222222');
                             // console.log(JSON.stringify(SelectedLayout,null,4));
                              
                             return x.app.createSessionObject({  
                                  "qInfo": {                    
                                  "qType": "Table"
                              },
                              qHyperCubeDef: {
                                  qDimensions : [ 
                                            { 
                                                qDef : {                                                
                                                    qFieldDefs : [""+ss.qdefD+""]
                                                }
                                          }      		
                                      ],
                                  qMeasures : [ 
                                      { 
                                          qDef : {
                                              qDef : ss.qdefM,
                                              qLabel :""
                                          }
                                      } 
                                      ]					
                              }  
                                
                              })
                              .then(function(obj){
                                x.obj =obj;
                                return obj.getLayout();
                            })
                            .then(function(layout){
                                var qSize =layout.qHyperCube.qSize;
                                x.qSize =qSize;
                                // object => object.getLayout()
                              return x.obj.getHyperCubeData('/qHyperCubeDef',[ { qLeft: 0, qTop: 0, qWidth: x.qSize.qcx, qHeight:x.qSize.qcy} ])
                            }) 
                              .then(function(data){
                                  console.log('measureValues After ');
                                  qDia=[];                          
                                  for(var a=0 ; a < data.length;a++){
                                     var mat = data[a].qMatrix;    
                                                                                                                              
                                       for(var b=0 ;b < mat.length;b++){
                                               var value =mat[b][0];  
                                               var n = mat[b].length < 2 ? 0 :1;
                                              // console.log(n);
                                       
                                               qDia.push({
                                               "qText":mat[b][0].qText,
                                               "qNum" : mat[b][n].qNum
                                               })
                                       }                               
                                   }

                                  x.app.connection.close();
                                 x.global.connection.close();
                                  //app.connection.close();
                                  //  console.log(CurrentValue);
                                  return qDia;
                                  
                              } )	
                          })				 
                          .catch(function(err) { console.log("go"); console.log(err)});
    
                    } catch (error) {
                        console.log(error);
                        
                    }
     
                   } 


                function filterAppObjectList(object) {
                    return EXCLUSION_LIST.indexOf(object.qType) === -1
                };

           
       
    });
module.exports = router;