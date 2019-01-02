var qsocks = require('qsocks');
var fs = require('fs');
var request = require('request');
var Promise = require("promise");


var DataSourceEdit = require('../models/DataSourceEdit');
var backreq  = require('../routes/datadourceedit')


// var cmd_args = process.argv;
// var using_defaults = true;
// var server_address = 'ec2-34-195-43-80.compute-1.amazonaws.com';
// var server_certificate = __dirname + '\/client.pfx';
// var user_directory = 'QLIK-SENSE';
// var user_name = 'qsadmin';
// var origin = 'QLIK-SENSE';
// var single_app = false;
// var single_app_id = '';
// var data ={};


module.exports.Qlikgen =  function(req,userID,callback)
{
	try {

		var dinamicCertificates= require('../dynamicCertificate');
		let client_pfx=dinamicCertificates.client_pfx
		var server_certificate =client_pfx;
		var single_app = false;
		var single_app_id = '';
		console.log('req',req)

	
	var connection_data = {
		server_address : req.hostname,
		server_certificate : server_certificate,   
		user_directory : req.userdirectory,
		user_name : userID,
		origin : req.userdirectory,
		single_app_id: single_app_id
	}
	
	
	
	
	
	//Request defaults
	var r = request.defaults({
		rejectUnauthorized: false,
		host: connection_data.server_address,
		pfx: fs.readFileSync(connection_data.server_certificate),
		passphrase: req.certPassword
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
		
		if(err){
			return callback(err);
		}
		else{
		   try {
		
			   if(body === ''){
					return callback({request : "Unexpected end of JSON input",status : 401})
			   }
			 else{
			// var hub = 'https://'+connection_data.server_address+'/hub/?qlikTicket=';
			// var ticket = JSON.parse(body)['Ticket'];

			// r.get(hub + ticket, function(error, response, body) {
			// 	if(error){
			// 		return callback(error);
			// 	}
			// 	var cookies = response.headers['set-cookie'];
			// 	return callback(cookies);
			// })
			return callback({request : "qlik-sense connection successfully",status : 200})
		}
		   } catch (error) {
			   return callback(error);
		   }
		
		}
		
		//   if (body  == undefined  ){
		// 		console.log("Your Ticket is  Not Generated")
				
		// 	}
		//   else{
		// 	var hub = 'https://'+connection_data.server_address+'/hub/?qlikTicket=';
		// 	var ticket = JSON.parse(body)['Ticket'];
			
		// 	console.log('Ticket value is ;',ticket);
		// 	console.log("Hub Url Is : ",hub+ticket);
		
		//   }
	
	
	
		});// r
		
	} catch (error) {
		console.log(error);
	}



}        