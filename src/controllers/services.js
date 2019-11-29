var express = require('express');
var router = express.Router();
var con = require('../connections/conn')

router.get('/meta-services', function (req, res) {

    con.query("select * from meta_services inner join users on meta_services.vendor_id=users.user_id where meta_status = 1 order by meta_services.meta_service_id  desc", function (err, services) {
        if (err) {
            res.json({ err: true, ok: false, msg: "sql error" });
            console.log(err)
            return;
        }

        if (!!req.query.query) {
            let queryStr = new RegExp(req.query.query, "i");
            queryData = services.filter(function (el) {
                return queryStr.test(el.service_name) || queryStr.test(el.meta_desc) || queryStr.test(el.location) /* .includes(query) */
            })
        }
        else {
            queryData = services
        }
        dataToSend = {
            count: queryData.length,
            data: queryData
        }
        res.json(dataToSend)
    })

})
router.get('/meta-service/:id', function (req, res) {
    let stmt = "select * from meta_services inner join users on meta_services.vendor_id=users.user_id where meta_service_id = ? order by meta_services.meta_service_id desc";
    let options = [req.params.id];
    con.query(stmt, options, function (err, service) {
        if (err) {
            res.json({ err: true, ok: false, msg: "sql error" });
            console.log(err)
            return;
        }


        dataToSend = {
            count: service.length,
            data: service
        }
        res.json(dataToSend)
    })

})
router.post("/vendor/create-request", function (req, res) {

    let stmt = "insert into admin_requests (user_id,title, req_type) values ( ? , ? , ?)";
    let options = [req.user.user_id, req.body.title, req.body.req_type]
    con.query(stmt, options, function (err, result) {
        if (err) {
            res.json({ err: true, msg: "sql err" })
            console.log(err);
            return;
        }
        res.json({ err: false })
    })
})
router.get('/services/:meta_id', function (req, res) {
    let stmt = "select * from services inner join users on services.vendor_id=users.user_id where meta_service_id = ? order by services.sub_id desc";
    let options = [req.params.meta_id];
    con.query(stmt, options, function (err, service) {
        console.log("check here service", service)
        if (err) {
            res.json({ err: true, ok: false, msg: "sql error" });
            console.log(err)
            return;
        }
        let withMenu = [];
        let promises = service.map((ser) => {
            return menuAppend(ser)
                .then((menu) => {
                    // console.log("check here", menu)

                    withMenu.push({ ...ser, menu })
                    // withMenu.push({[ser.sub_id]: { ...ser, menu }})

                    // return withMenu;
                })
        })

        Promise.all(promises)
            .then((serviceWithMenu) => {
                console.log("promise resolved", withMenu)
                res.json({
                    count: withMenu.length,
                    data: withMenu
                })
            })
        // dataToSend = {
        //     count: service.length,
        //     data: service
        // }
        // res.json(dataToSend)
    })

})

function menuAppend(ser) {
    return new Promise((resolve, reject) => {
        let statement = "select * from menu where sub_service_id = ?";
        let opt = [ser.sub_id]
        con.query(statement, opt, function (err, menu) {
            if (err) {
                reject(err)
            }


            resolve(menu)
        })
    })
}

module.exports = router
