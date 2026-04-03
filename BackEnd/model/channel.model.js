import mongoose from "mongoose"

const channelSchema = new mongoose.Schema({
    channelName: {
        type: String,
        required: true,
        unique: true
    },
    userName: {
        type: String, 
        required: true
    },
    channelDescription: {
        type: String,
        maxLength: 1000,
    },
    displayPicture: {
        type: String
    }
})

const channels = mongoose.model("channels", channelSchema);

export default channels;