var qsocks = require('qsocks');
var fs = require('fs');
var request = require('request');
var Promise = require("promise");
var express = require('express');
var router = express.Router();


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
var decodetoken = require('../routes/pingtokendecode');
var DataSourceEdit = require('.././models/DataSourceEdit');



router.get('/',function(req,res1,next){
 try {
    DataSourceEdit.findOne({dataSourceId:"01"},function(err,qlikConnectionInfo){
        var dinamicCertificates= require('../dynamicCertificate');
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
      
            try {
                              
            let getSession = req.session["passport"]["user"];                      

            var connection_data = {
                    server_address : server_address,
                    server_certificate : server_certificate,   
                    user_directory : user_directory,
                    user_name : getSession.PingUserName,
                    origin : origin,
                    single_app_id: single_app_id
          }

            console.log(connection_data);
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
        // appList.getAppList(config).then (doc =>  console.log(JSON.stringify(doc,null, 4)));

        createSearchApp().then(doc => {
        this.data = JSON.stringify(doc,null,4);
        // console.log(this.data);
        res1.send(this.data);
        }  );                 

        function createSearchApp() {
            return qsocks.Connect({
                host: connection_data.server_address,
                isSecure: true,
                origin: o,
                rejectUnauthorized: false,
                headers: {
                "Content-Type": "application/json",
                "Cookie": cookies[0]
                }
            })              
            .then( global => global.getDocList() )
            .then( doclist => {
                return Promise.all(doclist.map(doc => {
                    return fetchAppObjects(doc.qDocId,doc.qDocName)                                  
                }));
            }).then(result =>{

                result.push({
                    cookies : cookies
                })
                
                return result;
            });
            


        };
                    x={}
                function fetchAppObjects(appid,QlikappName) {
                        
                            var c = {} = config;
                            c.appname = appid;
                            var x1={}
                            
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
                                return x1.global=global;
                            })
                            .then( global => global.openDoc(appid, '', '', '', true) )
                            .then(function(app) {
                                //x1.app= app;
                                return app.createSessionObject({
                                    "qInfo": {
                                        "qType": "DimensionList"
                                    },
                                    "qDimensionListDef": {
                                        "qType": "dimension",
                                        "qData": {
                                            "title": "/title",
                                            "tags": "/tags",
                                            "grouping": "/qDim/qGrouping",
                                            "info": "/qDimInfos"
                                        }
                                    },
                                    "qMeasureListDef": {
                                        "qType": "measure",
                                        "qData": {
                                            "title": "/title",
                                            "tags": "/tags",
                                            "info": "/q",
                                            "measure": "/qMeasure"
                                        },            
                                    }
                                })
                                        
                            .then(function(list) {
                                // console.log(list.getLayout())
                                return list.getLayout()
                            })
                            .then(function(layout) {
                                
                                var appNameAndID = [appid,QlikappName]  
                                var dimensions = layout.qDimensionList.qItems;
                                var measures = layout.qMeasureList.qItems;    
                            
                                
                                var dimensionsReduced = dimensions.reduce(function(dims, d) {
                                    dims.push({                
                                        // "pingDiamentionID": d.qInfo.qId,                       
                                        "pingDiamentionTitle":d.qMeta.title,                  
                                        "pingDiamentionData":d.qData.info[0].qName                        
                                    })
                                    return dims
                                }, [])
                                var measuresReduced = measures.reduce(function(measures, m) {
                                    measures.push({              
                                        "pingMeasuresqLabel":m.qData.measure.qLabel,
                                        "pingMeasuresqDef":m.qData.measure.qDef
                                    })          
                                    return measures
                                }, [])

                                var measuresReduced2 = measures.reduce(function(measures, m) {
                                    measures.push({  

                                        "pingMeasuresqLabel":m.qData.measure.qLabel,
                                        "pingMeasuresqDef":m.qData.measure.qDef
                                    })          
                                    return measures
                                }, [])
                                    //console.log(JSON.stringify(measuresReduced2,null,4));
                        
                            var adj = {
                                
                                        "pingAppList" :[{
                                                    "appid" : appid,
                                                    "appName" : QlikappName
                                                }],
                                        "pingAppObjects" : [{
                                            "measures" : measuresReduced,
                                            "dimensions" : dimensionsReduced
                                        }]
                                            
                            }  
                            
                                //app.connection.close();
                                return adj;
                            })
                            .then(function(final){
                            x1.global.connection.close();
                            
                                return final;
                            })
                            .catch(function(err) { console.log(err) });
                        })    
                        
                };


        });// r.get	
        });// r
            } catch (error) {
                console.log(error);
         }
   })
  

 } catch (error) {
     console.log(error);
 }   

})//route "/"
module.exports = router;