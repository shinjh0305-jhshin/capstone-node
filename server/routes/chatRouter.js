import express from "express";
import {
  getAllRooms,
  enterRoom,
  checkUserInRoom,
  getAttachedRooms,
  getChat,
  postChat,
  postSendNotification,
} from "../controllers/chat";

const chatRouter = express.Router();

// api starts with rooms
chatRouter.get("/", getAllRooms);
chatRouter.post("/enter", enterRoom);
chatRouter.get("/:nickname", getAttachedRooms);
chatRouter.get("/:roomId/nickname/:nickname", checkUserInRoom);
chatRouter.get("/:roomId/chat", getChat);
chatRouter.post("/chat", postChat);
chatRouter.post("/notification", postSendNotification);

export default chatRouter;
