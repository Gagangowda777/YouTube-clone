import mongoose from "mongoose";

// defining schema for video section 
const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    thumbNail: {
        type: String,
        required: true,
    },
    channelName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    videoUrl: {
        type: String,
        required: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    category: {
        type: String,
        enum: ["Music", "Gaming", "Entertainment", "Education", "Sports", "News", "Tech", "Vlog", "Other"],
        default: "Other",
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
}, { timestamps: true });

// model for video 
const videos = mongoose.model("videos", videoSchema)

export default videos