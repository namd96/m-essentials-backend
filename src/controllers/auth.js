var express = require('express');
var router = express.Router()
const io = require('socket.io')();

var authenticator = require('../services/authenticator')
var con = require('../connections/conn')




router.post('/login', function (req, res) {
   // var body = req.body;
   // con.query()
   
   let stmt = "select * from users where handle= ?  "
   let toInsert = [req.body.handle]
   con.query(stmt, toInsert, function (err, result) {
      if (err) {
         console.log("[failed the sql query]",err)
         res.json({ err: true , msg : "sql error"})
         return;
      }
      
      // console.log("login called ",result[0].password,req.body.password, result)
      if (!!result[0] && (result[0].password == req.body.password)) {
         let token = authenticator.createToken({ handle: req.body.handle, user_id : result[0].user_id, user_type : result[0].user_type })

         console.log("login called ")
         res.json({ err : false,login: true,user_id : result[0].user_id,token, user_name : result[0].user_name })
      } else {
         res.json({ err: true, msg: "invalid credentials" })
      }
   })

})

router.post('/register', function (req, res) {
   var body = req.body;
   console.log(body)
   if (!body || !body.user_name || !body.handle || !body.password) {
      res.json({ err: true, msg: "required fields are empty" });
      return;
   }
   console.log("register called")
   let stmt = "insert into users(user_name,handle, password,user_email,user_contact_no,user_type, created_At) values(?,?,?,?,?,?,?)"
   let toInsert = [body.user_name, body.handle, body.password,body.user_email,body.user_contact_no, body.user_type,new Date()]

   con.query(stmt, toInsert, function (err, result) {
      if (err) {
         console.log(err)
         res.json({ err: true, msg : "sql error" })
         return;
      }
      res.json({ err: false, registered: true })
   })
})

router.post('/admin/login', function (req, res) {
   let stmt = "select * from users where handle= ?  "
   let toInsert = [req.body.handle]
   con.query(stmt, toInsert, function (err, result) {
      if (err) {
         console.log("[failed the sql query]",err)
         res.json({ err: true , msg : "sql error"})
         return;
      }
      
      // console.log("login called ",result[0].password,req.body.password, result)
      if (!!result[0] && (result[0].password == req.body.password)) {
         let token = authenticator.createToken({ handle: req.body.handle, user_id : result[0].user_id, user_type : result[0].user_type })

         console.log("login called ")
         res.json({ err : false,login: true,user_id : result[0].user_id,token, user_name : result[0].user_name })
      } else {
         res.json({ err: true, msg: "invalid credentials" })
      }
   })
 })
router.post('/vendor/login', function (req, res) {
   let stmt = "select * from users where handle= ?  "
   let toInsert = [req.body.handle]
   con.query(stmt, toInsert, function (err, result) {
      if (err) {
         console.log("[failed the sql query]",err)
         res.json({ err: true , msg : "sql error"})
         return;
      }
      
      // console.log("login called ",result[0].password,req.body.password, result)
      if (!!result[0] && (result[0].password == req.body.password)) {
         let token = authenticator.createToken({ handle: req.body.handle, user_id : result[0].user_id, user_type : result[0].user_type })

         console.log("login called ")
         res.json({ err : false,login: true,user_id : result[0].user_id,token, user_name : result[0].user_name })
      } else {
         res.json({ err: true, msg: "invalid credentials" })
      }
   })
 })

module.exports = router