var qsocks = require('qsocks');
var fs = require('fs');
var request = require('request');
var Promise = require("promise");
var appObject =require('./qliksenseDoc');
module.exports={
  getAppList: function(config) {
        return qsocks.Connect(config)
        .then( global => global.getDocList() )
        .then( doclist => {
                console.log(doclist);
            return Promise.all(doclist.map(doc => {
                return appObject.getMeasuresAndDiamentionList(doc.qDocId,doc.qDocName)
            }));
        });
      
    }
 
}