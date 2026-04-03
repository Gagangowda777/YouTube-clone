import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    thumbNail: {
        type: String,
        required: true
    },
    channelName: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        default: 0
    }
})

const videos = mongoose.model("videos", videoSchema)

export default videos