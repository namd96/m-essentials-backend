var express = require('express');
var router = express.Router();
var con = require('../connections/conn')

router.post('/vendor/create-product', function (req, res) {
    let stmt = "insert into products (product_name, product_tag , product_cost, quantity, unit, product_location, product_description, product_img , vendor_id) values(?,?,?,?,?,?,?,?,?)"
    let options = [req.body.product_name, req.body.product_tag, req.body.product_cost, req.body.quantity, req.body.unit, req.body.product_location, req.body.product_description, req.body.product_img, req.body.vendor_id]
    con.query(stmt, options, function (err, res) {
        if (err) {
            res.json({ err: true, msg: "sql err" })
            console.log(err);
            return;
        };
        res.json({err : false})
    })
})
router.get("/vendor/categories", getAllCategories)
router.get("/vendor/meta_service", getAllMeta_services)
router.get("/vendor/services/:id", getAllServices)
router.put("/vendor/toggle-menu/:sub_service_id/:active", function (req, res) {
    let stmt = "update menu set status = ? where menu_id = ?"
    let options = [req.params.active, req.params.sub_service_id]
    con.query(stmt, options, function (err, result) {
        if (err) {
            res.json({ err: true, msg: "sql err" })
            console.log(err);
            return;
        }
        getMenu(req, res)
    })
})
router.put("/vendor/toggle-meta-service/:meta_service_id/:active", function (req, res) {
    let stmt = "update meta_services set meta_status = ? where meta_service_id = ?"
    let options = [req.params.active, req.params.meta_service_id]
    con.query(stmt, options, function (err, result) {
        if (err) {
            res.json({ err: true, msg: "sql err" })
            console.log(err);
            return;
        }
        res.json({ err: false })
        // getMenu(req,res)
    })
})

router.post("/vendor/meta_service", function (req, res) {
    let stmt = "insert into meta_services (cat_id,meta_service_name, meta_cost, meta_service_img, meta_cost_breakdown, location , meta_desc, contact_no, vendor_id) values(?,?,?,?,?,?,?,?,?) ";
    let options = [req.body.cat_id, req.body.meta_service_name, req.body.meta_cost, req.body.meta_service_img, req.body.meta_cost_breakdown, req.body.location, req.body.meta_desc, req.body.contact_no, req.user.user_id]
    con.query(stmt, options, function (err, result) {
        if (err) {
            res.json({ err: true, msg: "sql err" })
            console.log(err);
            return;
        }
        getAllMeta_services(req, res)
    })
})

function getAllMeta_services(req, res) {
    if (req.query.active) {
        stmt = "select * from meta_services where meta_status = 1 and vendor_id = ?"
    } else { stmt = "select * from meta_services where vendor_id = ?" }
    options = [req.user.user_id]
    con.query(stmt, options, function (err, result) {
        if (err) {
            res.json({ err: true, msg: "sql err" })
            console.log(err);
            return;
        }
        // let data = [];
        // result.map((meta_service) => {
        //     data.push({
        //         meta_service_name: meta_service.meta_service_name, meta_cost_breakdown: meta_service.meta_cost_breakdown, meta_cost: meta_service.meta_cost,
        //         meta_desc: meta_service.meta_desc, meta_service_img: meta_service.meta_service_img, location: meta_service.location, vendor_id: meta_service.vendor_id,
        //         meta_service_id: meta_service.meta_service_id
        //     })
        // })
        res.json({ data: result })
    })
}
router.post("/vendor/service/:id", function (req, res) {
    let stmt = "insert into services (meta_service_id,service_name, service_img, cost, descr,cost_breakdown, vendor_id ) values(?,?,?,?,?,?,?) ";
    let options = [req.params.id, req.body.service_name, req.body.service_img, req.body.cost, req.body.descr, req.body.cost_breakdown, req.user.user_id]
    con.query(stmt, options, function (err, result) {
        if (err) {
            res.json({ err: true, msg: "sql err" })
            console.log(err);
            return;
        }
        getAllServices(req, res)

    })
})

function getAllServices(req, res) {
    if (req.query.active) {
        stmt = "select * from services  inner join meta_services on meta_services.meta_service_id = services.meta_service_id where services.meta_service_id= ? and services.status = 1 order by sub_id desc" ;
    } else {
        stmt = "select * from services  inner join meta_services on meta_services.meta_service_id = services.meta_service_id where services.meta_service_id= ? order by sub_id desc";

    }
    options = [req.params.id]
    let data = [];
    con.query(stmt, options, function (err, result) {
        if (err) {
            res.json({ err: true, msg: "sql err" })
            console.log(err);
            return;
        }
        console.log(result)
        //   result=  result.map((service) => ({
        //         service_name: service.service_name, meta_service_id: service.meta_service_id,meta_desc : service.meta_desc,
        //         meta_cost : service.meta_cost, 

        //     }))
        res.json({ data: result, id :  result[0].sub_id })
    })
}

router.get("/vendor/menu/:sub_service_id", getMenu)
router.post("/vendor/menu/:sub_service_id", function (req, res) {
    let stmt = "insert into menu (sub_service_id, name__, img, cost, quantity ,meta_service_id) values (? ,? ,?,?,?,?) ";
    let options = [req.params.sub_service_id, req.body.name__, req.body.img, req.body.cost, req.body.quantity, req.body.meta_service_id];
    con.query(stmt, options, function (err, result) {
        getMenu(req, res)
    })

})
router.get("/vendor/metamenu/:meta_service_id", function (req, res) {
    let stmt = "select distinct name__ from menu where meta_service_id = ?"
    let options = [req.params.meta_service_id];
    con.query(stmt, options, function (err, result) {
        if (err) {
            res.json({ err: true, msg: "sql err" })
            console.log(err);
            return;
        }
        res.json({ data: result })
    })

})
router.post("/vendor/create-request", function (req, res) {

    let stmt = "insert into admin_requests (user_id,title) values ( ? , ? )";
    let options = [req.user.user_id, req.body.title]
    con.query(stmt, options, function (err, result) {
        if (err) {
            res.json({ err: true, msg: "sql err" })
            console.log(err);
            return;
        }
        res.json({ err: false })
    })
})
function getMenu(req, res) {
    let stmt = "select * from menu where sub_service_id = ?"
    let options = [req.params.sub_service_id]
    con.query(stmt, options, function (err, result) {
        if (err) {
            res.json({ err: true, msg: "sql err" })
            console.log(err);
            return;
        }
        res.json({ data: result })
    })
}

function getAllCategories(req, res) {
    let stmt = "select * from categories where status=1"
    con.query(stmt, function (err, result) {
        // var data = [];
        if (err) {
            res.json({ err: true, msg: "sql err" })
            console.log(err);
            return;
        }
        console.log("yesss")
        // console.log(result)


        res.json({ data: result })
    })
}
// function getAllServiceList(req, res) {
//     let stmt = "select * from service_list inner join categories on service_list.category_id = categories.cat_id where status=1"
//     con.query(stmt, function (err, result) {
//         // var data = [];
//         if (err) {
//             res.json({ err: true, msg: "sql err" })
//             console.log(err);
//             return;
//         }
//         console.log("yesss service")
//         // console.log(result)
//         result = result.map((service) => ({
//             service_name: service.service_name, category_id: service.category_id, cat_name: service.cat_name, service_list_id: service.service_list_id
//         }))

//         res.json({ data: result })
//     })

// }

module.exports = router
// module.exports = getAllCategories
// module.exports = getAllServiceList
