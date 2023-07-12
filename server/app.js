import cors from "cors";
import express from "express";
import {Server} from "socket.io";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import connectDB from "./config/db.js";
import userController from "./controller/user.js";
import chatController from "./controller/chats.js";
import messageController from "./controller/messages.js";

const app = express();
dotenv.config();
connectDB();

app.use(bodyParser.json());

app.use(cors());
app.use(express.json());

app.use("/auth", userController);
app.use("/chat", chatController);
app.use("/message", messageController);

const PORT = process.env.PORT || 5001;
let myServer = app.listen(PORT, async (req, res) => {
  // try {
  //   await connect();
  // } catch (err) {
  //   console.log(err.message);
  // }
  console.log(`App listening on port  http://localhost:${PORT}`);
});

const io = new Server(myServer, {
  pingTimeout: 6000,
  cors: {
    "Access-Control-Allow-Origin": "*",
    origin: "https://messanger-beryl.vercel.app",
    // credentials: true,
  },
});
io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("new message", (recievedMessage) => {
    var chat = recievedMessage.chat;
    chat.users.forEach((user) => {
      if (user == recievedMessage.sender._id) return;
      socket.in(user).emit("message recieved", recievedMessage);
    });
  });

  socket.off("setup", () => {
    socket.leave(userData._id);
  });
});
