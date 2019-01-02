const log4js = require('log4js');

log4js.configure({
    appenders: { pingLogger: { type: 'file', filename: 'pingLogger.log' } },
    categories: { default: { appenders: ['pingLogger'], level: 'trace' } }
  });
   
  module.exports.pingloggerSystem = log4js.getLogger('pingLogger');