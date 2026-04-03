import mongoose from "mongoose"

const commentSchema = new mongoose.Schema({
    comment: {
        type: String, 
        required: true
    },
    userName: {
        type: String,
        required: true
    }
})

const comments = mongoose.model("comments", commentSchema)

export default comments