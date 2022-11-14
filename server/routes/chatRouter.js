import express from "express";
import { getAllRooms, enterRoom, checkUserInRoom } from "../controllers/chat";

const chatRouter = express.Router();

chatRouter.get("/", getAllRooms);
chatRouter.post("/enter", enterRoom);
chatRouter.get("/:roomId/nickname/:nickname", checkUserInRoom);

export default chatRouter;
