const express = require('express');
const route = express.Router();

const productModel = require('../models/product')

route.get('*', function(req, res, next) {
    res.locals.user = req.user || null;
    next();
  });
route.get('/', async (req, res) => {
    const products = await productModel.find().exec();
    res.render('products', { products: products, cart })
});
route.get('/:id', async (req, res, next) => {
    const selectedId = req.params.id;
    try {
        const product = await productModel.findById(selectedId);
        return res.render('details', { product: product, cart })
    }
    catch (err) {
        console.log(err)
        return res.redirect('/error')
    }
})
route.get('/city/:city', async (req, res, next) => {
    const selectedCity = req.params.city;
    const selectedProducts = await productModel.find({ "city": selectedCity });
    if (selectedProducts.length == 0) {
        console.log(selectedProducts)
        res.redirect('/error')
    }
    res.render('products', { products: selectedProducts, cart });
});
route.get('/category/:category', async (req, res, next) => {
    const selectedCategory = req.params.category
    let selectedProducts = await productModel.find({ "category": selectedCategory })
    if (selectedProducts.length == 0) {
        res.redirect('/error')
    }
    res.render('products', { products: selectedProducts, cart });
});

module.exports = route;