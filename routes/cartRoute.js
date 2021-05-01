const express = require('express');
const route = express.Router();
const productModel = require('../models/product')

route.get('*', function(req, res, next) {
    res.locals.user = req.user || null;
    next();
  });
route.get('/', (req, res)=>{
    const subtotal = cart.reduce((acc, curr)=> acc + curr.price,0);
    let tax = subtotal * 0.12;
    parseFloat(tax).toFixed(2);
    let total = subtotal + tax;
    parseFloat(total).toFixed(2);
    res.render('cart', { cart: cart, subtotal, tax, total})
})
route.get('/:id', async (req, res, next) => {
    const selectedId = req.params.id
    const item = await productModel.findOne({"_id": selectedId }).exec();
    cart.push(item); 
    res.redirect('/products');
})
route.get('/delete/:id', (req, res, next)=>{
    const itemIndex = cart.findIndex(p => p.id == req.params.id)
    cart.splice(itemIndex, 1);
    res.redirect('/cart/');
})
module.exports = route;