import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { errorHandler } from "./middleware/errorHandler.js";
import morgan from "morgan";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { AuthRouter } from "./routes/v1/auth.js";
import { DocumentRouter } from "./routes/v1/document.js";
import Document from "./models/document.model.js";
import { OrganizationRouter } from "./routes/v1/organization.js";
import { saveMarginPosition } from "./controllers/document.controller.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);

  // socket.on("WebRTC-offer", (offer) => {
  //   console.log(offer);
  //   socket.broadcast.emit("webRTC-offer", offer);
  // });

  // socket.on("webRTC-answer", (answer) => {
  //   console.log(answer);
  //   socket.broadcast.emit("webRTC-answer", answer);
  // });

  // socket.on("ice-candidate", (candidate) => {
  //   console.log(candidate);
  //   socket.broadcast.emit("ice-candidate", candidate);
  // });

  // Notify other users of a new connection
  socket.on("user-connected", (data) => {
    console.log("User connected data: ", data.currentUser);
    socket.join(data.room);
    socket.broadcast.to(data.room).emit("user-notify", data.currentUser);
  });

  // Handle margin updates
  socket.on("margin-cursor-update", async (data) => {
    // console.log("Received margin update: ", data);
    socket.join(data.room);
    socket.broadcast.to(data.room).emit("recieve-cursor-update", data);
    await saveMarginPosition(data.leftMargin, data.rightMargin, data.room);
  });

  //Handle realtime rename
  socket.on("rename", (data) => {
    socket.join(data.room);
    socket.broadcast.to(data.room).emit("updated-docName", data.documentName);
  });

  //Handle userconnection
  socket.on("new_user", (data) => {
    // console.log(data);
    socket.join(data.room);
    socket.broadcast.to(data.room).emit("update_user", data.user);
  });

  socket.on("editorClosed", (data) => {
    // console.log(data);
    socket.join(data.room);
    socket.broadcast.to(data.room).emit("remove_user", data.user);
  });
  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
  });
});

app.use("/api/auth", AuthRouter);
app.use("/api/document", DocumentRouter);
app.use("/api/organization", OrganizationRouter);

app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => {
    console.log("DB Connected.");
  })
  .catch((error) => console.error("Error connecting to MongoDB:", error));

server.listen(port, () => {
  console.log("Server is Listening at port : " + port);
});
