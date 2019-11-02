var mysql = require('mysql');
var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    // password : "12345678910",
    port: "1433",
    database: "m-essentials"
    // password: ""
});

con.connect(function (err) {
    //   console.log("this is",err)
    if (err) {
        console.log("[failed the sql query]",err)
        // res.json({ err: true , msg : "sql error"})
        return;
     }
    console.log("Connected!");
});
module.exports = con;