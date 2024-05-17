const User = require('../model/userModels');

const isLogin = async (req, res, next) => {
    try {

        if (req.session.userId) {
            if (req.path == '/login') {
                res.redirect('/')
                return
            }
            next()
        } else {
            res.redirect('/login');
        }

    } catch (error) {
        console.log(error.message);
    }
}

const isLogout = async (req, res, next) => {
    try {
        if (req.session.userId) {

            res.redirect('/');
            return

        }
        next();
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    isLogin,
    isLogout
}