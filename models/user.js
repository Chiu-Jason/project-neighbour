const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: String,
    email: String, 
    password: String
});

module.exports = mongoose.model('userModel', userSchema);