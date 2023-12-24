import mongoose from "mongoose";

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connection Successful');
    } catch (error) {
        console.log(`Connection Failed: ${error.message}`);
    }
}

export default connect;