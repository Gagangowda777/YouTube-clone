import express from "express";
import {createChannel, fetchInfo} from "../controller/channel.controller.js"

const channelRouter = express.Router()


channelRouter.post("/createChannel", createChannel);
channelRouter.get("/channelInfo/:name", fetchInfo);

export default channelRouter