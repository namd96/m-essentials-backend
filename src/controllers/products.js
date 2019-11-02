var express = require('express');
var router = express.Router();
var con = require('../connections/conn')
router.get('/products', function (req, res) {

    con.query("select * from products inner join users on products.vendor_id=users.user_id order by products.product_id desc", function (err, products) {
        if (err) {
            res.json({ err: true, ok: false, msg: "sql error" });
            console.log(err)
            return;
        }
        let data = []
        console.log(products)
        products.map((product) => {
            data.push({
                product_id: product.product_id, product_name: product.product_name, product_tag: product.product_tag, product_status: product.product_status, product_location: product.product_location, product_contact: {
                    vendor_name : product.user_name,
                    vendor_id : product.user_id,
                    product_contact_no : product.user_contact_no },
                    product_description: product.product_description, product_img: product.product_img
            })
        })

        dataToSend = {
            count: products.length,
            data
        }
        res.json(dataToSend)
    })

})

router.get('/product/:id', function(req,res){
    let stmt = "select * from products inner join users on products.vendor_id=users.user_id where product_id= ?"
    let options= [req.params.id]
    con.query(stmt,options, function (err, products) {
        if (err) {
            res.json({ err: true, ok: false, msg: "sql error" });
            console.log(err)
            return;
        }
        let data = []
        console.log(products)
        products.map((product) => {
            data.push({
                product_id: product.product_id, product_name: product.product_name, product_tag: product.product_tag, product_status: product.product_status, product_location: product.product_location, product_contact: {
                    vendor_name : product.user_name,
                    vendor_email : product.user_email,
                    vendor_id : product.user_id,
                    product_contact_no : product.user_contact_no },
                    product_description: product.product_description, 
                    product_cost: product.product_cost, 
                    unit: product.unit, 
                    quantity: product.quantity, 
                    product_img: product.product_img,
            })
        })

        dataToSend = {
            count: products.length,
            data
        }
        res.json(dataToSend)
    })

})

module.exports = router
