import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import socket from "socket.io";
import userRouter from "./routes/userRouter";
import chatRouter from "./routes/chatRouter";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Max-Age", 600);
  next();
});

app.use("/users", userRouter);
app.use("/rooms", chatRouter);

const server = app.listen(process.env.SERVER_PORT, () => {
  console.log(` Server running on ${process.env.SERVER_PORT}`);
});

const io = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT"],
  },
});

io.on("connection", (socket) => {
  /*
  socket.on("registerAll", (rooms) => {
    rooms.forEach((room) => {
      socket.join(room.roomId);
    });
  });
  socket.on("register", (room) => {
    socket.join(room.roomId);
  });
  */
  socket.on("messageSent", (roomInfo) => {
    //console.log("socket On:", roomInfo);
    io.to(roomInfo.roomId).emit("messageReceived", roomInfo);
  });
  socket.on("joinRoom", (roomInfo) => {
    console.log("JOIN ROOM", roomInfo);
    socket.join(roomInfo.roomId, () => {});
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
