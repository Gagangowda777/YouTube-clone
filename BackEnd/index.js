import express from 'express'   // importing express 
import mongoose from 'mongoose' // importing mongoose
import dotenv from 'dotenv'     // importing dotenv
import cors from 'cors'         // importing cors 

dotenv.config()         // configuring dotenv to access .env 
const app = express()   // initializing app to express 
app.use(cors())         // middleware to use cors (which helps in api with differt port number to connect)
app.use(express.json()) // middleware to use 


// connecting mongoDB server 
mongoose.connect(process.env.MONGO_URI) 
.then(()=>{
    console.log("DB Connected");
})
.catch((err)=>{
    console.log("error", err);
})

// connecting to the server 
app.listen(process.env.PORT, ()=>{console.log("server connected")})
