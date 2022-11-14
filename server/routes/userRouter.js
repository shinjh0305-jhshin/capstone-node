import express from "express";
const { login } = require("../controllers/login");
const { refresh } = require("../controllers/refresh");
const { authJWT } = require("../controllers/auth");
import { createRoom } from "../controllers/chat";

const userRouter = express.Router();

userRouter.post("/login", login);
userRouter.post("/refresh", refresh);
userRouter.get("/test", authJWT);
userRouter.post("/:nickname/createRoom", createRoom);

export default userRouter;
