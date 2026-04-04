import mongoose from "mongoose"

// defining schema for comment section 
const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    videoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "videos",
        required: true,
    },
}, { timestamps: true });

// model for comments 
const comments = mongoose.model("comments", commentSchema)

export default comments