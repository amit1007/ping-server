var express = require('express');
var pinglogger= require('../../pingLogging.js');

pinglogger.pingloggerSystem.info("------------------=====================----------------------")
pinglogger.pingloggerSystem.info("We are now in Comman Cal")


module.exports ={

    SetValue  : function SetValue(currentValue,percentage){
        try{
            var total = (currentValue * percentage)/100;
            return total;
        }       
          catch(error) {
            pinglogger.pingloggerSystem.error(error);
          }
    }
}