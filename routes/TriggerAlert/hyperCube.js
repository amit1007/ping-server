var qsocks = require('qsocks');
var fs = require('fs');
var request = require('request');
var Promise = require("promise");

var pinglogger= require('../../pingLogging.js');
var DataSourceEdit = require('../../models/DataSourceEdit');

pinglogger.pingloggerSystem.info("------------------=====================----------------------")
pinglogger.pingloggerSystem.info("We are now in Triggered Alerts --->HyperCube")

var server_address = '';
var user_directory = '';
var user_name = '';
var origin = '';
var single_app = false;
var single_app_id = '';
var data ={};


var Matrix = function (appid,qdef,UserID,callback){
        pinglogger.pingloggerSystem.info("Measures Trigger");

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
            pinglogger.pingloggerSystem.info('Ticket value is ;',ticket);
            pinglogger.pingloggerSystem.info("Hub Url Is : ",hub+ticket);
    
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
    
            
                fetchMeasuresValue(appid,qdef).then(value => {
                    
                    // valueMatrix = value; 
                    // console.log(value);          
                     return callback(value);          
                });
                
                var x={};
            
                function fetchMeasuresValue(appid,qdef) {
                    // console.log(appid);
                    // console.log(expression);
    
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
                    .then(function(global){
                        return x.global=global
                    })
                    .then( global => global.openDoc(appid, '', '', '', false) )
                    // .then( global => global.openDoc('01dd2da3-853d-4456-bfe3-34596742c461', '', '', '', false) )
                    .then(function(app) {
            
                        var CurrentValue;
                        // console.log("Connect to App",app);
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
                                    x.global.connection.close();
                                
                            return CurrentValue ;
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