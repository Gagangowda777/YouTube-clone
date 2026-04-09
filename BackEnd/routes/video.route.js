import express from "express";
import { fetchVideo, uploadVideo, updateVideo, deleteVideo, toggleLike } from "../controller/video.controller.js";
import { verifyToken } from "../middleware/auth.js";

const videoRouter = express.Router();

videoRouter.get("/fetchvideo", fetchVideo);
videoRouter.get("/fetchvideo/:id", fetchVideo);
videoRouter.post("/uploadVideo", verifyToken, uploadVideo);
videoRouter.put("/updateVideo/:id", verifyToken, updateVideo);
videoRouter.delete("/deleteVideo/:id", verifyToken, deleteVideo);
videoRouter.put("/likeVideo/:id", verifyToken, toggleLike);

export default videoRouter;