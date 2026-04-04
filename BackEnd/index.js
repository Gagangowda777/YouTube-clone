import express from 'express'   // importing express 
import mongoose from 'mongoose' // importing mongoose
import dotenv from 'dotenv'     // importing dotenv
import cors from 'cors'         // importing cors 
import userRouter from './routes/user.route.js'
import channelRouter from './routes/channel.route.js'
import videoRouter from './routes/video.route.js'
import commentRouter from './routes/comment.route.js'

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/user", userRouter);
app.use("/api/channel", channelRouter);
app.use("/api/video", videoRouter);
app.use("/api/comment", commentRouter);

const port = process.env.PORT || 3000; // defining a port that is fetched by env file and added a callbak port incase if not able to fetch

// connecting mongoDB server and node server  
mongoose.connect(process.env.MONGO_URI) 
.then(()=>{
    console.log("DB Connected");
    app.listen(port, ()=>{console.log("server connected")})
})
.catch((err)=>{
    console.log("error", err);
})