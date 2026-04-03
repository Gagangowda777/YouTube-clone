import users from "../model/user.model.js"; // importing users from usermodel
import dotenv from 'dotenv'              // importing dotenv
import bcrypt from "bcryptjs"            // importing bcryptjs
import jwt from "jsonwebtoken"          // importing jsonwebtoken 
dotenv.config()                         // configuring dotenv to access .env 

const JWT_SECRET = process.env.JWT;  // initialzing jwt token 

// registration with email validation 
export const register = async (req, res)=>{
    try{
        const {name, email, password} = req.body;
        const existingUser = await users.findOne({email})
        if(existingUser){
            return res.status(400).json({
                message: "email already exists"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        
        const user = new users({name, email, password: hashedPassword})
        await user.save()

        return res.status(201).json({message: "user registered sucessfully"}) 
    }catch(err){
        return res.status(500).json({message: err.message})
    }
}

// login with JWT token creation 
export const login = async (req, res)=>{
    try{
        const {name, email, password} = req.body;
        const user = await users.findOne({name, email})
        if(!user){
            return res.status(400).json({
                message: "Invalid username or email"
            })
        }
        const match = await bcrypt.compare(password, user.password)
        if(!match){
            return res.status(400).json({
                message: "Wrong password"
            })
        }
        const token = jwt.sign({id: user._id}, JWT_SECRET, {expiresIn: "1d"})
        res.json({token, user: {id: user._id, name:user.name, email: user.email}})
    }catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
}