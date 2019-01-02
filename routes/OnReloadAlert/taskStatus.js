var qrsInteract = require('./qrsInstance');
var Promise = require("promise");
var express = require('express');
var router = express.Router();


/* GET ALL Alert's */
router.get('/', function(req, res, next) {
    getTaskDetails().then(x=>{
        res.send(x);
    });  
});
module.exports = router;




function getTaskDetails(){
   
            var path = "task/full";
            return qrsInteract.Get(path)
                .then(result => {

                    console.log("Total Count....");
                    console.log(result.body.length);
                   
                    return Promise.all(result.body.map(doc=>{  
                                var taskStatus={
                                    appid:doc.app.id,
                                    status:doc.operational.lastExecutionResult.status
                                }
                      return taskStatus;        
                    })).then(appDetails=>{
                        console.log(appDetails);
                        return appDetails;
                    })
            
                })
}


