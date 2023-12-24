import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
const { genSalt, hash, compare } = bcrypt;

const userSchema = new Schema({
    firstName: {
        required: [true, "First name is required"],
        type: String,
    },
    lastName: {
        required: [true, "Last name is required"],
        type: String,
    },
    profilePhoto: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2017/05/13/09/04/question-mark-2309040_1280.jpg',
    },
    email: {
        required: [true, "Email is required"],
        type: String,
    },
    bio: {
        type: String,
    },
    password: {
        required: [true, "Password is required"],
        type: String,
    },
    postCount: {
        type: String,
        default: 0,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ['Admin', 'Guest', 'Blogger'],
    },
    isFollowing: {
        type: Boolean,
        default: false,
    },
    isUnfollowing: {
        type: Boolean,
        default: false,
    },
    isAccountVerified: {
        type: Boolean,
        default: false,
    },
    accountVerificationToken: String,
    accountVerificationTokenExpires: Date,
    viewedBy: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    followers: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    following: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: false,
    },
}, {
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
    timestamps: true,
});

// hash password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
    next();
});

// match password
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await compare(enteredPassword, this.password);
};

const User = model('User', userSchema);

export default User;