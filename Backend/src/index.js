import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { errorHandler } from "./middleware/errorHandler.js";
import morgan from "morgan";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { AuthRouter } from "./routes/v1/auth.js";

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

// io.on("connection", (socket) => {
//   console.log("A user connected", socket.id);

//   socket.on("send-message", (data) => {
//     socket.broadcast.emit("recieve-changes", data);
//     console.log(data);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected: ", socket.id);
//   });
// });

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Listen for text updates (deltas)
  socket.on("send-update", (delta) => {
    // Broadcast the delta to other clients
    socket.broadcast.emit("receive-update", delta);
    console.log(delta);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use("/api/auth", AuthRouter);

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
