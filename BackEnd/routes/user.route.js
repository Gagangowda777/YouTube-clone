import express from "express"                                   // importing express 
import {register, login} from "../controller/user.controller.js"   // importing register and login logic from user.controller.js

const router = express.Router()     // initialzong router 



router.post("/register", register)  // register route 
router.post("/login", login)        // login route 

export default router 