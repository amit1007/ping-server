var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'PingSetup',
  description: 'Ping alerting setup service.',
  script: __dirname+'/bin/www.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

// Listen for the "start" event and let us know when the
// process has actually started working.
svc.on('start',function(){
  console.log(svc.name+' on localhost:4500');
});

// Install the script as a service.
svc.install();