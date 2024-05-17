const express = require('express')
const adminRoute = express()
const path = require('path')
const adminController = require('../controller/adminController')
const productController = require('../controller/productController')
const categoryControlller = require('../controller/categoryController')
const upload = require('../middleWares/upload')
const adminAuth = require('../middleWares/adminAuth')
adminRoute.set('view engine', 'ejs')
adminRoute.set('views', './view/admin');


// ========================ADMIN LOGIN===============================//

adminRoute.get('/',adminAuth.isLogout,adminController.loadLogin)
adminRoute.post('/login', adminController.verifyAdmin)

// =====================  USERS  ============================//

adminRoute.get('/users',adminAuth.isLogin, adminController.loadUsers)
adminRoute.post("/block-user", adminController.blockUnblockUser);

// ==============================CATEGORY==========================================
adminRoute.get("/category",adminAuth.isLogin, categoryControlller.loadCategory);
adminRoute.post('/category', categoryControlller.addCategory);
adminRoute.delete('/category/deleteCategory', categoryControlller.deleteCategory);
adminRoute.post('/category/listOrUnlist', categoryControlller.listOrUnlist)
adminRoute.get('/edit', categoryControlller.loadCategoryEdit)
adminRoute.post('/edit', categoryControlller.updateCategory)


// ===============================PRODUCT============================================
adminRoute.get("/products", adminAuth.isLogin,productController.loadProduct);
adminRoute.get('/products/addProducts', productController.loadaddProduct)
adminRoute.post('/products/addProducts',upload.upload.array('image',4), productController.addProducts)
adminRoute.get('/editProducts', productController.loadEditProduct);
adminRoute.post('/editProducts', productController.editProduct)
adminRoute.get('/deleteProduct', productController.deleteProduct);









module.exports = adminRoute