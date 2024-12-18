import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { errorHandler } from "./middleware/errorHandler.js";
import morgan from "morgan";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { AuthRouter } from "./routes/v1/auth.js";
import { createDocument } from "./controllers/document.controller.js";
import { DocumentRouter } from "./routes/v1/document.js";

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
  console.log("User connected:", socket.id);
  socket.on("get-document", ({ id: document_id }) => {
    console.log(document_id);
    // Storing new document id into Database
    // createDocument(document_id);

    socket.join(document_id);

    socket.on("send-update", (delta) => {
      socket.broadcast.to(document_id).emit("receive-update", delta);
      console.log(delta);
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use("/api/auth", AuthRouter);
app.use("/api/document", DocumentRouter);

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
