var express = require('express');
var app = express();

var http = require('http').createServer(app);
var io = require('socket.io')(http);

// const io = require('socket.io')();
var cors = require('cors')
var conn = require('./src/connections/conn')
const bodyParser = require('body-parser');
var products = require('./src/controllers/products')
var auth = require('./src/controllers/auth')
var messages = require('./src/controllers/messages')
var authenticator = require('./src/services/authenticator');


io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on("chat", (data, cb) => {
        console.log("msg received", data)
        io.emit("chat", data);
    });
});



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(auth)
app.use(authenticator.validateMiddleware)
app.use(messages)
app.use(products)


http.listen(8060, function () {
    console.log("I am running on 8060")
});



