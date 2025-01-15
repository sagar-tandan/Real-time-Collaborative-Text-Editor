import { io } from "socket.io-client";

const socket = io("http://localhost:8000");
// const socket = io("https://miniature-waffle.onrender.com");

// export const sendUpdate = (delta) => {
//   socket.emit("send-update", delta);
// };

// export const sendDocumentId = (id) => {
//   socket.emit("get-document", id);
// };

// export const onReceiveUpdate = (callback) => {
//   socket.on("receive-update", callback);
// };

// export const onLoadDocument = (callback) => {
//   socket.on("load-document", callback);
// };

// export const onCursorMove = (position) => {
//   socket.emit("cursor-position", {
//     position,
//   });
// };

// export const onLoadCursor = (callback) => {
//   socket.on("show-cursor", callback);
// };

// export const onUserDisconnected = (callback) => {
//   socket.on("user-disconnected", callback);
// };

// export const cleanupSocket = () => {
//   socket.off("receive-update");
//   socket.off("cursor-position");
//   socket.off("show-cursor");
//   socket.off("user-disconnected");
// };

export default socket;
