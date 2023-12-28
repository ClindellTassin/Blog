import mongoose from "mongoose"

const emailSchema = new mongoose.Schema({
    from: {
        required: [true, "Sender is required"],
        type: String,
    },
    to: {
        required: [true, "Receiver is required"],
        type: String,
    },
    message: {
        required: [true, "Message is required"],
        type: String,
    },
    subject: {
        required: [true, "Subject is required"],
        type: String,
    },
    sentBy: {
        required: [true, "Subject is required"],
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    isFlagged: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

const Email = mongoose.model('Email', emailSchema);

export default Email;