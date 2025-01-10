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

  // Notify other users of a new connection
  socket.on("user-connected", (data) => {
    console.log("User connected data: ", data.currentUser);
    socket.join(data.room);
    socket.broadcast.to(data.room).emit("user-notify", data.currentUser);
  });

  // Handle margin updates
  socket.on("margin-cursor-update", async (data) => {
    console.log("Received margin update: ", data);
    socket.join(data.room);
    socket.broadcast.to(data.room).emit("recieve-cursor-update", data);
    await saveMarginPosition(data.leftMargin, data.rightMargin, data.room);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
  });
});

// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   // Emit user-connected event to the client
//   socket.emit("user-connected", {
//     socketId: socket.id,
//     message: "Welcome to the document editor!",
//   });

//   socket.on("get-document", async ({ id: document_id }) => {
//     try {
//       const document = await Document.findOne({ doc_id: document_id });

//       if (document) {
//         socket.join(document_id);

//         // Send the stored content back to the client
//         socket.emit("load-document", document.content);

//         socket.on("send-update", (delta) => {
//           socket.broadcast.to(document_id).emit("receive-update", delta);
//           console.log(delta);
//         });

//         socket.on("cursor-position", (position) => {
//           console.log(position);
//           // Broadcast the cursor position to all other clients in the same document room
//           socket.broadcast.to(document_id).emit("show-cursor", position);
//         });

//         socket.on("save-content", async (data) => {
//           try {
//             await Document.findOneAndUpdate(
//               { doc_id: data.documentId.id },
//               { content: JSON.stringify(data.content.content) },
//               { new: true }
//             );
//             console.log(`Document ${data.documentId.id} saved`);
//           } catch (error) {
//             console.error("Error saving document:", error);
//           }
//         });
//       } else {
//         console.log("Document not found!");
//       }
//     } catch (error) {
//       console.error("Document retrieval error:", error);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

// let cursors = {}; // Store cursor positions by user ID

// io.on("connection", (socket) => {
//   console.log("User connected: ", socket.id);

//   // socket.on("send-data", (data) => {
//   //   console.log(data);
//   //   socket.broadcast.emit("send-response", {
//   //     data: JSON.stringify(data.currentContent),
//   //     from: data.from,
//   //   });
//   // });

//   // Handle cursor updates
//   socket.on("cursor-update", (data) => {
//     // cursors[socket.id] = {
//     //   position: data.position,
//     //   user: data.user, // Contains name, color, etc.
//     // };
//     console.log(data.position);
//     io.emit("cursor-data", data.position); // Broadcast updated cursors
//   });

//   // Handle disconnection
//   socket.on("disconnect", () => {
//     console.log(`User disconnected: ${socket.id}`);
//     delete cursors[socket.id];
//     io.emit("cursor-data", cursors); // Notify clients of the updated list
//   });
// });

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
