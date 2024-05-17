const product = require('../model/productModel')
const category = require("../model/categoryModel")
const path = require("path")

const loadCategory = async (req, res) => {
    try {
        const categoryData = await category.find()

        const messages = req.messages;
        res.render('category', { categoryData, messages });
    } catch (error) {
        console.log(error.message);
    }
};
const addCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newCategory = new category({ name, description });
        await newCategory.save();

        res.redirect('/admin/category');
    } catch (error) {
        console.error(error.message);
        res.redirect('/admin/category');
    }
};

const deleteCategory = async (req, res) => {

    try {
        console.log(req.query)
        const categoryId = req.query.id
        await category.deleteOne({ _id: categoryId })
        res.json({ success: true })
    } catch (error) {
        console.log(error.message);
    }
}

const listOrUnlist = async (req, res) => {
    try {
        
        const categoryId = req.query.id;
        const categoryData = await category.findById(categoryId);

        if (!categoryData) {
            return res.status(404).json({ error: 'Category not found' });
        }

        if (categoryData.is_listed) {

            categoryData.is_listed = false;
        } else {

            categoryData.is_listed = true;
        }

        await categoryData.save();

        res.json({ success: true, category: categoryData });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
} 



const loadCategoryEdit = async (req, res) => {
    try {
        const categoryId = req.query.id;

        const Category = await category.findOne({ _id: categoryId })

        res.render('categoryEdit', { Data: Category });
       
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
};



const updateCategory = async (req, res) => {
    try {

     
        const id = req.body.categoryId;
        const Name = req.body.name.toUpperCase(); 
        const Description = req.body.description.toUpperCase(); 

        const existingCategory = await category.findOne({ name: Name });

        if (existingCategory) {
            res.render("categoryEdit", {
                message: "Category already exists",
                Data: existingCategory,
            });
        } else {
            const updateCategory = await category.updateOne(
                { _id: id },
                { $set: { name: Name, description: Description } }
            );

            res.redirect("/admin/category");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
};



module.exports = {
    loadCategory,
    addCategory,
    deleteCategory,
    listOrUnlist,
    updateCategory,
    loadCategoryEdit 
}