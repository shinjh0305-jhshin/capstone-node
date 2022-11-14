import express from "express";
import { getRooms } from "../controllers/chat";

const chatRouter = express.Router();

chatRouter.get("/", getRooms);

export default chatRouter;
