import express from "express";
import { createChannel, fetchInfo } from "../controller/channel.controller.js";
import { verifyToken } from "../middleware/auth.js";

const channelRouter = express.Router();

channelRouter.post("/createChannel", verifyToken, createChannel);
channelRouter.get("/channelInfo/:name", fetchInfo);

export default channelRouter;