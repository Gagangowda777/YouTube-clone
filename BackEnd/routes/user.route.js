import express from "express"                                   // importing express 
import {register, login} from "../controller/user.controller.js"   // importing register and login logic from user.controller.js

const userRouter = express.Router()     // initialzong router 


userRouter.post("/register", register)  // register route 
userRouter.post("/login", login)        // login route 

export default userRouter