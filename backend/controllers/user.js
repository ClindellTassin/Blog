import expressAsyncHandler from "express-async-handler"
import User from "../models/User.js"
import generateToken from "../config/generateToken.js"
import validateMongodbId from "../middlewares/errors/validateMongoDbId.js";

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
    unblock
}