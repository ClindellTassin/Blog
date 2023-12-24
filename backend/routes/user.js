import { Router } from "express";
import { block, deleteUser, fetchUser, fetchUsers, follow, getProfile, login, register, unblock, unfollow, updatePassword, updateProfile } from "../controllers/user.js";
import authMiddleware from "../middlewares/auth/auth.js";

const userRoutes = Router();

userRoutes.post('/register', register);
userRoutes.post('/login', login);
userRoutes.get('/:id', fetchUser);
userRoutes.get('/', fetchUsers);

// require authentication
userRoutes.get('/profile/:id', authMiddleware, getProfile);
userRoutes.put('/:id', authMiddleware, updateProfile);
userRoutes.put('/profile', authMiddleware, updatePassword);
userRoutes.put('/follow', authMiddleware, follow);
userRoutes.put('/unfollow', authMiddleware, unfollow);
userRoutes.delete('/:id', authMiddleware, deleteUser);
userRoutes.put('/block-user/:id', authMiddleware, block)
userRoutes.put('/unblock-user/:id', authMiddleware, unblock)

// require authorization

export default userRoutes;