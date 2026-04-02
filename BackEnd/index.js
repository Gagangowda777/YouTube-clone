import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())



mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("DB Connected");
})
.catch((err)=>{
    console.log("error", err);
})

app.listen(process.env.PORT, ()=>{console.log("server connected")})
