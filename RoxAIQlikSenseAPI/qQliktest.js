var qsocks = require('qsocks');
var fs = require('fs');
var request = require('request');
var Promise = require("promise");

var cmd_args = process.argv;
console.log('cmd_args:' + cmd_args)
var using_defaults = true;
var server_address = 'ec2-54-165-141-223.compute-1.amazonaws.com';
var server_certificate = __dirname + '\/client.pfx';
var user_directory = 'qliksense';
var user_name = 'testuser1';
var origin = 'qlik-sense';
var single_app = false;
var single_app_id = ''


cmd_args.forEach(function(val,index){
	if(index!=0 && index!=1){
		switch(val){
			case '-h': 
				helper();
				break;
			case '-a':
				if(cmd_args[index+1]){
						server_address = cmd_args[index+1];
						using_defaults=false;
					}
				else{
					console.log("Please check the server address argument. Type '-h' for help.");
					process.exit();
				}
				break;
			case '-c':
				if(cmd_args[index+1]){
					server_certificate = cmd_args[index+1];
					using_defaults=false;
				}
				else{
					console.log("Please check the server certificate file path argument. Type '-h' for help.");
					process.exit();
				}
				break;
			case '-ud':
				if(cmd_args[index+1])
					user_directory = cmd_args[index+1];
				else{
					console.log("Please check the user directory argument. Type '-h' for help.");
					process.exit();
				}
				break;
			case '-un':
				if(cmd_args[index+1])
					user_name = cmd_args[index+1];
				else{
					console.log("Please check the user name argument. Type '-h' for help.");
					process.exit();
				}
				break;
			case '-o':
				if(cmd_args[index+1]){
					origin = cmd_args[index+1];
					using_defaults=false;
				}
				else{
					console.log("Please check the origin address argument. Type '-h' for help.");
					process.exit();
				}
				break;
			case '-s':
				if(cmd_args[index+1]){
					single_app_id = cmd_args[index+1];
					single_app=true;
				}
				else{
					console.log("Please check the application id argument. Type '-h' for help.");
					process.exit();
				}
				break;
			default:
				if (cmd_args[index-1]!='-h'&&cmd_args[index-1]!='-a'&&cmd_args[index-1]!='-c'&&cmd_args[index-1]!='-ud'&&cmd_args[index-1]!='-un'&&cmd_args[index-1]!='-o'&&cmd_args[index-1]!='-s')
				console.log("'"+val+"' is not a valid command. Type '-h' for help.");
				break;
		}
	}
})

//check for root admin specification to be different than null
if(user_directory=='' || user_name==''){
	console.log("Root admin is not correctly specified. Type '-h' for help.");
	process.exit();
}

console.log();
console.log("Loading the Applications Information for your environment");

//default configs warning
if(using_defaults){
	console.log();
	console.log("Warning: besides user identification, you are using all");
	console.log("         the default configurations.");
}

//setting up the connection (based on mindspank's https://github.com/mindspank/qsocks examples)
var connection_data = {
	server_address : server_address,
    server_certificate : server_certificate,   
	user_directory : user_directory,
	user_name : user_name,
	origin : origin,
	single_app_id: single_app_id
}

//Request defaults
var r = request.defaults({
	rejectUnauthorized: false,
	host: connection_data.server_address,
    pfx: fs.readFileSync(connection_data.server_certificate),
    passphrase: '1234'
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

        fetchLoopDiamentionAndMeasuresValue();
     
        function fetchLoopDiamentionAndMeasuresValue() {
        
            var c = {} = config;
            // c.appname = appid;
            
            //Qlik2Go - Marketing Leads and Campaign Performance ,b3e36b8c-de0c-48b2-b0f4-af92a296c6db
            return qsocks.Connect(c)
            .then( global => global.openDoc('f1223084-65b8-4ff2-b344-47681a22b62b', '', '', '', false) )
            .then(function(app) {
    
                console.log("Connect to App");
                // Create a Generic Session Object
                app.createSessionObject({   "qInfo": {
                    "qId": "MetricTable",
                    "qType": "Table"
                },
                qHyperCubeDef: {
					qDimensions : [ 
						{ qDef : {qFieldDefs : ["Status"]}}, 
						{ qDef : {qFieldDefs : ["Priority"]}}, 
						{ qDef : {qFieldDefs : ["City"]}} 
						],
					qMeasures : [ 
						{ 
							qDef : {
								// qDef : "Sum([Sales Price])",
								qDef : "Count ({<[Opportunity Won/Lost] = {'WON'} >} DISTINCT [Customer Account Id])", 
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
                 .then(data => console.log(JSON.stringify(data,null,4)))				
           		 .catch(function(err) { console.log("go"+err) });                  
		});
	}
		
        
        
        function filterAppObjectList(object) {
            return EXCLUSION_LIST.indexOf(object.qType) === -1
        };

    });// r.get
});// r
