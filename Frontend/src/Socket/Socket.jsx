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

export const cleanupSocket = () => {
  socket.off("receive-update");
};

export default socket;
