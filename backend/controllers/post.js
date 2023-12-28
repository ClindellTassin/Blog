import expressAsyncHandler from "express-async-handler"
import Filter from "bad-words"
import fs from "fs"
import validateMongodbId from "../middlewares/errors/validateMongoDbId.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import cloudinaryImageUpload from "../config/cloudinary.js";

const createPost = expressAsyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodbId(req.body.user);

    const filter = new Filter();
    const isProfane = filter.isProfane(req.body.title, req.body.description);
    if (isProfane) {
        await User.findByIdAndUpdate(_id, {
            isBlocked: true,
        });

        throw new Error('Temporarily blocked for using profanity');
    }

    const localPath = `public/images/post/${req.file.filename}`;
    const image = await cloudinaryImageUpload(localPath);

    try {
        const post = await Post.create({
            ...req.body,
            image: image?.url,
            user: _id,
            title: req.body.title.toLowerCase()
        });
        res.json(post);

        fs.unlinkSync(localPath);
    } catch (error) {
        res.json(error);
    }
});

const fetchPosts = expressAsyncHandler(async (req, res) => {
    try {
        const posts = await Post.find({}).populate('user');
        res.json(posts);
    } catch (error) {
        res.json(error);
    }
});

const fetchPost = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    try {
        const post = await Post.findById(id).populate('user').populate('disLikes').populate('likes');

        await Post.findByIdAndUpdate(id, {
            $inc: { numViews: 1 },
        }, { new: true });

        res.json(post);
    } catch (error) {
        res.json(error);
    }
});

const updatePost = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    try {
        const post = await Post.findByIdAndUpdate(id, {
            ...req.body,
            user: req.user?._id,
        }, { new: true });
        res.json(post);
    } catch (error) {
        res.json(error);
    }
});

const deletePost = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    try {
        const post = await Post.findOneAndDelete(id);
        res.json(post);
    } catch (error) {
        res.json(error);
    }
});

const likePost = expressAsyncHandler(async (req, res) => {
    const { id } = req?.body;

    const post = await Post.findById(id);
    const observerId = req?.user?._id;
    const isLiked = post?.isLiked;
    const disliked = post?.disLikes?.find(userId => userId?.toString() === observerId?.toString());

    if (disliked) {
        const post = await Post.findByIdAndUpdate(id, {
            $pull: { disLikes: observerId },
            isDisliked: false,
        }, { new: true });
        res.json(post);
    }


    if (isLiked) {
        const post = await Post.findByIdAndUpdate(id, {
            $pull: { likes: observerId },
            isLiked: false,
        }, { new: true });
        res.json(post);
    } else {
        const post = await Post.findByIdAndUpdate(id, {
            $push: { likes: observerId },
            isLiked: true,
        }, { new: true });
        res.json(post);
    }
});

const dislikePost = expressAsyncHandler(async (req, res) => {
    const { id } = req?.body;

    const post = await Post.findById(id);
    const observerId = req?.user?._id;
    const isDisliked = post?.isDisliked;
    const liked = post?.likes?.find(userId => userId.toString() === observerId?.toString());

    if (liked) {
        const post = await Post.findByIdAndUpdate(id, {
            $pull: { likes: observerId },
            isLiked: false,
        }, { new: true });
        res.json(post);
    }

    if (isDisliked) {
        const post = await Post.findByIdAndUpdate(id, {
            $pull: { disLikes: observerId },
            isDisliked: false,
        }, { new: true });
        res.json(post);
    } else {
        const post = await Post.findByIdAndUpdate(id, {
            $push: { disLikes: observerId },
            isDisliked: true,
        }, { new: true });
        res.json(post);
    }
});

export {
    createPost,
    fetchPosts,
    fetchPost,
    updatePost,
    deletePost,
    likePost,
    dislikePost
}