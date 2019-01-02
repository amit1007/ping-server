var config = require('../routes/OnReloadAlert/testConfig');
var qrsInteract = require('../routes/OnReloadAlert/qrsInstance');


var path = "user/full?filter=userDirectory ne 'INTERNAL'";

// function getuser(){

var x=qrsInteract.Get(path)
.then(result => { 
    userDetails=[];    
    for (let index = 0; index < Object.keys(result.body).length; index++) {
        var qlikUserData={}
        qlikUserData.userId=result.body[index].userId;
        qlikUserData.userDirectory=result.body[index].userDirectory;
        qlikUserData.name=result.body[index].name;
        qlikUserData.roles=result.body[index].roles;       
        qlikUserData.email="";
        qlikUserData.group="";
        if (Object.keys(result.body[index].attributes).length>0) {
            let attributes=result.body[index].attributes;
            for (let iattrinuteIndex = 0; iattrinuteIndex < Object.keys(attributes).length; iattrinuteIndex++) {
                if((result.body[index].attributes[iattrinuteIndex].attributeType)===('email')||(result.body[index].attributes[iattrinuteIndex].attributeType)===('Email'))
                qlikUserData.email=result.body[index].attributes[iattrinuteIndex].attributeValue;        
                
                if((result.body[index].attributes[iattrinuteIndex].attributeType)===('group')||(result.body[index].attributes[iattrinuteIndex].attributeType)===('Group'))
                qlikUserData.group=result.body[index].attributes[iattrinuteIndex].attributeValue;
            }
        }        
        // qlikUserData.attributeType=result.body[index].attributes[0].attributeType
        userDetails.push({qlikUserData})     ;

    }
    // console.log("Qrs data",JSON.stringify(userDetails,null,4));
    return userDetails;
    // qlikUserData.userId=result.body[20].userId
    // qlikUserData.userDirectory=result.body[20].userDirectory
    // qlikUserData.name=result.body[20].name
    // qlikUserData.roles=result.body[20].roles
    // qlikUserData.attributes=result.body[20].attributes
    // qlikUserData.name=
    // console.log(Object.keys(result.body).length);
    // console.log("Qrs data",JSON.stringify(result.body[20].attributes[0].attributeType,null,4));
    //  console.log("Qrs data",JSON.stringify(userDetails,null,4));
})
// }

// console.log(getuser());


// https://nprintingrb/qrs/user/full?xrfkey=DFtIXloHHm8gLqyQ&filter=userDirectory ne 'INTERNAL'
var TokenInfo = function (x,callback){
  
     return  qrsInteract.Get(path)
.then(result => { 
    userDetails=[];    
    for (let index = 0; index < Object.keys(result.body).length; index++) {
        var qlikUserData={}
        qlikUserData.userId=result.body[index].userId;
        qlikUserData.userDirectory=result.body[index].userDirectory;
        qlikUserData.name=result.body[index].name;
        qlikUserData.roles=result.body[index].roles;       
        qlikUserData.email="";
        qlikUserData.group="";
        if (Object.keys(result.body[index].attributes).length>0) {
            let attributes=result.body[index].attributes;
            for (let iattrinuteIndex = 0; iattrinuteIndex < Object.keys(attributes).length; iattrinuteIndex++) {
                if((result.body[index].attributes[iattrinuteIndex].attributeType)===('email')||(result.body[index].attributes[iattrinuteIndex].attributeType)===('Email'))
                qlikUserData.email=result.body[index].attributes[iattrinuteIndex].attributeValue;        
                
                if((result.body[index].attributes[iattrinuteIndex].attributeType)===('group')||(result.body[index].attributes[iattrinuteIndex].attributeType)===('Group'))
                qlikUserData.group=result.body[index].attributes[iattrinuteIndex].attributeValue;
            }
        }        
        // qlikUserData.attributeType=result.body[index].attributes[0].attributeType
        userDetails.push({qlikUserData})     ;

    }
    // console.log("Qrs data",JSON.stringify(userDetails,null,4));
    // return userDetails;
    return callback(userDetails);
    // qlikUserData.userId=result.body[20].userId
    // qlikUserData.userDirectory=result.body[20].userDirectory
    // qlikUserData.name=result.body[20].name
    // qlikUserData.roles=result.body[20].roles
    // qlikUserData.attributes=result.body[20].attributes
    // qlikUserData.name=
    // console.log(Object.keys(result.body).length);
    // console.log("Qrs data",JSON.stringify(result.body[20].attributes[0].attributeType,null,4));
    //  console.log("Qrs data",JSON.stringify(userDetails,null,4));
});
        
}//matrix
module.exports=TokenInfo;
module.exports.QlikUser=x