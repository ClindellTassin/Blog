import expressAsyncHandler from "express-async-handler"
import Category from "../models/Category.js";

const createCategory = expressAsyncHandler(async (req, res) => {
    try {
        const category = await Category.create({
            user: req.user._id,
            title: req.body.title,
        });
        res.json(category);
    } catch (error) {
        res.json(error);
    }
});

const fetchCategories = expressAsyncHandler(async (req, res) => {
    try {
        const categories = await Category.find({}).populate('user').sort('-createdAt');
        res.json(categories);
    } catch (error) {
        res.json(error);
    }
});

const fetchCategory = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findById(id);
        res.json(category);
    } catch (error) {
        res.json(error);
    }
});

const updateCategory = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findByIdAndUpdate(id, { title: req.body.title }, { new: true, runValidators: true });
        res.json(category);
    } catch (error) {
        res.json(error);
    }
});

const deleteCategory = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findByIdAndDelete(id);
        res.json(category);
    } catch (error) {
        res.json(error);
    }
});

export {
    createCategory,
    fetchCategories,
    fetchCategory,
    updateCategory,
    deleteCategory
}