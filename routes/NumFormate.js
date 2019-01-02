var express = require('express');
var router = express.Router();
var numeral = require('numeral');
var pinglogger= require('../pingLogging.js');

pinglogger.pingloggerSystem.info("------------------=====================----------------------")
pinglogger.pingloggerSystem.info("We are now in Number Format ")

router.post('/', function(req, res, next) {
    pinglogger.pingloggerSystem.info("NumFormate Route Succcessfully...");
    var string = numeral(req.body.CurrentValue).format(req.body.numFormate);
    // console.log(string);
    res.json(string);
});

module.exports = router