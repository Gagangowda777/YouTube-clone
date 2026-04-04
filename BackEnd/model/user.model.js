import mongoose from "mongoose";    // importing mongoose 

// defininig user Schema 
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// defining schema model 
const users = mongoose.model("users", userSchema)

export default users; 