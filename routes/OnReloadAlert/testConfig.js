var hostName = require('../../pingConfig.json')
var extend = require('extend');
var path = require('path');
var dinamicCertificates= require('../../dynamicCertificate');
var DataSourceEdit = require('../../models/DataSourceEdit');

var hostname='';
var certPath =  dinamicCertificates.certPath;
var newObj='';
var testConfig ='';


hostname = hostName.hostName;
//local path 
// var certPath = 'C:/USer-PC';
// 'C:/USer-PC';
// dinamicCertificates.client_key_pem
// dinamicCertificates.client_pem
// dinamicCertificates.server_key_pem
// dinamicCertificates.server_pem
// dinamicCertificates.root_pem
//server Path
// var certPath = 'C:/ProgramData/Qlik/Sense/Repository/Exported Certificates/.Local Certificates';

 newObj = {
    certificates: {
		certPath: certPath,
		client: dinamicCertificates.client_pem,
		client_key: dinamicCertificates.client_key_pem,
		server: dinamicCertificates.server_pem,
		server_key: dinamicCertificates.server_key_pem,
		root: dinamicCertificates.root_pem
	},
    gms :
    {
        hostname: hostname
    },
    engine:
    {
        hostname: hostname
    },
    qrs:
    {
        hostname: hostname,
        localCertPath: certPath
    }
};


testConfig = extend(true, newObj);

module.exports = testConfig;