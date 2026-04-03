import express from "express"
import {fetchVideo, uploadVideo, deleteVideo} from "../controller/video.controller.js"

const videoRouter = express.Router()

videoRouter.get("/fetchvideo/:title", fetchVideo);
videoRouter.post("/uploadVideo", uploadVideo);
videoRouter.delete("/deleteVideo/:id", deleteVideo);

export default videoRouter;