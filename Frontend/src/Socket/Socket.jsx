import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

export const sendUpdate = (delta) => {
  socket.emit("send-update", delta);
};

export const sendDocumentId = (id) => {
  socket.emit("get-document", id);
};

export const onReceiveUpdate = (callback) => {
  socket.on("receive-update", callback);
};

export const onLoadDocument = (callback) => {
  socket.on("load-document", callback);
};

export const onCursorMove = (callback) => {
  socket.emit("cursor-position", callback);
};

export const onLoadCursor = (callback) => {
  socket.on("show-cursor", callback);
};

export const cleanupSocket = () => {
  socket.off("receive-update");
  socket.off("cursor-position");
  socket.off("show-cursor");
};

export default socket;

// import { io } from "socket.io-client";

// // Initialize the Socket.IO connection
// const socket = io("http://localhost:8000", {
//   reconnectionAttempts: 5, // Retry up to 5 times if the connection is lost
//   transports: ["websocket"], // Use WebSocket for better performance
// });

// // Emit document updates to the server
// export const sendUpdate = (documentId, delta) => {
//   if (!documentId || !delta) {
//     console.error("sendUpdate: Missing documentId or delta");
//     return;
//   }
//   socket.emit("send-update", { documentId, delta });
// };

// // Send a request to load a specific document by ID
// export const sendDocumentId = (id) => {
//   if (!id) {
//     console.error("sendDocumentId: Missing document ID");
//     return;
//   }
//   socket.emit("get-document", id);
// };

// // Listen for updates from the server
// export const onReceiveUpdate = (callback) => {
//   if (typeof callback !== "function") {
//     console.error("onReceiveUpdate: Callback must be a function");
//     return;
//   }
//   socket.on("receive-update", callback);
// };

// // Listen for the initial document load from the server
// export const onLoadDocument = (callback) => {
//   if (typeof callback !== "function") {
//     console.error("onLoadDocument: Callback must be a function");
//     return;
//   }
//   socket.on("load-document", callback);
// };

// // Emit the current cursor position to the server
// export const sendCursorMove = (documentId, position) => {
//   if (!documentId || position === undefined) {
//     console.error("sendCursorMove: Missing documentId or position");
//     return;
//   }
//   socket.emit("cursor-position", { documentId, position });
// };

// // Listen for cursor positions from the server
// export const onLoadCursor = (callback) => {
//   if (typeof callback !== "function") {
//     console.error("onLoadCursor: Callback must be a function");
//     return;
//   }
//   socket.on("show-cursor", callback);
// };

// // Cleanup all socket listeners
// export const cleanupSocket = () => {
//   socket.off("receive-update");
//   socket.off("load-document");
//   socket.off("show-cursor");
//   console.log("Socket listeners cleaned up");
// };

// // Reconnect error handler
// socket.on("connect_error", (error) => {
//   console.error("Connection error:", error.message);
// });

// export default socket;
