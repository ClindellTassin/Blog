import expressAsyncHandler from "express-async-handler"
import sgMail from "@sendgrid/mail"
import crypto from "crypto"
import path from "path"
import User from "../models/User.js"
import generateToken from "../config/generateToken.js"
import validateMongodbId from "../middlewares/errors/validateMongoDbId.js";
import cloudinaryImageUpload from "../config/cloudinary.js"

sgMail.setApiKey('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');
console.log(process.env.SENDGRID_API_KEY);

const register = expressAsyncHandler(async (req, res) => {
    const userExists = await User.findOne({ email: req?.body?.email });
    if (userExists) throw new Error('User already exists');

    try {
        const user = await User.create({
            firstName: req?.body?.firstName,
            lastName: req?.body?.lastName,
            email: req?.body?.email,
            password: req?.body?.password
        });
        res.json(user);
    } catch (error) {
        res.json(error)
    }
});

const login = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const userFound = await User.findOne({ email });
    if (userFound && await userFound.isPasswordMatched(password)) {
        res.json({
            _id: userFound?._id,
            firstName: userFound?.firstName,
            lastName: userFound?.lastName,
            email: userFound?.email,
            profilePhoto: userFound?.profilePhoto,
            isAdmin: userFound?.isAdmin,
            token: generateToken(userFound?._id)
        });
    } else {
        res.status(401);
        throw new Error('Invalid credentials');
    }
});

const fetchUsers = expressAsyncHandler(async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.json(error);
    }
});

const deleteUser = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    try {
        const user = await User.findByIdAndDelete(id);
        res.json(user);
    } catch (error) {
        res.json(error);
    }
});

const fetchUser = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    try {
        const user = await User.findById(id);
        res.json(user);
    } catch (error) {
        res.json(error);
    }
});

const getProfile = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    try {
        const profile = User.findById(id);
        res.json(profile);
    } catch (error) {
        res.json(error);
    }
});

const updateProfile = expressAsyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodbId(_id);

    const user = await User.findByIdAndUpdate(_id, {
        firstName: req?.body?.firstName,
        lastName: req?.body?.lastName,
        email: req?.body?.email,
        bio: req?.body?.bio,
    }, { new: true, runValidators: true });
    res.json(user);
});

const updatePassword = expressAsyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
    validateMongodbId(_id);

    const user = await User.findById(_id);
    if (password) {
        user.password = password;
        const updatedUser = await user.save();
        res.json(updatedUser);
    }
    res.json(user);
});

const follow = expressAsyncHandler(async (req, res) => {
    const { targetId } = req.body;
    const observerId = req.user.id;

    const target = await User.findById(targetId);
    const following = target?.followers?.find(user => user?.toString() === observerId?.toString());
    if (following) throw new Error('Already following this user');

    await User.findByIdAndUpdate(targetId, {
        $push: { followers: observerId },
        isFollowing: true,
    }, { new: true });

    await User.findByIdAndUpdate(observerId, {
        $push: { following: targetId },
    }, { new: true });

    res.json('following');
});

const unfollow = expressAsyncHandler(async (req, res) => {
    const { targetId } = req.body;
    const observerId = req.user.id;

    await User.findByIdAndUpdate(targetId, {
        $pull: { followers: observerId },
        isFollowing: false,
    }, { new: true });

    await User.findByIdAndUpdate(observerId, {
        $pull: { following: targetId },
    }, { new: true });

    res.json('unfollowing');
});

const block = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    const user = await User.findByIdAndUpdate(id, {
        isBlocked: true,
    }, { new: true });
    res.json(user)
});

const unblock = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    const user = await User.findByIdAndUpdate(id, {
        isBlocked: false,
    }, { new: true });
    res.json(user)
});

const generateVerificationToken = expressAsyncHandler(async (req, res) => {
    const userId = req.user.id;

    const user = await User.findById(userId);

    try {
        const generateToken = await user.createVerificationToken();
        await user.save();
        const resetURL = `verify account within 10 minutes. <a href="http://localhost:3000/verify-account/${generateToken}">Click Here to Verify</a>`
        const message = {
            from: 'clindell.tassin@selu.edu',
            to: 'clindelljtassin@gmail.com',
            subject: 'Verify Account',
            html: resetURL
        };

        await sgMail.send(message);
        res.json(resetURL);
    } catch (error) {
        res.json(error);
    }
});

const verifyAccount = expressAsyncHandler(async (req, res) => {
    const { token } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        accountVerificationToken: hashedToken,
        accountVerificationTokenExpires: { $gt: new Date() },
    });
    if (!user) throw new Error('Token expired - try again later');

    user.isAccountVerified = true;
    user.accountVerificationToken = undefined;
    user.accountVerificationTokenExpires = undefined;
    await user.save();
    res.json(user);
});

const generatePasswordToken = expressAsyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new Error('Username not found');

    try {
        const token = await user.createPasswordToken();
        await user.save();

        const resetURL = `reset password within 10 minutes. <a href="http://localhost:3000/reset-password/${token}">Click Here to Reset</a>`
        const message = {
            from: 'clindell.tassin@selu.edu',
            to: email,
            subject: 'Reset Password',
            html: resetURL
        };
        await sgMail.send(message);
        res.json({ msg: `Verification message sent successfully to ${user?.email}.<br/> ${resetURL}` });
    } catch (error) {
        res.json(error);
    }
});

const resetPassword = expressAsyncHandler(async (req, res) => {
    const { token, password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: new Date() },
    });
    if (!user) throw new Error('Token expired - try again later');

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
});

const uploadProfilePhoto = expressAsyncHandler(async (req, res) => {
    const { _id } = req.user;

    const localPath = `public/images/profile/${req.file.filename}`;
    const image = await cloudinaryImageUpload(localPath);

    const user = await User.findByIdAndUpdate(_id, {
        profilePhoto: image?.url,
    }, { new: true });
    res.json(user);
});

export {
    register,
    login,
    fetchUsers,
    deleteUser,
    fetchUser,
    getProfile,
    updateProfile,
    updatePassword,
    follow,
    unfollow,
    block,
    unblock,
    generateVerificationToken,
    verifyAccount,
    generatePasswordToken,
    resetPassword,
    uploadProfilePhoto
}