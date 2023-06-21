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

dotenv.config({ path: "../.env" });
conntectDB();
const app = express();
app.use(express.json()); // to accept json data

app.use(cors());
app.use("/api/user", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/message", messageRouter);

// // ----------------- Depoloyment--------------
// const __dirname1 = path.resolve();
// if ("production" === "production") {
//   app.use(express.static(path.join(__dirname1, ".d./front-end/dist")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname1, "front-end", "dist", "index.html"));
//   });
// } else {
//   console.log("api running successfully");
// }

// // ----------------- Depoloyment--------------

app.use(notfound);
app.use(errorHandler);
const POST = 3002;
const server = app.listen(
  POST,
  console.log(`server start on ${POST}`.yellow.bold)
);

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
