import { io } from "socket.io-client";

const STREAM_URL = "/stream-service"; 
const CHAT_URL = "/chat-service"; 

export const connectToStreamSocket = () => {
  return io(STREAM_URL, {
    transports: ["websocket"], 
    reconnection: true,
  });
};

export const connectToChatSocket = () => {
  return io(CHAT_URL, {
    transports: ["websocket"],
    reconnection: true,
  });
};