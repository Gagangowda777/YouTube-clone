import users from "../model/user.model.js"; // importing user model 
import dotenv from 'dotenv';                // imporitng dotenv library 
import bcrypt from "bcryptjs";              // impoting bcryptjs
import jwt from "jsonwebtoken";             // importing jsonWebToken 

dotenv.config();                            // function to fetch all detials ffrom .env file 

const JWT_SECRET = process.env.JWT;         // initializing JWt secret 

// function to registration of a user 
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new users({ name, email, password: hashedPassword });
    await user.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// function to login a user 
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await users.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// function to fetch a profile 
export const getProfile = async (req, res) => {
  try {
    const user = await users.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};