import mongoose from "mongoose"

const postSchema = new mongoose.Schema({
    title: {
        required: [true, "Title is required"],
        type: String,
        trim: true,
    },
    category: {
        required: [true, "Category is required"],
        type: String,
        default: 'All',
    },
    isLiked: {
        type: Boolean,
        default: false,
    },
    isDisliked: {
        type: Boolean,
        default: false,
    },
    numViews: {
        type: Number,
        default: 0,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    disLikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Arthur is required"],
    },
    description: {
        required: [true, "Description is required"],
        type: String,
    },
    image: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2018/11/26/11/52/silhouette-3839252_1280.png',
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
});

const Post = mongoose.model("Post", postSchema);

export default Post;