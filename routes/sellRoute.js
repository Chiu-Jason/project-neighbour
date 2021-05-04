const express = require('express');
const route = express.Router();
const mongoose = require('mongoose')

const productModel = require('../models/product')
const checkAuthenticated= require('../middleware/check-auth')

route.use(express.static('public'))

//multer
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/image/product')
    },
    filename: function(req, file, cb){
        cb(null, req.body.name.toLowerCase() + '.jpeg')
    }
})
const upload = multer({storage: storage})

route.get('/', (req, res)=>{
    res.render('sell', {cart});
});

route.post('/', checkAuthenticated, upload.single('image'), async (req, res) => {
    const newItem = {
        _id: new mongoose.Types.ObjectId,
        city: req.body.city,
        category: req.body.category,
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        image: req.file.filename
    }
    await productModel.create(newItem)
    res.redirect('/products');
})

module.exports = route;