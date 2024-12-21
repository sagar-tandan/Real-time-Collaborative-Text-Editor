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

  // Emit user-connected event to the client
  socket.emit("user-connected", {
    socketId: socket.id,
    message: "Welcome to the document editor!",
  });

  socket.on("get-document", async ({ id: document_id }) => {
    try {
      const document = await Document.findOne({ doc_id: document_id });

      if (document) {
        socket.join(document_id);

        // Send the stored content back to the client
        socket.emit("load-document", document.content);

        socket.on("send-update", (delta) => {
          socket.broadcast.to(document_id).emit("receive-update", delta);
        });

        socket.on("cursor-position", (position) => {
          console.log(position);
          // Broadcast the cursor position to all other clients in the same document room
          socket.broadcast.to(document_id).emit("show-cursor", position);
        });

        socket.on("save-content", async (data) => {
          try {
            await Document.findOneAndUpdate(
              { doc_id: data.documentId.id },
              { content: JSON.stringify(data.content.content) },
              { new: true }
            );
            console.log(`Document ${data.documentId.id} saved`);
          } catch (error) {
            console.error("Error saving document:", error);
          }
        });
      } else {
        console.log("Document not found!");
      }
    } catch (error) {
      console.error("Document retrieval error:", error);
    }
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
