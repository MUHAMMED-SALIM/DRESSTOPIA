const User = require('../model/userModels')
const userOtpVerification = require('../model/userOtpverificaton')
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const product = require('../model/productModel')
const Category = require("../model/categoryModel")


// --------bcrypt-------//

const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
};


// ---------loadHome-------//

const loadHome = async (req, res) => {
    try {
        res.render('home')
    } catch (error) {
        console.log(error.message);
    }
}



const loadLoagin = async (req, res) => {

    try {

        res.render('login')

    } catch (error) {

        console.log(error.message);

    }

}

const verifylogin = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password

        const userData = await User.findOne({ email: email });
        if (userData) {

            const checkpassword = await bcrypt.compare(password, userData.password)

            if (checkpassword) {
                req.session.userId = userData._id
                console.log("user logged in");
                res.redirect("/")
            } else {
                res.render('login', { message: "incorrect password" })
            }


        } else {
            res.render('login', { message: "invalid email" })
        }

    } catch (error) {
        console.log(error.maessage);
    }
}

const loadFrofile = async (req, res) => {

    try {

        const userIn = req.session.userId
        res.render('profile')

    } catch (error) {
        console.log(error.message);

    }

}

const loadSignup = async (req, res) => {
    try {
        res.render('register')

    } catch (error) {
        console.log(error.message);

    }
}

const loadVerifyotp = async (req, res) => {

    try {
        const { email } = req.query
        res.render('verifyotp', { email })
    } catch (error) {
        console.log(error.message);

    }
}

//------------user Registration  -----------//

const userRegister = async (req, res) => {
    try {
        const { name, mobile, email, password } = req.body;


        if (!name || !mobile || !email || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const hashedPassword = await securePassword(password); // Hash the password

        const newUser = new User({
            username: name,
            email: email,
            phone: mobile,
            password: hashedPassword // Save the hashed password
        });

        await newUser.save();
        sendOtpVerificationEmail(email, res);
        console.log(req.body);
        // nvsm wmuc bzzm vvai 
        //pass

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

//------------otp verification  -----------//

const sendOtpVerificationEmail = async (email, res) => {
    try {


        let transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: true,
            auth: {
                user: 'zalimzyd8@gmail.com',
                pass: "nvsm wmuc bzzm vvai ",
            },
        });

        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

        const otpExpirationMinutes = 2;

        const mailOptions = {
            from: 'zalimzyd8@gmail.com',
            to: email,
            subject: "Signup OTP - Verify Your Account",
            html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #3498db; text-align: center;">Shoetopia</h1>
            <p style="text-align: center; font-size: 18px;">Dear User,</p>
            <p style="text-align: center; font-size: 16px;">Thank you for signing up with Shoetopia. To verify your account, please enter the following OTP (One-Time Password):</p>
            <h2 style="color: #2ecc71; text-align: center; font-size: 36px; margin: 20px 0;">${otp}</h2>
            <p style="text-align: center; font-size: 16px;">This OTP is valid for ${otpExpirationMinutes} minutes. If you did not initiate this action, please ignore this email.</p>
            <p style="text-align: center; font-size: 16px; margin-bottom: 20px;">For security reasons, do not share your OTP with anyone.</p>
            <p style="text-align: center; font-size: 16px;">If you have any questions or concerns, please contact our support team.</p>
            <p style="text-align: center; font-size: 16px; margin: 20px 0;">Best regards,<br>Shoetopia</p>
          </div>
        `,
        };


        const saltrounds = 10;

        const hashedOtp = await bcrypt.hash(otp, saltrounds);
        const newOtpVerification = await new userOtpVerification({
            email: email,
            otp: hashedOtp,
            createdAt: new Date(),


        });
        console.log(otp)

        // save otp record
        await newOtpVerification.save();
        const filter = { email: email };
        const update = {
            $set: {
                otp: hashedOtp,
                createdAt: Date.now(),
                expiresAt: Date.now() + 2 * 60 * 1000,
            },
        };

        const options = {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
        };

        const result = await userOtpVerification.findOneAndUpdate(
            filter,
            update,
            options
        );

        await transporter.sendMail(mailOptions);
        res.redirect(`/verifyotp?email=${email}`);
    } catch (error) {
        console.log(error.message)

    }
};

// ---------verify otp  ----------//

const verifyotp = async (req, res) => {
    try {

        const email = req.body.email;
        const enteredOTP = req.body.one + req.body.two + req.body.three + req.body.four;

        const userOtpRecord = await userOtpVerification.findOne({ email: email });

        if (!userOtpRecord) {
            return res.render("otpVerification", {
                message: 'OTP not found',
                id: email,
            });
        }

        const expiresAt = userOtpRecord.expiresAt;

        if (expiresAt < Date.now()) {
            return res.render("otpVerification", {
                message: 'OTP expired. <a href="/emailVerify">Try again</a>',
                id: email
            });
        }

        const hashedOTPFromDB = userOtpRecord.otp;

        if (!enteredOTP || !hashedOTPFromDB) {
            return res.render("otpVerification", {
                message: 'Invalid OTP data',
                id: email
            });
        }

        const validOTP = await bcrypt.compare(enteredOTP, hashedOTPFromDB);

        if (validOTP) {
            const userData = await User.findOne({ email: email });

            if (userData) {
                console.log('userData:', userData);
                req.session.userId = userData._id;

                res.json({ success: true })
            } else {
                console.error('User data not found for email:', email);
                return res.status(404).send('User data not found');
            }
        } else {
            return res.render("otpVerification", { message: 'Incorrect OTP', id: email });
        }
    } catch (error) {
        console.error('Error occurred during OTP verification:', error);
        return res.status(500).send("Internal Server Error");
    }
};

//---------------SHOPE--------------//

const loadshop = async (req, res) => {
    try {
        let query = { is_Listed: true };

        if (req.query.category) {
            query.category = req.query.category;
        }
        console.log(req.query.category);
        const productDetailes = await product.find({}).populate("category");
        //   console.log(productDetailes);
        const products = productDetailes.filter((product) => {
            if (product.category && product.category.is_Listed === true) {
                return product;
            }
        });
        console.log("products", products);
        const categories = await Category.find({});
        const userIn = req.session.userId;
        res.render("shop", {
            products: productDetailes,
            categories,
            user: req.session.userId,
            userIn,
        });
    } catch (error) {
        console.log(error.message);
    }
};

const productdetails = async (req, res) => {

    try {
    const productid=req.query.id

    const products = await product.findOne({_id:productid})
     console.log(products,"products");

    

        res.render("productdetail")

    } catch (error) {
        console.log(error.message);
    }
}



module.exports = {
    loadHome,
    loadLoagin,
    verifylogin,
    loadFrofile,
    loadSignup,
    loadVerifyotp,
    userRegister,
    securePassword,
    sendOtpVerificationEmail,
    verifyotp,
    loadshop,
    productdetails





}