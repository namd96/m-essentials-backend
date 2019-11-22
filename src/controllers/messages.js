var express = require('express');
var router = express.Router();
var con = require('../connections/conn')
router.get('/messages/:id', function (req, res) {
    getMessages(req, res)
})
router.get('/messengers', function (req, res) {
    getMessengers(req, res)
})
router.get('/latest-message/:id', function (req, res) {
    let stmt = "select * from messages where sender_id = ? order by message_id desc limit 1"
    let options = [req.params.id]
    con.query(stmt, options, function (err, result) {
        console.log(result)
        let data = [];
        if (err) {
            console.log(err)
            res.json({ err: true, ok: false, msg: "sql err" })
            return;
        }
        result.map((message) => {
            data.push({
             message: result[0].message, message_id: message.message_id,sender_id : message.sender_id, receiver_id : message.receiver_id
               

            })
        })
        res.json({ data })
    })
})
router.post('/message/:id', function (req, res) {
    console.log("[req.body.message]",req.body.message)
    let stmt = "insert into messages (sender_id, receiver_id, message, product_id) values (? ,? ,?, ?)"

    let options = [req.user.user_id, req.params.id, req.body.message, req.body.product_id]
    con.query(stmt, options, function (err, result) {
        if(err){
            console.log(err)
            res.json({err : true, msg : err});
            return;
        }
        console.log("result fter message post",result)
        getMessages(req, res)
    })
})
async function getMessengers(req, res) {
    let stmt = "select distinct messages.sender_id ,messages.sender_id, messages.receiver_id, u.user_name as receiver, users.user_name as sender from messages left join users on users.user_id=messages.sender_id left join users as u on u.user_id = messages.receiver_id where sender_id  = ? OR receiver_id = ?"
    let options = [req.user.user_id, req.user.user_id]
    await con.query(stmt, options, function (err, result) {
        console.log(result)
        let data = [];
        if (err) {
            console.log(err)
            res.json({ err: true, ok: false, msg: "sql err" })
            return;
        }
        result.map((message) => {
            data.push({
                sender_id: message.sender_id, receiver_id: message.receiver_id,
                sent_at: message.sent_at, message: result[0].message, message_id: message.message_id,
                receiver: message.receiver, sender: message.sender,

            })
        })
        res.json({ data })
    })

}
async function getMessages(req, res) {
    let stmt = "select *,  u.user_name as receiver, users.user_name as sender from messages left join users on users.user_id=messages.sender_id left join users as u on u.user_id = messages.receiver_id where (sender_id  = ? OR receiver_id = ?) and (sender_id  = ? OR receiver_id = ?) order by message_id"
    let options = [req.params.id, req.params.id, req.user.user_id, req.user.user_id]
    await con.query(stmt, options, function (err, result) {
        console.log(result)
        let data = [];
        if (err) {
            console.log(err)
            res.json({ err: true, ok: false, msg: "sql err" })
            return;
        }
        result.map((message) => {
            data.push({
                sender_id: message.sender_id, receiver_id: message.receiver_id,
                sent_at: message.sent_at, message: message.message, message_id: message.message_id,
                receiver: message.receiver, sender: message.sender
            })
        })
        res.json({ data })
    })

}

module.exports = router