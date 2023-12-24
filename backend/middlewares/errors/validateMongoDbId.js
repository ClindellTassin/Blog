import mongoose from "mongoose";

const validateMongodbId = id => {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new Error('Invalid user id');
};

export default validateMongodbId;