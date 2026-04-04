import express from "express";
import { addComment, fetchComment } from "../controller/comment.controller.js";
import { verifyToken } from "../middleware/auth.js";

const commentRouter = express.Router();

commentRouter.post("/addComment/:videoId", verifyToken, addComment);
commentRouter.get("/fetchComments/:videoId", fetchComment);

export default commentRouter;