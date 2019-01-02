var qsocks = require('qsocks');
var fs = require('fs');
var request = require('request');
var Promise = require("promise");

module.exports={
  getMeasuresAndDiamentionList: function (appid,QlikappName) {
        
        var c = {} = config;
        c.appname = appid;
        
        
        return qsocks.Connect(c)
        .then( global => global.openDoc(appid, '', '', '', true) )
        .then(function(app) {
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
    
                    "pingDiamentionID": d.qInfo.qId,
                    "pingDiamentionType": d.qInfo.qType,
                    "pingDiamentionTitle":d.qMeta.title,
                    "pingDiamentionModifiedDate":d.qMeta.modifiedDate,
                    "pingDiamentionPublishedTime":d.qMeta.publishTime,
                    "pingDiamention_qData":d.qData.info,                             
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
    
          var adj = {
            [appid] : [{
                    "pingMeasuresList" : {
                        "measures" : measuresReduced
                    },
                    "pingDiamentionList" : {
                        "dimensions" : dimensionsReduced
                    }
                } ]                   
          }  

    
            Console.log(adj);
         
            return adj;
        })
        .catch(function(err) { console.log(err) });
      
       
    }
  
}