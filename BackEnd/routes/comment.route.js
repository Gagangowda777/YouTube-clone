import express from "express";
import { addComment, fetchComment, updateComment, deleteComment } from "../controller/comment.controller.js";
import { verifyToken } from "../middleware/auth.js";

const commentRouter = express.Router();

commentRouter.post("/addComment/:videoId", verifyToken, addComment);
commentRouter.get("/fetchComments/:videoId", fetchComment);
commentRouter.put("/updateComment/:commentId", verifyToken, updateComment);
commentRouter.delete("/deleteComment/:commentId", verifyToken, deleteComment);

export default commentRouter;