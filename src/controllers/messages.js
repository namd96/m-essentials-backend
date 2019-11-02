var express = require('express');
var router = express.Router();
var con = require('../connections/conn')
router.get('/messages/:id', function (req, res) {
    getMessages(req, res)
})
router.post('/message/:id', function (req, res) {
    let stmt = "insert into messages (sender_id, receiver_id, message) values (? ,? ,?)"
    let options = [req.user.user_id, req.params.id, req.body.message]
    con.query(stmt, options, function (err, result) {
        getMessages(req, res)
    })
})
async function getMessages(req, res) {
    let stmt = "select *, u.user_name as receiver, users.user_name as sender from messages left join users on users.user_id=messages.sender_id left join users as u on u.user_id = messages.receiver_id where sender_id in ( ?, ?) OR receiver_id in (?, ?)"
    let options = [req.user.user_id, req.params.id, req.params.id, req.user.user_id]
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
        res.json(data)
    })

}

module.exports = router