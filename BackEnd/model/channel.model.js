import mongoose from "mongoose" // importing mongoose 

// defining schema for channel 
const channelSchema = new mongoose.Schema({
    channelName: {
        type: String,
        required: true,
        unique: true,
    },
    userName: {
        type: String,
        required: true,
    },
    channelDescription: {
        type: String,
        maxLength: 1000,
    },
    displayPicture: {
        type: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
});

// channel model 
const channels = mongoose.model("channels", channelSchema);

export default channels;