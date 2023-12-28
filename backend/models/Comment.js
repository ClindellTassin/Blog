import mongoose from "mongoose"

const commentSchema = new mongoose.Schema({
    post: {
        required: [true, "Post is required"],
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    },
    user: {
        required: [true, "User is required"],
        type: Object,
    },
    description: {
        required: [true, "Description is required"],
        type: String,
    },
}, { timestamps: true });

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;