import { Router } from "express";
import { block, deleteUser, fetchUser, fetchUsers, follow, generatePasswordToken, generateVerificationToken, getProfile, login, register, resetPassword, unblock, unfollow, updatePassword, updateProfile, uploadProfilePhoto, verifyAccount } from "../controllers/user.js";
import authMiddleware from "../middlewares/auth/auth.js";
import { profilePhotoResize, profilePhotoUpload } from "../middlewares/upload/profilePhotoUpload.js";

const userRoutes = Router();

userRoutes.post('/register', register);
userRoutes.post('/login', login);
userRoutes.get('/:id', fetchUser);
userRoutes.get('/', fetchUsers);

// require authentication
userRoutes.post('/email-token', authMiddleware, generateVerificationToken);
userRoutes.put('/verify-account', authMiddleware, verifyAccount);
userRoutes.get('/profile/:id', authMiddleware, getProfile);
userRoutes.put('/profile', authMiddleware, profilePhotoUpload.single("image"), profilePhotoResize, uploadProfilePhoto);
userRoutes.put('/:id', authMiddleware, updateProfile);
userRoutes.put('/password', authMiddleware, updatePassword);
userRoutes.post('/password-token', generatePasswordToken);
userRoutes.put('/reset-password', resetPassword);
userRoutes.put('/follow', authMiddleware, follow);
userRoutes.put('/unfollow', authMiddleware, unfollow);
userRoutes.put('/block/:id', authMiddleware, block);
userRoutes.put('/unblock/:id', authMiddleware, unblock);
userRoutes.delete('/:id', authMiddleware, deleteUser);

// require authorization

export default userRoutes;