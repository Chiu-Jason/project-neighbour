
module.exports = function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        const errorMessage = 'Sign In required'
        return res.redirect('/error')
    }
}