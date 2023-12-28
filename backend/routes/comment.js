import {Router} from "express"
import authMiddleware from "../middlewares/auth/auth.js";
import { createComment, deleteComment, fetchComment, fetchComments, updateComment } from "../controllers/comment.js";

const postRoutes = Router();

// require authentication
postRoutes.post('/', authMiddleware, createComment);
postRoutes.get('/', authMiddleware, fetchComments);
postRoutes.get('/:id', authMiddleware, fetchComment);
postRoutes.put('/:id', authMiddleware, updateComment);
postRoutes.delete('/:id', authMiddleware, deleteComment);

export default postRoutes;