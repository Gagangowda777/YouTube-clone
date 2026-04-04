import express from "express";
import { register, login, getProfile } from "../controller/user.controller.js";
import { verifyToken } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/profile", verifyToken, getProfile);

export default userRouter;