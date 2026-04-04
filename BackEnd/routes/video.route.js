import express from "express";
import { fetchVideo, uploadVideo, updateVideo, deleteVideo } from "../controller/video.controller.js";
import { verifyToken } from "../middleware/auth.js";

const videoRouter = express.Router();

videoRouter.get("/fetchvideo/:id", fetchVideo);
videoRouter.post("/uploadVideo", verifyToken, uploadVideo);
videoRouter.put("/updateVideo/:id", verifyToken, updateVideo);
videoRouter.delete("/deleteVideo/:id", verifyToken, deleteVideo);

export default videoRouter;