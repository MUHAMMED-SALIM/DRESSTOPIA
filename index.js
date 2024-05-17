const express   = require ('express')

const mongoose =require ('mongoose')
mongoose.connect("mongodb://127.0.0.1:27017/ms8cart")

const app = express()
const nocache= require('nocache')
const path = require('path')

 // ------- session -------//
const session = require('express-session')
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
  }));

 
app.use (nocache())


app.use(express.static(path.join(__dirname,'public')))


// ----------middle-ware--------//

app.use(express.json())
app.use(express.urlencoded({extended: true }))

// ----------view engine--------//

app.set ('view engine','ejs')
app.set('views',path.join(__dirname,'view'))

// ----------user route--------//

const userRoute = require('./routes/userRoute')
app.use('/',userRoute)


// ----------admin  route--------//

const adminRoute = require('./routes/adminRoute')
app.use('/admin',adminRoute)


app.listen(3030,()=>{

    console.log("http://localhost:3030");
    console.log("http://localhost:3030/admin");

})