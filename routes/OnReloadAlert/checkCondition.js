var express = require('express');
var router = express.Router();
module.exports={
    condition : function(condition,currentValue,triggerSetVal,triggeredValue){
        switch(condition){
            case ">"  :
                    if(triggeredValue > triggerSetVal){
                            console.log(">triggered");  
                        return true;                                           
                    }
                    else{
                        console.log(">NONtriggered"); 
                        return false;  
                    }
                break;
            case "<":
                    if(triggeredValue < triggerSetVal){
                        console.log("<triggered");  
                        return true;                                           
                    }
                    else{
                        console.log("<NONtriggered");  
                        return false;                       
                    }
            break;
            case ">=":
                    if(triggeredValue >= triggerSetVal){
                        console.log(">=triggered");  
                        return true;                   

                    }
                    else{
                        console.log(">=NONtriggered");
                        return false;  
                                             
                    }
            break;
            case "<=":
                    if(triggeredValue <= triggerSetVal){
                        console.log("<=triggered");
                        return true;  
                                                                             
                    }
                    else{
                        console.log("<=NONtriggered");   
                        return false;                                                                                                        
                    }
            break;
            case "==":
                    if(triggeredValue == triggerSetVal){
                        console.log("==triggered");
                        return true;  
                    }
                    else{
                        console.log("==NONtriggered");
                        return false;                                            
                    }
            break;
        }
    }
    
}