const express = require('express');
const route = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const mongoose = require('mongoose');

const userModel = require('../models/user');

route.post('/register', async (req, res, next) => {
    await userModel.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                res.render('error');
            }
            else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        console.log(err)
                        return res.render('error');
                    }
                    else {
                        const user = new userModel({
                            _id: new mongoose.Types.ObjectId,
                            name: req.body.userName,
                            email: req.body.email,
                            password: hash
                        })
                        user
                            .save()
                            .then(res.redirect('/'))
                            .catch(err => {
                                console.log(err);
                                return res.render('error')
                            })
                    }
                })
            }
        })
})

route.post('/login', (req, res, next) => {
    passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/error'
}) (req, res, next);
});

route.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

module.exports = route;