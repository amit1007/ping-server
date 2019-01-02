var qsocks = require('qsocks');
var fs = require('fs');
var request = require('request');
var Promise = require("promise");
var pinglogger= require('../../pingLogging.js');
var DataSourceEdit = require('../../models/DataSourceEdit');

pinglogger.pingloggerSystem.info("------------------=====================----------------------")
pinglogger.pingloggerSystem.info("We are now in Triggered Alerts --->DiaHyperCube")
var server_address = '';
var user_directory = '';
var user_name = '';
var origin = '';
var single_app = false;
var single_app_id = '';
var data ={};

var Matrix = function (appid,qdefM,qdefD,UserID,callback){
     //DataSource DB Collection Call 
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
        
   
          console.log("Measures Qdef");
          var connection_data = {
            server_address : server_address,
            server_certificate : server_certificate,   
            user_directory : user_directory,
            user_name : UserID,
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
    
            
             

                fetchDiamentionValue(appid,qdefM,qdefD).then(value => {
                    // this.value = JSON.stringify(value,null,4);
                    // console.log("Meas Value");
                    // console.log(JSON.stringify(value,null,4));
                    //     res1.send(value);
                        return callback(value);
                }) 
                
                var x={};
            
               
                function fetchDiamentionValue(appid,qdefM,qdefD) {
                    pinglogger.pingloggerSystem.info("------------------=====================----------------------")
                    pinglogger.pingloggerSystem.info("Fetch dimention values for Triggered Alerts")
           
                    var c = {} = config;
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
                        "Cookie": cookies[0]
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
                                 
                                         qDia.push({
                                         "qText":mat[b][0].qText,
                                         "qNum" : mat[b][n].qNum
                                         })
                                     
                                    
                                 }                               
                             }
                               x.app.connection.close();
                               return qDia;
                         })                
                         .catch(function(err) { pinglogger.pingloggerSystem.error(err)});  
                        
                       
                });
                         
                  
    }           
                 
    
    
                
                
                function filterAppObjectList(object) {
                    return EXCLUSION_LIST.indexOf(object.qType) === -1
                };
    
            });// r.get
        });// r

    })
 }//matrix
module.exports=Matrix;