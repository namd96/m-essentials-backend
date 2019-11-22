var express = require('express');
var router = express.Router();
var con = require('../connections/conn')

// import {getAllCategories} from './vendor'


router.post("/superadmin/category", function (req, res) {
    let stmt = "insert into categories (cat_name) values (?)"
    let options = [req.body.cat_name]
    con.query(stmt, options, function (err, result) {
        // console.log(result)
        if (err) {
            res.json({ err: true, msg: "sql err" })
            console.log(err);
            return;
        }
        getAllCategories(req, res)

    })
})
router.post("/superadmin/service_list", function (req, res) {
    let stmt = "insert into service_list (category_id, service_name) values (?,?)"
    let options = [req.body.category_id,req.body.service_name]
    con.query(stmt, options, function (err, result) {
        console.log("results",result)
        if (err) {
            res.json({ err: true, msg: "sql err" })
            console.log(err);
            return;
        }
        getAllServiceList(req, res)

    })
})
function getAllCategories(req, res) {
    let stmt = "select * from categories where status=1"
    con.query(stmt, function (err, result) {
        var data = [];
        if (err) {
            res.json({ err: true, msg: "sql err" })
            console.log(err);
            return;
        }
        console.log("yesss")
        // console.log(result)
        result.map((cat) => {
            data.push({ cat_name: cat.cat_name, cat_id: cat.cat_id })
        })

        res.json({ data })
    })

}
function getAllServiceList(req, res) {
    let stmt = "select * from service_list inner join categories on service_list.category_id = categories.cat_id where status=1"
    con.query(stmt, function (err, result) {
        var data = [];
        if (err) {
            res.json({ err: true, msg: "sql err" })
            console.log(err);
            return;
        }
        console.log("yesss service")
        // console.log(result)
        result.map((service) => {
            data.push({ service_name: service.service_name, category_id: service.category_id, cat_name: service.cat_name, service_list_id: service.service_list_id })
        })

        res.json({ data })
    })

}
module.exports = router
