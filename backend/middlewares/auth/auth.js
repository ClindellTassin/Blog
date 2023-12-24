import expressAsyncHandler from "express-async-handler"
import jwt from "jsonwebtoken"
import User from "../../models/User.js"

const authMiddleware = expressAsyncHandler(async (req, res, next) => {
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_KEY);
                const user = await User.findById(decoded?.id).select('-password');
                req.user = user;
                next();
            }
        } catch (error) {
            throw new Error('Unauthorized - token expired');
        }
    } else {
        throw new Error('There is no token attached to headers');
    }
});

export default authMiddleware;