import { Router } from "express";
import authMiddleware from "../middlewares/auth/auth.js";
import { createPost, deletePost, dislikePost, fetchPost, fetchPosts, likePost, updatePost } from "../controllers/post.js";
import { photoUpload, postPhotoResize } from "../middlewares/upload/photoUpload.js";

const postRoutes = Router();

postRoutes.get('/', fetchPosts);
postRoutes.get('/:id', fetchPost);

// require authentication
postRoutes.post('/createPost', authMiddleware, photoUpload.single('image'), postPhotoResize, createPost);
postRoutes.put('/:id', authMiddleware, updatePost);
postRoutes.delete('/:id', authMiddleware, deletePost);
postRoutes.put('/likes', authMiddleware, likePost);
postRoutes.put('/dislikes', authMiddleware, dislikePost);

// require admin

export default postRoutes;