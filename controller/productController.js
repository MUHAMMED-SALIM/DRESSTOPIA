const product = require('../model/productModel')
const Category = require("../model/categoryModel")
const path     = require("path")
const sharp   = require('sharp')
const { log } = require('console')



const loadProduct = async (req,res)=>{

    try { 
        const productData = await product.find({})
    
        res.render('products',{products:productData})
        
    } catch (error) {
        console.log(error.message);
    }
}
const loadaddProduct = async (req, res) => {
    try {
        const categoryData = await Category.find();
        console.log("Category Data:", categoryData); 
        res.render('addProduct', { categoryData:categoryData });
    } catch (error) {
        console.log("Error:", error.message);
        res.status(500).send("Internal server error");
    }
};

// const addProducts = async (req, res) => {
//     try {
//         const existProduct = await product.findOne({ name: req.body.productName });
//         if (existProduct) {
//             return res.status(404).send({ message: "Product already exists" });
//         }

//         const {
//             productName,
//             description,
//             quantity,
//             price,
//             category,
//             date
//         } = req.body;

//         const filenames = [];

//         const selectedCategory = await Category.findOne({ name: category });
//         if ( req.files.length !== 4) {
//             return res.render("addProduct", {
//                 message: "4 images needed",
//                 category: req.body.category,
//             });
//         }

//         for (let i = 0; i < req.files.length; i++) {
//             const imagesPath = path.join(
//                 __dirname,
//                 "../public/sharpImage",
//                 req.files[i].filename
//             );
//             await sharp(req.files[i].path)
//                 .resize(800, 1200, { fit: "fill" })
//                 .toFile(imagesPath);
//             filenames.push(req.files[i].filename);
//         }

//         const newProduct = new product({
//             name: productName,
//             description,
//             quantity,
//             price,
//             image: filenames,
//             category: selectedCategory.name,
//             date
//         });

//         console.log(newProduct);

//         await newProduct.save();

//         res.redirect("/admin/products");
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).send({ message: "Internal server error" });
//     }
// };

const addProducts = async (req, res) => {
    try {
        const existProduct = await product.findOne({ name: req.body.productName });
        if (existProduct) {
            return res.status(404).send({ message: "Product already exists" });
        }

        const { productName, description, quantity, price, category, date } = req.body;
       


        const filenames = [];

        const selectedCategory = await Category.findOne({ name: category });
        console.log("selected",selectedCategory);
        if (!req.files || req.files.length === 0) {
            return res.render("addProduct", {
                message: "4 images needed",
                category: req.body.category,
            });
        }

        for (let i = 0; i < req.files.length; i++) {
            const imagesPath = path.join( __dirname,'../public/myImages', req.files[i].filename);
            const newPath = path.join( __dirname,'../public/sharpImage', req.files[i].filename);
            await sharp(imagesPath)
                .resize(800, 1200, { fit: "fill" })
                .toFile(newPath);
            filenames.push(req.files[i].filename);
        }

        const newProduct = new product({
            name: productName,
            description,
            quantity,
            price,
            image: filenames,
            category: selectedCategory._id,
            date,
        });

       

        await newProduct.save();

        res.redirect("/admin/products");
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: "Internal server error" });
    }
};
const loadEditProduct = async (req, res) => {
    try {
      const productsId = req.query.productsId;
      const data = await product.findOne({ _id: productsId });
      const categories = await Category.find({ is_listed: true }); 
      res.render("editProducts", { products: data, categories: categories }); 
    } catch (error) {
      console.log(error);
    }
};

const editProduct = async (req, res) => {
    try {
        const id = req.query.productsId;
        console.log(id, "Product ID");

        const { productName, description, quantity, price, category } = req.body;
        console.log(req.body, "Request Body");

        const updatedProduct = await product.findOneAndUpdate(
            { _id: id },
            {
                productName: productName,
                description: description,
                quantity: quantity,
                price: price,
                category: category
            },
            { new: true } 
        );

        if (!updatedProduct) {
            return res.status(404).send("Product not found");
        }

        res.redirect("/admin/products");
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error");
    }
};


const deleteProduct = async (req, res) => {
    try {
      const products = req.query.productsId;
     
      await product.deleteOne({ _id: products });
      res.redirect("/admin/products");
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  };
  

module.exports = {
    loadProduct,
    loadaddProduct,
    addProducts,
    loadEditProduct,
    deleteProduct,
    editProduct
}