const User = require("../model/userModels"); // Adjust the path if necessary
const bcrypt = require('bcrypt');

const dotenv = require("dotenv");
dotenv.config();

const securePassword= async(password)=>{
    try {
         const passwordHash=await bcrypt.hash(password,10);
         return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
}

const loadLogin = async(req,res)=>{
    try {
        res.render('adminLogin');
    } catch (error) {
        console.log(error.message);
    }
}  
  
 
//  -------- verfy admin ------  //


const verifyAdmin = async (req, res) => {
  try {
    const admin_email = process.env.ADMIN_EMAIL;
    const admin_pass =  process.env.ADMIN_PASS;
    
     
    const emailInput = req.body.email;
    const passInput = req.body.password;
    
    if (admin_email === emailInput && admin_pass === passInput) {
      req.session.adminId = emailInput;
      res.redirect("/admin/users");
    } else {
      res.render("adminLogin", { message: "Invalid username or password" });
    }
  } catch (error) {
    res.redirect("/500");
  }
};


     //-------  load user ------//
 
const loadUsers = async (req, res) => {
    try {
      let query = {};
      const userData = await User.find(query);
  
      res.render("users", { users: userData });
    } catch (error) {
      res.redirect("/500");
    }
  };

  const blockUnblockUser = async (req, res) => {
    try {
      const userId = req.body.userId;
      console.log(req.body);
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      user.isBlocked = !user.isBlocked;
      await user.save();
  
      res.redirect("/admin/users");
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

module.exports = { // Export your functions if needed
    securePassword,
    loadLogin,
    loadUsers,
    verifyAdmin,
    blockUnblockUser
   
   
};






