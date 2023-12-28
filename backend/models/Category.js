import mongoose from "mongoose"

const categorySchema = new mongoose.Schema({
    user: {
        required: [true, "Author is required"],
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        required: [true, "Title is required"],
        type: String,
    },
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

export default Category;