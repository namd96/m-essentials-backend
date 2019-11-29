var express = require('express');
var app = express();

var http = require('http').createServer(app);
var io = require('socket.io')(http);

// const io = require('socket.io')();
var cors = require('cors')
var conn = require('./src/connections/conn')
const bodyParser = require('body-parser');
var products = require('./src/controllers/products')
var services = require('./src/controllers/services')
var auth = require('./src/controllers/auth')
var messages = require('./src/controllers/messages')
var vendorRouter = require('./src/controllers/vendor')
var superAdminRouter = require('./src/controllers/superAdmin')
var authenticator = require('./src/services/authenticator');
var vendorValidator = require('./src/services/vendorValidator');
var superAdminValidator = require('./src/services/superAdminValidator');
process.allSockets = {};

io.on('connection', function (socket) {
    socket.on("auth", async (authToken) => {
        // console.log("auth received", authToken);
        //decoded
        var token = await authenticator.decoder(authToken)
        console.log("[this is token connected]", token.user_id)
        socket.user = token;
        process.allSockets[socket.user.user_id] = socket;
    })
    socket.on("disconnect", () => {
        if (socket.user && socket.user.user_id) delete process.allSockets[socket.user.user_id]
    })
    console.log('a user connected');
    socket.on("chat", (data, cb) => {
        console.log("msg received", data)
        let stmt = "insert into messages (sender_id, receiver_id, message) values (? ,? ,?)"
        let options = [socket.user.user_id, data.id, data.message]

        conn.query(stmt, options, function (err, result) {
            if(err){
                return;
            }
            console.log(result)
        })
        // to do: find out the receiver id from data
        // io.sockets ...3rd_socket.user.id should be = receiver_id then 3rd_socket.to
        let third_socket = process.allSockets[data.id]
        if (third_socket) {
            // console.log("[io.clients]", io.clients)
            let msg = {
                sender_id: socket.user.user_id,
                message: data.message,
                receiver_id: data.id
            }
            third_socket.emit("chat", msg)
            console.log("ends")
        }
        else {
            // database entry
        }
        // console.log("[io.sockets.sockets]", io.sockets.sockets)
        // io.emit("chat", data);
    });
});




app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(auth)
app.use(authenticator.validateMiddleware)
app.use(messages)
app.use(products)
app.use(services)
app.use('/vendor', vendorValidator)
app.use(vendorRouter)
app.use('/superadmin', superAdminValidator)
app.use(superAdminRouter)


http.listen(8060, function () {
    console.log("I am running on 8060")
});



