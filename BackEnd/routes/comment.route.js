import express from "express"
import {addComment, fetchComment} from "../controller/comment.controller.js"

const commentRouter = express.Router()

commentRouter.post("/addComment", addComment);
commentRouter.get("/fetchComments", fetchComment);

export default commentRouter