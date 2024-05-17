const express = require('express')
const userRoute = express()
const path = require('path')
const userController = require('../controller/userController')
const userAuth = require('../middleWares/userAuth')
userRoute.set('view engine', 'ejs')
userRoute.set('views', './view/user');


userRoute.get('/',userAuth.isLogin, userController.loadHome)

userRoute.get('/login',userAuth.isLogout, userController.loadLoagin)

userRoute.post('/login', userController.verifylogin);

userRoute.get('/register', userAuth.isLogout,userController.loadSignup)

userRoute.post('/register', userController.userRegister)

//---------- otp section -------///////

userRoute.get('/verifyotp',userAuth.isLogout, userController.loadVerifyotp)
userRoute.post('/send-otp', userController.sendOtpVerificationEmail)
userRoute.post('/verifyotp', userController.verifyotp)



userRoute.get('/profile',userAuth.isLogin, userController.loadFrofile)

 //--------- ----- shope -------------////
 userRoute.get('/shop',userController.loadshop)
userRoute.get('/productdetail',userController.productdetails)









module.exports = userRoute  