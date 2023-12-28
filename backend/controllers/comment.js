import expressAsyncHandler from "express-async-handler"
import Comment from "../models/Comment.js";
import validateMongodbId from "../middlewares/errors/validateMongoDbId.js";

const createComment = expressAsyncHandler(async (req, res) => {
    const user = req.user;
    const { id, description } = req.body;

    try {
        const comment = await Comment.create({
            post: id,
            user,
            description
        });
        res.json(comment);
    } catch (error) {
        res.json(error);
    }
});

const fetchComments = expressAsyncHandler(async (req, res) => {
    try {
        const comments = await Comment.find({}).sort('-createdAt');
        res.json(comments);
    } catch (error) {
        res.json(error);
    }
});

const fetchComment = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    try {
        const comment = await Comment.findById(id);
        res.json(comment);
    } catch (error) {
        res.json(error);
    }
});

const updateComment = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    try {
        const comment = await Comment.findByIdAndUpdate(id, {
            post: req.body.id,
            user: req?.user,
            description: req.body.description,
        }, { new: true, runValidators: true });
        res.json(comment);
    } catch (error) {
        res.json(error);
    }
});

const deleteComment = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    try {
        const comment = await Comment.findOneAndDelete(id);
        res.json(comment);
    } catch (error) {
        res.json(error);
    }
});

export {
    createComment,
    fetchComments,
    fetchComment,
    updateComment,
    deleteComment
}