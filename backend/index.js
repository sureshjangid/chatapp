const express = require("express");
const dotenv = require("dotenv");
const conntectDB = require("./config/db");
const userRouter = require("./Router/userRouter");
const color = require("colors");
const chatRouter = require("./Router/chatRouter");
const messageRouter = require("./Router/messageRouter");
const cors = require("cors");
const { notfound, errorHandler } = require("./middlewares/errorMiddleware");
const path = require("path");
const serverless = require("serverless-http");
dotenv.config({ path: "../.env" });
conntectDB();
const app = express();
app.use(express.json()); // to accept json data

app.use(cors());
app.use("/api/user", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/message", messageRouter);

// app.use(notfound);
app.use(errorHandler);
const hostname = "0.0.0.0";
const POST = 3002;
const server = app.listen(
  POST,
  console.log(`server start on ${hostname} ${POST}`.yellow.bold)
);
app.get("/", async (req, res) => {
  console.log("suresh jangid");
  res.send("success");
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("conntected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room" + room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });
  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMessageRecived) => {
    var chat = newMessageRecived.chat;
    if (!chat.users) return console.log("chat.user not defined");
    chat.users.forEach((user) => {
      if (user._id == newMessageRecived.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecived);
    });
  });

  socket.off("setup", () => {
    console.log("User Disconnected");
    socket.leaver(userData._id);
  });
});
module.exports.handler = serverless(app);
