var express = require('express')
var app = express()
var authenticator = require('../services/authenticator')

module.exports = function (req, res, next) {

    console.log("successfuxll",req.headers.authorization)
    // let decoded =  authenticator.validateMiddleware

    if (req.user.user_type == 3) {// Implement the middleware function based on the options object
        console.log("successfull")
        next();

    } else res.json({ err: true , msg : "unauthorizeddd"})
}