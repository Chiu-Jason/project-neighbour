const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    city: String,
    category: String,
    name: String,
    description: String,
    price: Number,
    image: String
});

module.exports = mongoose.model('productModel', productsSchema);