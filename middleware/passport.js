const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const userModel = require('../models/user');

module.exports = function (passport) {
    const authenticateUser = (email, password, done) => {
        userModel.findOne({ email: email })
            .exec()
            .then(user => {
                if (!user) {
                    console.log('User does not exist')
                    return done(null, false, { message: 'Email or Password is incorrect' })
                }
                bcrypt.compare(password, user.password, async (err, isMatch) => {
                    if (err) {
                        console.log(err)
                        throw err;
                    };
                    if (isMatch) {
                        console.log('it works')
                        return done(null, user);
                    }
                    else {
                        return done(null, false, { message: 'Email or Password is incorrect' })
                    }
                })
            })
            .catch(err => {
                console.log(err);
                return done(err)
            });
    }
    passport.use(new localStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        userModel.findById(id, function (err, user) {
            done(err, user);
        })
    })
}